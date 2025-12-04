const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const DB = require('./database.js');
const { initializeWebsockets, notifyUser } = require('./websocket.js');

const authCookieName = 'token';

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json({ limit: '50mb' }));

app.use(cookieParser());

var apiRouter = express.Router();
app.use(`/api`, apiRouter);

app.use(express.static('public'));



// Middleware functions

async function authenticate(req, res, next) {
    const authToken = req.cookies[authCookieName];
    const user = await findUser('token', authToken);

    if (user) {
        req.user = user;
        next();
    } else {
        res.status(401).send({ msg: 'Unauthorized' });
    }
}

async function createUser(email, password, username) {
    const passwordHash = await bcrypt.hash(password, 10);

    const normalizedEmail = email.toLowerCase();
    const normalizedUsername = username.toLowerCase();

    const user = {
        email: normalizedEmail,
        password: passwordHash,
        username: normalizedUsername,
        token: uuid.v4(),
        profilePictureUrl: '/placeholder.png',
        friends: [],
    };

    await DB.addUser(user);

    return user;
}

async function findUser(field, value) {
    if (!value) return null;

    const normalizedValue = value.toLowerCase();

    if (field === 'token') {
        return DB.getUserByToken(value);
    }

    if (field === 'username') {
        return DB.getUserByUsername(normalizedValue);
    }

    return DB.getUser(normalizedValue);
}

function setAuthCookie(res, authToken) {
    res.cookie(authCookieName, authToken, {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        secure: true,
        httpOnly: true,
        sameSite: 'strict',
    });
}

async function checkLeaderboardAndNotify(newCatch, friendsList) {
    const currentAngler = newCatch.angler;
    const permittedAnglers = [currentAngler, ...friendsList];
    const socialCatches = await DB.getSocialCatches(permittedAnglers);
    const socialLeaderboard = socialCatches.slice(0,10);
    const rankIndex = socialLeaderboard.findIndex(c =>
        c.angler === currentAngler && c.weight === newCatch.weight
    );

    if (rankIndex > -1) {
        const rank = rankIndex + 1;

        const payload = {
            type: 'leaderboardSpot',
            message: `🏆 Congrats! Your ${newCatch.species} catch is now rank #${rank} in the Friends Leaderboard!`,
            details: { rank: rank, species: newCatch.species, weight: newCatch.weight, catchId: newCatch._id },
            timestamp: new Date().toISOString(),
        }

        notifyUser(currentAngler, payload);

        friendsList.forEach(friendUsername => {
            const friendPayload = {
                ...payload,
                message: `📢 Friend update! ${currentAngler}'s catch just hit rank #${rank} on the Friends Leaderboard!`,
            };
            notifyUser(friendUsername, friendPayload);
        });
    }
}

// API endpoints


apiRouter.post('/auth/create', async (req, res) => {
    if (await findUser('email', req.body.email)) {
        res.status(409).send({ msg: 'Existing user' });
    } else {
        const user = await createUser(req.body.email, req.body.password, req.body.username);

        setAuthCookie(res, user.token);
        res.send({ email: user.email, username: user.username });
    }
});

apiRouter.post('/auth/login', async (req, res) => {
    const user = await findUser('username', req.body.username);
    if (user) {
        if (await bcrypt.compare(req.body.password, user.password)) {
            user.token = uuid.v4();
            await DB.updateUser(user);
            setAuthCookie(res, user.token);

            if (user.friends && user.friends.length > 0) {
                user.friends.forEach(friendUsername => {
                    notifyUser(friendUsername, {
                        type: 'friendSignIn',
                        message: `✅ ${user.username} just signed in!`,
                        details: { username: user.username },
                        timestamp: new Date().toISOString(),
                    });
                });
            }

            res.send({ username: user.username });
            return;
        }
    }
    res.status(401).send({ msg: 'Unauthorized' });
});

apiRouter.delete('/auth/logout', async (req, res) => {
    const user = await findUser('token', req.cookies[authCookieName]);
    if (user) {
        await DB.removeUserToken(user.email);
    }
    res.clearCookie(authCookieName);
    res.status(204).end();
});

apiRouter.get('/user', authenticate, (req, res) => {
    res.send({
        username: req.user.username,
        email: req.user.email,
        profilePictureUrl: req.user.profilePictureUrl,
    });
});

apiRouter.post('/catch', authenticate, async (req, res) => {
    const newCatch = {
        ...req.body,
        angler: req.user.username,
        timestamp: new Date().toISOString(),
        weight: parseFloat(req.body.weight),
    };

    const result = await DB.addCatch(newCatch);

    if (result.acknowledged) {
        const savedCatch = { ...newCatch, _id: result.insertedId };
        const friends = req.user.friends || [];

        if (friends.length > 0) {
            friends.forEach(friendUsername => {
                notifyUser(friendUsername, {
                    type: 'newCatch',
                    message: `🎣 ${req.user.username} logged a new catch: ${savedCatch.species}!`,
                    details: { catch: savedCatch },
                    timestamp: new Date().toISOString(),
                });
            });
        }

        await checkLeaderboardAndNotify(savedCatch, friends);

        res.status(201).send(savedCatch);
    } else {
        res.status(500).send({ msg: 'Failed to save catch.' });
    }
});

