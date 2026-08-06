import { createSlice } from "@reduxjs/toolkit";

const storySlice = createSlice({
   name:"story",
   initialState:{
     storyData:[],      //story tray on the feed — people the user follows
     currentStory:null, //the story open in the viewer
   },
   reducers:{
    setStoryData:(state,action)=>{
      state.storyData = action.payload
    },
    setCurrentStory:(state,action)=>{
      state.currentStory = action.payload
    },
    //swap one story in the tray in place — reading the list from state avoids
    //racing the tray fetch and clobbering it with a stale copy
    updateStoryInTray:(state,action)=>{
      state.storyData = state.storyData.map(
        story => story._id === action.payload?._id ? action.payload : story
      )
    }
   }
});

export const{setStoryData,setCurrentStory,updateStoryInTray} = storySlice.actions;
export default storySlice.reducer;
