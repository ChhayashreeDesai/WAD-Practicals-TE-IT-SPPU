require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors()); // Allows Angular to talk to this server
app.use(bodyParser.json());

// 1. Database Connection (Local MongoDB)
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/userDB";

mongoose.connect(mongoURI)
    .then(() => console.log("✅ Successfully connected to MongoDB!"))
    .catch(err => console.log("❌ Connection Error:", err));
// 2. User Schema (Blueprint for our data)
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// --- 3. THE FOUR CRUD APIs ---

// [CREATE] - Register a new user
app.post('/api/users/register', async (req, res) => {
    try {
        // Hash password before saving
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).send({ message: "User Registered Successfully!", user: { name: newUser.name, email: newUser.email } });
    } catch (error) {
        res.status(400).send({ message: "Registration failed", error });
    }
});

// [LOGIN] - Authenticate user
app.post('/api/users/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            res.send({ message: "Login successful!", user: { name: user.name, email: user.email } });
        } else {
            res.status(401).send({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(400).send({ message: "Login failed", error });
    }
});

// [READ] - Get user details by ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) res.send(user);
        else res.status(404).send({ message: "User not found" });
    } catch (error) {
        res.status(400).send({ message: "Error fetching user", error });
    }
});

// [UPDATE] - Update profile data
app.put('/api/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send({ message: "Profile Updated!", user: updatedUser });
    } catch (error) {
        res.status(400).send({ message: "Update failed", error });
    }
});

// [DELETE] - Remove a user account
app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.send({ message: "User Account Deleted" });
    } catch (error) {
        res.status(400).send({ message: "Delete failed", error });
    }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));