const express = require("express");
const router = express.Router();

const {
  getNearToiletsList,
  getMapToiletsList,
  getToilet,
} = require("../controller/toiletsController");

router.get("/", getNearToiletsList);
router.get("/mapToiletsList", getMapToiletsList);
router.get("/:toiletId", getToilet);

module.exports = router;
