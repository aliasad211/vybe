import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        unreadCount: 0
    },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter(n => !n.seen).length;
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        markAllSeen: (state) => {
            state.notifications = state.notifications.map(n => ({ ...n, seen: true }));
            state.unreadCount = 0;
        }
    }
});

export const { setNotifications, addNotification, markAllSeen } = notificationSlice.actions;
export default notificationSlice.reducer;
