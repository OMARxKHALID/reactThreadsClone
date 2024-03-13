import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  messages: [],
  selectedConversation: {
    _id: "",
    userId: "",
    username: "",
    userProfilePic: "",
  },
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setSelectedConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
  },
});

export const {
  setMessages,
  addMessage,
  setConversations,
  setSelectedConversation,
} = messagesSlice.actions;
export default messagesSlice.reducer;
