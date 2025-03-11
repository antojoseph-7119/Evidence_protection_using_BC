const express = require("express");
const router = express.Router();

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("connect.sid"); // Clear the session cookie
        res.json({ message: "Logged out successfully" });
    });
});

module.exports = router;
