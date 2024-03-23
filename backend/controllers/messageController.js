import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";

const sendMessage = async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.user._id;
    let { img } = req.body;


    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });
      await conversation.save();
    }
if (img) {
  const uploadedResponse = await cloudinary.uploader.upload(img);
  img = uploadedResponse.secure_url;
}
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
      img: img || "",
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);

    const recipientSocketId = getRecipientSocketId(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("error in sendMessage:", err);
  }
};

const getMessages = async (req, res) => {
  const { otherUserId } = req.params;
  const userId = req.user._id;

  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      return res.status(200).json([]);
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });


    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("error in getMessages:", err);
  }
};

const getConversations = async(req, res) => {
 const userId = req.user._id;
	try {
		const conversations = await Conversation.find({ participants: userId }).populate({
			path: "participants",
			select: "username profilePic",
		});

		// remove the current user from the participants array
		conversations.forEach((conversation) => {
			conversation.participants = conversation.participants.filter(
				(participant) => participant._id.toString() !== userId.toString()
			);
		});
		res.status(200).json(conversations);

  }catch (err) {
    res.status(500).json({ error: err.message });
    console.log("error in getMessages:", err);
  }

}

const deleteConversationsWithMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {    
    await Message.deleteMany({ conversationId });
    await Conversation.findByIdAndDelete(conversationId);
    res
      .status(200)
      .json({ message: "Conversation and messages deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in deleteConversationsWithMessages:", err);
  }
};

export {
  sendMessage,
  getMessages,
  getConversations,
  deleteConversationsWithMessages,
};
