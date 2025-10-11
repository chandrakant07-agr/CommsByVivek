import express from "express";
import { authorization } from "../middleware/auth.middleware.js";
import {
    sendMessage,
    fetchAllMessages,
    deleteMessageById,
    updateMessageStatus
} from "../controllers/message.controller.js";

const router = express.Router();

// admin get all messages
router.route("/getAllMessages").get(authorization, fetchAllMessages);

// admin update message status to read/unread (single/bulk)
router.route("/updateStatus").patch(authorization, updateMessageStatus);

// admin delete messages (single/bulk)
router.route("/delete").delete(authorization, deleteMessageById);

// send message for public use
router.route("/send").post(sendMessage);

export default router;