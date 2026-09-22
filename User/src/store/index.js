import { configureStore } from "@reduxjs/toolkit";
import shopReducer, { persistShopState } from "./shopSlice";

export const store = configureStore({
    reducer: {
        shop: shopReducer,
    },
});

store.subscribe(() => persistShopState(store));

export default store;