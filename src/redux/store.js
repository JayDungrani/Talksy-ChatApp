import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from "redux-persist";
import chatReducer from "./chatSlice"
import messageReducer from "./messageSlice"

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

const messagePersistConfig = {
    key : "message",
    storage,
    whitelist : ["messageList"]
}
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedChatReducer = persistReducer(chatPersistConfig, chatReducer);
const persistedMessageReducer = persistReducer(messagePersistConfig, messageReducer);

export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        chat : persistedChatReducer,
        message : persistedMessageReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // 🔹 Fix non-serializable value warning
        }),
})

export const persistor = persistStore(store);