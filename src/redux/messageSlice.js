import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMessages = createAsyncThunk("messages/", async (chatId, {
    rejectWithValue }) => {
    try {
        await axios.put(`/api/message/read/${chatId}`, {withCredentials : true});
        const { data } = await axios.get(`/api/message/${chatId}`, { withCredentials: true })
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

export const sendMessage = createAsyncThunk("messages/send", async(messageSlice,{
    rejectWithValue})=>{
        try {
            const {data} = await axios.post("/api/message/send",messageSlice, {withCredentials : true});
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
})

const messageSlice = createSlice({
    name : "message",
    initialState : {messageList : [], loading : false},
    reducers : {},
    extraReducers : (builder)=>{
        builder
            .addCase(fetchMessages.pending, (state)=>{
                state.loading = true;
            })
            .addCase(fetchMessages.fulfilled, (state, action)=>{
                state.messageList = action.payload;
                state.loading = false;
            })
            .addCase(fetchMessages.rejected, (state)=>{
                state.loading = false;
            })
    }
})

export default messageSlice.reducer;