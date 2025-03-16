const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const axios = require("axios"); // Added axios for API requests

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

// *** Registration Route ***
app.post("/register", (req, res) => {
    const { username, email, dob, password } = req.body;
    const usersFile = path.join(__dirname, "users.json");

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

// *** Login Route ***
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const usersFile = path.join(__dirname, "users.json");

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

// *** Fetch Real-time Jobs Route ***
app.get("/jobs", async (req, res) => {
    try {
        const response = await axios.get("https://www.themuse.com/api/public/jobs?page=1");
        const jobs = response.data.results.map(job => ({
            title: job.name,
            company: job.company.name,
            location: job.locations.map(loc => loc.name).join(", "),
            url: job.refs.landing_page
        }));

        res.json({ jobs });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({ message: "Error fetching job data" });
    }
});

// *** Start Server (Always at the end) ***
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
