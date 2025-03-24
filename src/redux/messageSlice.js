import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import socket from "../socket";

export const fetchMessages = createAsyncThunk("messages/", async (chatId, {
    rejectWithValue }) => {
    try {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/message/read/${chatId}`, {withCredentials : true});
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/message/${chatId}`, { withCredentials: true })
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

export const sendMessage = createAsyncThunk("messages/send", async(messageSlice,{
    rejectWithValue})=>{
        try {
             const {data} = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/message/send`,messageSlice, {withCredentials : true});
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
})

const messageSlice = createSlice({
    name : "message",
    initialState : {messageList : [], loading : false},
    reducers : {
        addMessage : (state, action)=>{
            const message = action.payload;
            axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/message/read/${message.chat}`, {withCredentials : true});
            state.messageList.push(message);
        }
    },
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
export const {addMessage} = messageSlice.actions;
export default messageSlice.reducer;