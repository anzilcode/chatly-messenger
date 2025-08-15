const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

router.get("/:userId", async (req, res) => {
  const currentUserId = req.query.currentUserId; 
  const otherUserId = req.params.userId;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    }).sort({ createdAt: 1 }); 

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
