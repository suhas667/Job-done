const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000; // Server will run on http://localhost:3000

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Route to serve landing page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route to serve login page
app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Route to serve register page
app.get("/register.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
});

// Route to serve dashboard
app.get("/dashboard.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

// *** Add the registration route here ***
app.post("/register", (req, res) => {
    const { username, email, dob, password } = req.body;
    const usersFile = path.join(__dirname, "users.json");

    let users = [];

    // Read existing users data
    if (fs.existsSync(usersFile)) {
        users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
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

// *** Server Start (This should always be the last part) ***
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
