import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchChatList = createAsyncThunk("chat/", async (_, {
    rejectWithValue }) => {
    try {
        const { data } = await axios.get("/api/chats", { withCredentials: true })
        console.log(data)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

export const fetchChat = createAsyncThunk("chat/getchat", async (chatId, {
    rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/api/chats/${chatId}`, { withCredentials: true })
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

const chatSlice = createSlice({
    name: "chat",
    initialState: { chatList: [], openedChat: null, listLoading: false, singleChatLoading : false },
    reducers: {
        clearOpenedChat: (state) => {
            state.openedChat = null;
        }
    },
    extraReducers: (builder) => {
        builder
        //FETCH CHATLIST
            .addCase(fetchChatList.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchChatList.fulfilled, (state, action) => {
                state.chatList = action.payload.chats;
                state.loading = false;
            })
            .addCase(fetchChatList.rejected, (state) => {
                state.loading = false;
            })

        //FETCH SINGLECHAT
            .addCase(fetchChat.pending, (state)=>{
                state.singleChatLoading = true
                state.openedChat = null
            })
            .addCase(fetchChat.fulfilled, (state, action)=>{
                state.openedChat = action.payload
                state.singleChatLoading = false
            })
            .addCase(fetchChat.rejected, (state)=>{
                state.singleChatLoading = false
            })
    }
})

export const {clearOpenedChat} = chatSlice.actions;

export default chatSlice.reducer;