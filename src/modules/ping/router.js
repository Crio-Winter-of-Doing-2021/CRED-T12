const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  return res.json({
    ping: "pong!"
  });
});

module.exports = router;