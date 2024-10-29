const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(express.static('public'));

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY || 'your_refresh_secret_key';

// Helper function to read users from JSON file
const readUsersFromFile = () => {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'users.json'));
        return JSON.parse(data);
    } catch (error) {
        return []; // Return an empty array if the file doesn't exist or there's an error
    }
};

// Helper function to write users to JSON file
const writeUsersToFile = (users) => {
    fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
};

// Token verification middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(403).send('Invalid or expired token');
    }
};

// Register route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const users = readUsersFromFile(); // Read users from the JSON file
    const userExistsByUsername = users.find(u => u.username === username);
    const userExistsByEmail = users.find(u => u.email === email);
    
    if (userExistsByUsername) return res.status(400).send('Username already exists');
    if (userExistsByEmail) return res.status(400).send('Email already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    users.push({ username, email, password: hashedPassword });
    writeUsersToFile(users); // Write updated users back to the JSON file
    res.send('User  registered successfully');
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const users = readUsersFromFile();
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: 'Invalid credentials' });
    
    const accessToken = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1m' });    
    res.json({ accessToken }); // Send tokens in JSON format
});


// Profile route
app.get('/profile', verifyToken, (req, res) => {
    res.send(`Welcome to your profile, ${req.user.username}`);
});

// Refresh token route
app.post('/token', (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, REFRESH_SECRET_KEY);
        const accessToken = jwt.sign({ username: verified.username }, SECRET_KEY, { expiresIn: '1m' });
        res.json({ accessToken });
    } catch (err) {
        res.status(403).send('Invalid or expired token');
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));