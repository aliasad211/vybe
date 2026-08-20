import { createSlice } from "@reduxjs/toolkit";

const countUnseen = (list) => list.filter(n => !n.seen).length;

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        unreadCount: 0
    },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload;
            state.unreadCount = countUnseen(action.payload);
        },
        addNotification: (state, action) => {
            //the socket push and the initial fetch can race — keep one row per id
            //instead of showing the same like twice
            if (state.notifications.some(n => n._id === action.payload._id)) return;
            state.notifications.unshift(action.payload);
            if (!action.payload.seen) state.unreadCount += 1;
        },
        //an unlike or unfollow retracts its notification, so drop it live rather
        //than leaving a stale row until the next reload
        removeNotificationById: (state, action) => {
            const removed = state.notifications.find(n => n._id === action.payload);
            if (!removed) return;
            state.notifications = state.notifications.filter(n => n._id !== action.payload);
            if (!removed.seen) state.unreadCount = Math.max(0, state.unreadCount - 1);
        },
        markAllSeen: (state) => {
            state.notifications = state.notifications.map(n => ({ ...n, seen: true }));
            state.unreadCount = 0;
        }
    }
});

export const { setNotifications, addNotification, removeNotificationById, markAllSeen } = notificationSlice.actions;
export default notificationSlice.reducer;
