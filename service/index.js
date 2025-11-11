const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();
const DB = require('./database.js');

const authCookieName = 'token';

let catches = [];
let pendingFriendRequests = [];
let trips = [];

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

apiRouter.post('/catch', authenticate, (req, res) => {
    const newCatch = {
        id: uuid.v4(),
        angler: req.user.username,
        timestamp: new Date().toISOString(),
        ...req.body,
    };

    catches.push(newCatch);
    res.status(201).send(newCatch);
});

apiRouter.get('/catches', authenticate, (req, res) => {
    const userCatches = catches.filter(
        (catchItem) => catchItem.angler === req.user.username
    );
    res.send(userCatches);
});

apiRouter.get('/trips', authenticate, (req, res) => {
    const userTrips = trips.filter(
        (trip) => trip.planner === req.user.username
    ).sort((a, b) => new Date(a.date) - new Date(b.date));
    res.send(userTrips);
});

apiRouter.post('/trip', authenticate, (req, res) => {
    const newTrip = {
        id: uuid.v4(),
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

    trips.push(newTrip);
    res.status(201).send(newTrip);
});

apiRouter.delete('/trip/:id', authenticate, (req, res) => {
    const tripId = req.params.id;
    const initialLength = trips.length;

    trips = trips.filter(
        (trip) => !(trip.id === tripId && trip.planner === req.user.username)
    );

    if (trips.length < initialLength) {
        res.status(204).end();
    } else {
        res.status(404).send({ msg: 'Trip not found or not authorized to delete.' });
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
        pendingFriendRequests.push(newRequest);
        res.status(200).send({ msg: `Friend request sent to ${friend.username}` });
    } else {
        res.status(404).send({ msg: `User with the email ${friendEmail} not found.` });
    }
});

const mockFriends = (username) => {
    if (username === 'testuser') {
        return ['Jane Doe', 'Mike Jensen'];
    }
    return [];
};

apiRouter.get('/friends/pending', authenticate, (req, res) =>{
    const pending = pendingFriendRequests.filter(
        (requestItem) => requestItem.receiverUsername === req.user.username
    );
    res.send(pending);
});

apiRouter.post('/friends/accept/:senderUsername', authenticate, async (req, res) => {
    const senderUsername = req.params.senderUsername;
    const receiverUsername = req.user.username;

    const initialCount = pendingFriendRequests.length;
    pendingFriendRequests = pendingFriendRequests.filter(
        (pendingReq) => !(pendingReq.senderUsername === senderUsername && pendingReq.receiverUsername === receiverUsername)
    );
    if (pendingFriendRequests.length < initialCount) {
        console.log(`${receiverUsername} accepted ${senderUsername}'s friend request.`);
        res.status(200).send({ msg: `Successfully accepted ${senderUsername}` });
    } else {
        res.status(404).send({ msg: 'Pending request not found.' });
    }
});

apiRouter.post('/friends/decline/:senderUsername', authenticate, (req, res) => {
    const senderUsername = req.params.senderUsername;
    const receiverUsername = req.user.username;

    const initialCount = pendingFriendRequests.length;
    pendingFriendRequests = pendingFriendRequests.filter(
        (pendingReq) => !(pendingReq.senderUsername === senderUsername && pendingReq.receiverUsername === receiverUsername)
    );

    if (pendingFriendRequests.length < initialCount) {
        res.status(200).send({ msg: `Successfully declined ${senderUsername}` });
    } else {
        res.status(404).send({ msg: 'Pending request not found.' });
    }
});

apiRouter.get('/leaderboard', authenticate, (req, res) => {
    const currentUser = req.user.username;
    const friends = mockFriends(currentUser);

    const permittedAnglers = [currentUser, ...friends];

    const socialCatches = catches.filter(
        (catchItem) => permittedAnglers.includes(catchItem.angler)
    );
    res.send(socialCatches);
});
  
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});