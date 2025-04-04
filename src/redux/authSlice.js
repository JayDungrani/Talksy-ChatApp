import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 🔹 LOGIN USER (No token storage, uses cookies)
export const loginUser = createAsyncThunk("auth/login", async (userData, { rejectWithValue }) => {
  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/login`, userData, { withCredentials: true });
    return true;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Something went wrong");
  }
});

// 🔹 SIGNUP USER
export const signupUser = createAsyncThunk("auth/signup", async(userData, {rejectWithValue})=>{
  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/signup`, userData, { withCredentials: true });
    return true;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Something went wrong");
  }
})

// 🔹 FETCH USER DATA (Uses stored cookie for authentication)
export const fetchUser = createAsyncThunk("auth/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/me`,{ withCredentials: true });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Not authenticated");
  }
});

// 🔹 LOGOUT USER (Clears cookie)
export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/logout`,{ withCredentials: true });
    return true;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Logout failed");
  }
});


export const updateProfile = createAsyncThunk("auth/update", async (userData, { rejectWithValue }) => {
  try {
    const {data} = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/update`, userData, { withCredentials: true });
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Something went wrong");
  }
});

// 🔹 Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, loading: false, error: null, isAuthenticated: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Signup
      .addCase(signupUser.pending, (state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.loading = false;
      })
  },
});

export default authSlice.reducer;
