import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const sendFriendReq = createAsyncThunk("request/send", async (receiverId, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(`/api/friend/send/${receiverId}`, { withCredintials:true });
        console.log(data)
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

export const fetchNotifications = createAsyncThunk("request/list", async (__dirname, {rejectWithValue})=>{
    try {
        const {data} = await axios.get("/api/notification",{withCredentials : true})
        return data
    } catch (error) {
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
})

const friendSlice = createSlice({
    name: "friend",
    initialState: { notificationList : [], friendReqList: [], loading: false, responseMessage : "" },
    reducers: {},
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
    }
})

export default friendSlice.reducer;