apiRouter.get('/catches', authenticate, async (req, res) => {
    const userCatches = await DB.getCatchesByUser(req.user.username);
    res.send(userCatches);
});

apiRouter.get('/trip/:id', authenticate, async (req, res) => {
    const userTrips = await DB.getTripByUser(req.user.username);
    res.send(userTrips);
});

apiRouter.post('/trip', authenticate, async (req, res) => {
    const newTrip = {
        planner: req.user.username,
        name: req.body.name,
        location: req.body.location,
        date: req.body.date,
        guests: req.body.guests,
        notes: req.body.notes,
    };

    if (!newTrip.name || !newTrip.location || !newTrip.date) {
        return res.status(400).send({ msg: 'Trip name, location, and date required.' });
    }
    const result = await DB.addTrip(newTrip);

    if(result.acknowledged) {
        res.status(201).send({ ...newTrip, id: result.insertedId});
    } else {
        res.status(500).send({ msg: 'Failed to plan a trip.' });
    } 
});

apiRouter.delete('/trip/:id', authenticate, async (req, res) => {
    const tripId = req.params.id;
    const plannerUsername = req.user.username;

    if (!tripId || tripId.length < 12) {
        return res.status(400).send({ msg: 'Invalid trip ID format.' });
    }

    const deleteResult = await DB.deleteTrip(tripId, plannerUsername);

    if (deleteResult.deletedCount > 0) {
        res.status(204).end();
    } else {
        res.status(404).send({ msg: 'Trip not found or not authorized to delete trip.' });
    }
});

apiRouter.post('/friend/request', authenticate, async (req, res) => {
    const { friendEmail } = req.body;
    if (!friendEmail) {
        return res.status(400).send({ msg: 'Friend email required.' });
    }

    const friend = await findUser('email', friendEmail);

    if (friend) {
        const newRequest = {
            id: uuid.v4(),
            senderUsername: req.user.username,
            receiverUsername: friend.username,
            timestamp: new Date().toISOString(),
        };
        await DB.addPendingRequest(newRequest);

        res.status(200).send({ msg: `Friend request sent to ${friend.username}` });
    } else {
        res.status(404).send({ msg: `User with the email ${friendEmail} not found.` });
    }
});

apiRouter.get('/friends/pending', authenticate, async (req, res) =>{
    const pending = await DB.getPendingRequests(req.user.username);
    res.send(pending);
});

apiRouter.post('/friends/accept/:senderUsername', authenticate, async (req, res) => {
    const senderUsername = req.params.senderUsername;
    const receiverUsername = req.user.username;

    const deleteResult = await DB.removePendingRequest(senderUsername, receiverUsername);

    if (deleteResult.deletedCount > 0) {
        const sender = await findUser('username', senderUsername);
        await DB.addFriend(req.user.email, senderUsername);

        if (sender) {
            await DB.addFriend(sender.email, receiverUsername);
        }

        console.log(`${receiverUsername} accepted ${senderUsername}'s friend request.`);
        res.status(200).send({ msg: `Successfully accepted ${senderUsername}` });
    } else {
        res.status(404).send({ msg: 'Pending request not found.' });
    }
});

apiRouter.get('/friends', authenticate, (req, res) => {
    res.send(req.user.friends || []);
});

apiRouter.post('/friends/decline/:senderUsername', authenticate, async (req, res) => {
    const senderUsername = req.params.senderUsername;
    const receiverUsername = req.user.username;

    const deleteResult = await DB.removePendingRequest(senderUsername, receiverUsername);

    if (deleteResult.deletedCount > 0) {
        res.status(200).send({ msg: `Successfully declined ${senderUsername}` });
    } else {
        res.status(404).send({ msg: 'Pending request not found.' });
    }
});

apiRouter.delete('/friends/:friendUsername', authenticate, async (req, res) => {
    const friendUsername = req.params.friendUsername;
    const currentUserEmail = req.user.email;
    const currentUsername = req.user.username;

    const friend = await findUser('username', friendUsername);

    if (!friend) {
        return res.status(404).send({ msg: 'Friend not found or already removed.' });
    }

    await DB.removeFriend(currentUserEmail, friendUsername);

    await DB.removeFriend(friend.email, currentUsername);

    req.user.friends = req.user.friends.filter(f => f !== friendUsername);
    
    res.status(204).end();
});

apiRouter.get('/leaderboard', authenticate, async (req, res) => {
    const leaderboardType = req.query.type;
    const currentUser = req.user.username;


    let permittedAnglers = [];

    if (leaderboardType === 'friends') {
        const friends = req.user.friends || [];
        permittedAnglers = [currentUser, ...friends];
    } else {
        const allUsers = await DB.getAllUsernames();
        permittedAnglers = allUsers;
    }

    const socialCatches = await DB.getSocialCatches(permittedAnglers);
    res.send(socialCatches);
});
  
 const httpService = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

initializeWebsockets(httpService);