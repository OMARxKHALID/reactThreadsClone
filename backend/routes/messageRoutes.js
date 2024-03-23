import express  from "express";
import { getConversations, getMessages, sendMessage, deleteConversationsWithMessages } from "../controllers/messageController.js";
import protectedRoute from "../middlewares/protectedRoute.js";

const reducer = express.Router()

reducer.get("/conversations", protectedRoute, getConversations);
reducer.get("/:otherUserId", protectedRoute, getMessages);
reducer.post("/", protectedRoute, sendMessage);
reducer.delete("/delete/:conversationId", deleteConversationsWithMessages);

export default reducer;

