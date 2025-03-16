import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChatList = createAsyncThunk("chat/", async(_, {
    rejectWithValue})=>{
        try {
            const {data} = await axios.get("/api/chats", {withCredentials : true})
            return data
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    })

const chatSlice = createSlice({
    name : "chat",
    initialState : {normalChatList : [], groupChatList : [], openedChat : null, loading : false},
    reducers : {},
    extraReducers : (builder)=>{
        builder
            .addCase(fetchChatList.pending, (state)=>{
                state.loading = true;
            })
            .addCase(fetchChatList.fulfilled, (state, action)=>{
                state.normalChatList = action.payload.normalChats;
                state.groupChatList = action.payload.groupChats;
                state.loading = false;
            })
            .addCase(fetchChatList.rejected, (state)=>{
                state.loading = false;
            })
    }
})

export default chatSlice.reducer;