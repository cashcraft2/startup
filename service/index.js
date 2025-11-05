const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const express = require('express');
const uuid = require('uuid');
const app = express();

const authCookieName = 'token';

let users = [];
let catches = [];

const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());

app.use(cookieParser());

app.use(express.static('public'));

var apiRouter = express.Router();

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

    const user = {
        email: email,
        password: passwordHash,
        username: username,
        token: uuid.v4(),
        profilePictureUrl: '/placeholder.png',
    };

    users.push(user);

    return user;
}

async function findUser(field, value) {
    if (!value) return null;

    return users.find((u) => u[field] === value);
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

app.use(`/api`, apiRouter);

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
        delete user.token;
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
    res.send(catches);
});

apiRouter.post('/friend/request', authenticate, async (req, res) => {
    const { friendEmail } = req.body;
    if (!friendEmail) {
        return res.status(400).send({ msg: 'Friend email required.' });
    }

    const friend = await findUser('email', friendEmail);

    if (friend) {
        console.log(`MOCK: ${req.user.username} sent a friend request to ${friend.username}`);
        res.status(200).send({ msg: `Friend request sent to ${friendEmail}` });
    } else {
        res.status(404).send({ msg: `User with the email ${friendEmail} not found.` });
    }
});
  
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});