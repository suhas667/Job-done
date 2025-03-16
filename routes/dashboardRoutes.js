const express = require("express");
const axios = require("axios");

const router = express.Router();

// *** Fetch Real-time Jobs ***
router.get("/jobs", async (req, res) => {
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

module.exports = router;
