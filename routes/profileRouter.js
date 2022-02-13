const express = require("express");
const router = express.Router();

const { getUserProfile } = require("../controller/profileController");

router.get("/:userId", getUserProfile);

module.exports = router;
