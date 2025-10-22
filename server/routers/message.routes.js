import express from "express";
import { authorization } from "../middlewares/auth.middleware.js";
import {
    sendMessage,
    fetchAllMessages,
    fetchMessageById,
    fetchTodayMsgStats,
    deleteMessageById,
    updateMessageStatus
} from "../controllers/message.controller.js";

const router = express.Router();

// admin get all messages
router.route("/getAllMessages").get(authorization, fetchAllMessages);

// admin get message by id
router.route("/getMessage/:id").get(authorization, fetchMessageById);

// admin get message stats
router.route("/getTodayMessageAndStats").get(authorization, fetchTodayMsgStats);

// admin update message status to read/unread (single/bulk)
router.route("/updateStatus").patch(authorization, updateMessageStatus);

// admin delete messages (single/bulk)
router.route("/delete").delete(authorization, deleteMessageById);

// send message for public use
router.route("/send").post(sendMessage);

export default router;