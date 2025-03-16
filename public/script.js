document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    const jobList = document.getElementById("jobList");
    const logoutBtn = document.getElementById("logoutBtn");

    // Handle Registration
    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const dob = document.getElementById("dob").value;
            const password = document.getElementById("password").value;

            const response = await fetch("/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, dob, password })
            });

            const data = await response.json();
            alert(data.message);

            if (data.success) {
                window.location.href = "login.html"; // Redirect to login page after registration
            }
        });
    }

    // Handle Login
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const username = document.getElementById("loginUsername").value;
            const password = document.getElementById("loginPassword").value;

            const response = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            alert(data.message);

            if (data.success) {
                window.location.href = "dashboard.html"; // Redirect to dashboard
            }
        });
    }

    // Fetch and display real-time job listings on Dashboard
    if (jobList) {
        fetch("/jobs")
            .then(response => response.json())
            .then(data => {
                if (data.jobs.length > 0) {
                    jobList.innerHTML = data.jobs.map(job => `
                        <div class="job-card">
                            <h3>${job.title}</h3>
                            <p><strong>Company:</strong> ${job.company}</p>
                            <p><strong>Location:</strong> ${job.location}</p>
                            <a href="${job.url}" target="_blank">View Job</a>
                        </div>
                    `).join("");
                } else {
                    jobList.innerHTML = "<p>No jobs found.</p>";
                }
            })
            .catch(error => console.error("Error fetching jobs:", error));
    }

    // Logout function
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }
});
