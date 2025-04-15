import {configureStore} from "@reduxjs/toolkit";
import productReducer from "./slice/productSlice.js";
import cartReducer from "./slice/cartSlice.js";

export const store = configureStore({
    reducer:{
        products: productReducer,
        cart: cartReducer,

    }
});
