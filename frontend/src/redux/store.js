import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice.js";
console.log(userSlice);
const store = configureStore({
    reducer:{
     user:userSlice
    }
})

export default store;