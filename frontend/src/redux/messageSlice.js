import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name: "message",
    initialState: {
        conversations: [],
        selectedUser: null,
        messages: [],
        onlineUsers: []
    },
    reducers: {
        setConversations: (state, action) => {
            state.conversations = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        }
    }
});

export const { setConversations, setSelectedUser, setMessages, addMessage, setOnlineUsers } = messageSlice.actions;
export default messageSlice.reducer;
