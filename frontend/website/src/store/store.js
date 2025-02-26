import {configureStore} from "@reduxjs/toolkit";
import productReducer from "./slice/productSlice.js";

export const store = configureStore({
    reducer:{
        products: productReducer,

    }
});
