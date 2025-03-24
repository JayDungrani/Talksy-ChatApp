import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import socket from "../socket";

export const fetchChatList = createAsyncThunk("chat/", async (_, {
    rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/chats`,{}, { withCredentials: true })
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

export const fetchChat = createAsyncThunk("chat/getchat", async (chatId, {
    rejectWithValue }) => {
    try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/chats/${chatId}`,{}, { withCredentials: true })
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

export const createGroup = createAsyncThunk("chat/createGroup", async (groupDetails, {
    rejectWithValue }) => {
    try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/chats/group`, groupDetails, { withCredentials: true })
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

export const addGroupMember = createAsyncThunk("chat/add", async (details, {
    rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/chats/add`, details, { withCredentials: true })
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

export const removeGroupMember = createAsyncThunk("chat/remove", async (details, {
    rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/chats/remove`, details, { withCredentials: true })
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

export const updateGroup = createAsyncThunk("chat/group", async (details, {
    rejectWithValue }) => {
    try {
        const { data } = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/chats/groupchange`, details, { withCredentials: true })
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

const chatSlice = createSlice({
    name: "chat",
    initialState: { chatList: [], openedChat: null, listLoading: false, singleChatLoading: false },
    reducers: {
        clearOpenedChat: (state) => {
            if (state.openedChat) {
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

        joinRoom: (state, action) => {
            socket.emit("joinRoom", (action.payload));
        },

        setUserOnline: (state, action) => {
            const userId = action.payload;
            state.chatList.forEach((chat) => {
                chat.members.forEach((member) => {
                    if (member._id === userId) {
                        member.isOnline = true; // Set user online
                    }
                });
            });
            if (state.openedChat) {
                state.openedChat.members.forEach((member) => {
                    if (member._id === userId) {
                        member.isOnline = true;
                    }
                })
            }
        },

        setUserOffline: (state, action) => {
            const userId = action.payload;
            state.chatList.forEach((chat) => {
                chat.members.forEach((member) => {
                    if (member._id === userId) {
                        member.isOnline = false; // Set user online
                    }
                });
            });
            if (state.openedChat) {
                state.openedChat.members.forEach((member) => {
                    if (member._id === userId) {
                        member.isOnline = false;
                    }
                })
            }
        },

        addMessageInChatList: (state, action) => {
            const message = action.payload
            console.log(state.openedChat)
            state.chatList.forEach(chat => {
                if (state.openedChat) {
                    if ((state.openedChat._id !== message.chat) && (chat._id === message.chat)) {
                        chat.latestMessage = message;
                        chat.unreadCount += 1;
                    }
                }
                else {
                    if (chat._id === message.chat) {
                        chat.latestMessage = message;
                        chat.unreadCount += 1;
                    }
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
                state.chatList = action.payload.chats;
                state.loading = false;
            })
            .addCase(fetchChatList.rejected, (state) => {
                state.loading = false;
            })

            //FETCH SINGLECHAT
            .addCase(fetchChat.pending, (state) => {
                state.singleChatLoading = true
                state.openedChat = null
            })
            .addCase(fetchChat.fulfilled, (state, action) => {
                state.openedChat = action.payload
                state.singleChatLoading = false
            })
            .addCase(fetchChat.rejected, (state) => {
                state.singleChatLoading = false
            })

            //CREATE GROUP
            .addCase(createGroup.pending, (state) => {
                state.listLoading = true
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.chatList.unshift(action.payload)
                state.listLoading = false
            })
            .addCase(createGroup.rejected, (state) => {
                state.listLoading = false
            })

            // Add member
            .addCase(addGroupMember.pending, (state) => {
                state.listLoading = true
            })
            .addCase(addGroupMember.fulfilled, (state, action) => {
                state.listLoading = false
            })
            .addCase(addGroupMember.rejected, (state) => {
                state.listLoading = false
            })

            // Remove member
            .addCase(removeGroupMember.pending, (state) => {
                state.listLoading = true
            })
            .addCase(removeGroupMember.fulfilled, (state, action) => {
                state.listLoading = false
            })
            .addCase(removeGroupMember.rejected, (state) => {
                state.listLoading = false
            })

            // update group
            .addCase(updateGroup.pending, (state) => {
                state.listLoading = true
            })
            .addCase(updateGroup.fulfilled, (state, action) => {
                state.openedChat = action.payload
                state.listLoading = false
            })
            .addCase(updateGroup.rejected, (state) => {
                state.listLoading = false
            })
    }
})

export const { clearOpenedChat, setUnreadCountToZero, setUserOnline, setUserOffline, joinRoom, addMessageInChatList } = chatSlice.actions;

export default chatSlice.reducer;