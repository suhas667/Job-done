const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const usersFile = path.join(__dirname, "../users.json");

// *** User Registration ***
router.post("/register", (req, res) => {
    const { username, email, dob, password } = req.body;

    let users = [];

    // Read existing users data
    if (fs.existsSync(usersFile)) {
        users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    }

    // Check if username is already taken
    if (users.some(user => user.username === username)) {
        return res.json({ success: false, message: "Username already exists!" });
    }

    // Generate new user ID
    const newUserId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

    // Calculate age from DOB
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    // Create new user object
    const newUser = {
        id: newUserId,
        username,
        email,
        dob,
        age,
        password
    };

    // Save user to file
    users.push(newUser);
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

    res.json({ success: true, message: "Registration successful! Redirecting to login..." });
});

// *** User Login ***
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!fs.existsSync(usersFile)) {
        return res.json({ success: false, message: "No registered users found." });
    }

    const users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.json({ success: true, message: "Login successful! Redirecting to dashboard..." });
    } else {
        res.json({ success: false, message: "Invalid Username or Password." });
    }
});

module.exports = router;
