import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from "redux-persist";
import chatReducer from "./chatSlice"

const authPersistConfig = {
    key: "auth",
    storage,
    whitelist : ["user", "isAuthenticated"]
}
const chatPersistConfig = {
    key: "chat",
    storage,
    whitelist : ["chatList", "openedChat"]
}

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedChatReducer = persistReducer(chatPersistConfig, chatReducer)
export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        chat : persistedChatReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // 🔹 Fix non-serializable value warning
        }),
})

export const persistor = persistStore(store);