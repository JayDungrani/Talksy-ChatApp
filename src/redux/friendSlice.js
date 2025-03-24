import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const sendFriendReq = createAsyncThunk("request/send", async (receiverId, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`/api/friend/send/${receiverId}`, { withCredentials : true });
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

export const acceptFriendReq = createAsyncThunk("request/accept", async (reqId, { rejectWithValue }) => {
    try {
        const {data} = await axios.post(`/api/friend/accept/${reqId}`, { withCredentials:true });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

export const rejectFriendReq = createAsyncThunk("request/reject", async (reqId, { rejectWithValue }) => {
    try {
        const {data} = await axios.post(`/api/friend/reject/${reqId}`, { withCredentials:true });
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

export const fetchNotifications = createAsyncThunk("request/list", async (__dirname, {rejectWithValue})=>{
    try {
        const {data} = await axios.get(`/api/notification`,{withCredentials : true})
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

const friendSlice = createSlice({
    name: "friend",
    initialState: { notificationList : [], friendReqList: [], loading: false, responseMessage : "" },
    reducers: {
        addReqest : (state, action)=>{
            state.notificationList.unshift(action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendFriendReq.fulfilled, (state, action) => {
                state.responseMessage = action.payload.message
            })
            .addCase(sendFriendReq.rejected, (state, action) => {
                state.responseMessage = action.payload.message
            })

            // FETCH NOTIFICAIONS
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notificationList = action.payload
            })
            .addCase(fetchNotifications.rejected, (state) => {
                state.loading = false;
            })

            // ACCEPT NOTIFICAIONS
            .addCase(acceptFriendReq.pending, (state) => {
                state.loading = true;
            })
            .addCase(acceptFriendReq.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(acceptFriendReq.rejected, (state) => {
                state.loading = false;
            })

            // REJECT NOTIFICAIONS
            .addCase(rejectFriendReq.pending, (state) => {
                state.loading = true;
            })
            .addCase(rejectFriendReq.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(rejectFriendReq.rejected, (state) => {
                state.loading = false;
            })
    }
})
export const {addReqest} = friendSlice.actions
export default friendSlice.reducer;