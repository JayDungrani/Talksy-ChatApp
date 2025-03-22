import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import socket from "../socket";
import { addMessage } from "./messageSlice";

export const fetchChatList = createAsyncThunk("chat/", async (_, {
    rejectWithValue }) => {
    try {
        const { data } = await axios.get("/api/chats", { withCredentials: true })
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
            if(state.openedChat){
                socket.emit("leaveRoom", (state.openedChat._id))
            }
            state.openedChat = null;
        },

        setUnreadCountToZero: (state, action) => {
            const chatId = action.payload;
            const chat = state.chatList.find(chat => chat._id === chatId);
            if (chat) {
                chat.unreadCount = 0;
            }
        },

        joinRoom : (state, action)=>{
            if(state.openedChat){
                socket.emit("leaveRoom", (state.openedChat._id))
            }
            socket.emit("joinRoom", (action.payload));
        },

        setUserOnline : (state, action)=>{
            const userId = action.payload;
            state.chatList.forEach((chat) => {
                chat.members.forEach((member) => {
                    if (member._id === userId) {
                        member.isOnline = true; // Set user online
                    }
                });
            });
            state.openedChat.members.forEach((member)=>{
                if(member._id === userId){
                    member.isOnline = true;
                }
            })
        },

        setUserOffline : (state, action)=>{
            const userId = action.payload;
            state.chatList.forEach((chat) => {
                chat.members.forEach((member) => {
                    if (member._id === userId) {
                        member.isOnline = false; // Set user online
                    }
                });
            });
            state.openedChat.members.forEach((member)=>{
                if(member._id === userId){
                    member.isOnline = false;
                }
            })
        },

        addMessageInChatList : (state, action)=>{
            const message = action.payload
            console.log(message)
            state.chatList.forEach(chat =>{
                if(chat._id === message.chat){
                    chat.latestMessage = message;
                    chat.unreadCount += 1;
                }
            })
        }

    },
    
    extraReducers: (builder) => {
        builder
        //FETCH CHATLIST
            .addCase(fetchChatList.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchChatList.fulfilled, (state, action) => {
                state.openedChat = null;
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

export const {clearOpenedChat, setUnreadCountToZero, setUserOnline, setUserOffline, joinRoom, addMessageInChatList} = chatSlice.actions;

export default chatSlice.reducer;