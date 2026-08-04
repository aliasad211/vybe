import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        userData:null,
        suggestedUsers:null,
        profileData:null,
        following:[]
    },
    reducers:{
        setUserData:(state,action)=>{
            state.userData = action.payload;
            //following may arrive as ids or as populated user objects
            state.following = action.payload?.following?.map(f => (f?._id || f).toString()) || [];
        },
        toggleFollow:(state,action)=>{
            const targetId = action.payload;
            if(state.following.includes(targetId)){
                state.following = state.following.filter(id => id !== targetId);
            }else{
                state.following.push(targetId);
            }
        },
        setSuggestedUsers:(state,action)=>{
            state.suggestedUsers = action.payload;
        },
        setProfileData:(state,action)=>{
            state.profileData = action.payload;
        }
    }
});

export const {setUserData,setSuggestedUsers,setProfileData,toggleFollow} = userSlice.actions;
export default userSlice.reducer;