require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const aiBridge = require('./ai_bridge');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/aeis_proctor';
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error (Non-fatal):', err.message);
        console.log('Continuing without database for proctoring testing...');
    });

// --- AUTH ROUTES ---

// Register
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ email, username, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username, email } });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// --- PROCTORING WEBSOCKET ---

aiBridge.start();

wss.on('connection', (ws) => {
    console.log('Client connected for proctoring');

    // Reset AI state for new session
    aiBridge.reset();

    const resultHandler = (result) => {
        if (ws.readyState === WebSocket.OPEN) {
            if (result.processing_time_ms) {
                console.log(`Frame processed in ${result.processing_time_ms}ms`);
            }
            ws.send(JSON.stringify(result));
        }
    };

    aiBridge.onResult(resultHandler);

    ws.on('message', (message) => {
        try {
            const payload = JSON.parse(message);
            if (payload.image) {
                aiBridge.analyze(payload.image);
            }
        } catch (e) {
            console.error('WS Message Error:', e);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        // Optional: remove listener if using shared bridge logic
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
