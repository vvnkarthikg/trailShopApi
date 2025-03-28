import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/products`);
    const data = await response.json();
    return data;
});

const productSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        isLoading: false,
        error: null,
    },
    reducers: {
        updateProduct: (state, action) => {
            const index = state.products.findIndex(p => p._id === action.payload._id);
            if (index !== -1) {
                state.products[index] = action.payload;
            }
        },
        deleteProduct: (state, action) => {
            const index = state.products.findIndex(p => p._id === action.payload._id);
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload;
            });
    },
});

export const { updateProduct, deleteProduct } = productSlice.actions;
export default productSlice.reducer;
