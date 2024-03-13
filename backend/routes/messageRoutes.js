import express  from "express";
import { getConversations, getMessages, sendMessage } from "../controllers/messageController.js";
import protectedRoute from "../middlewares/protectedRoute.js";

const reducer = express.Router()

reducer.get("/conversations", protectedRoute, getConversations);
reducer.get("/:otherUserId", protectedRoute, getMessages);
reducer.post("/", protectedRoute, sendMessage);

export default reducer;

