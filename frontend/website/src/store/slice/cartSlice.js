import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


// ✅ Fetch cart from backend
export const fetchCart = createAsyncThunk('cart/fetchCart', async (token, { rejectWithValue }) => {
    try {
        if(!token) console.log("no token provided");
        else console.log("token provided");
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/cart/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return data.items;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error fetching cart");
    }
});

// ✅ Add item to cart (Optimistic UI)
export const addToCart = createAsyncThunk('cart/addToCart', async ({ token, pId, quantity,name,price }, { rejectWithValue }) => {
    try {
        if(!token) console.log("no token provided");
        else console.log("token provided");
        const { data } = await axios.post(
            `${process.env.REACT_APP_API_URL}/cart/addToCart/`,
            { pId: pId, quantity,name,price }, // Change `productId` to `id`
            { headers: { Authorization: `Bearer ${token}` } }
        );
        if(data) {console.log("successfull , reply from backend i"  ); console.log(data.cart.items);}
        else console.log("failed"); 
        return data.cart.items;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error adding to cart");
    }
});

// ✅ Update cart item (Optimistic UI)
// ✅ Update cart item (Fixed to use PATCH and correct URL)
export const updateCart = createAsyncThunk('cart/updateCart/', async ({ token, itemId, quantity }, { rejectWithValue }) => {
    try {
        const { data } = await axios.patch(
            `${process.env.REACT_APP_API_URL}/cart/updateCart/${itemId}`, 
            { quantity },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return data.items;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error updating cart");
    }
});

// ✅ Remove item from cart (Fixed to use correct DELETE URL format)
export const removeFromCart = createAsyncThunk('cart/removeFromCart/', async ({ token, pId }, { rejectWithValue }) => {
    try {
        const { data } = await axios.delete(`${process.env.REACT_APP_API_URL}/cart/remove/${pId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return data.items;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error removing from cart");
    }
});

// ✅ Clear entire cart (Fixed to use correct URL)
export const clearCart = createAsyncThunk('cart/clearCart/', async (token, { rejectWithValue }) => {
    try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/cart/clearCart`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return [];
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error clearing cart");
    }
});

// Redux slice with Optimistic UI and rollback
const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
        previousState: null, // Stores state for rollback
        loading: false,
        error: null
    },
    reducers: {
        // ✅ Store previous state for rollback
        savePreviousState: (state) => {
            state.previousState = [...state.cartItems];
        },

        // ✅ Rollback cart to previous state if API fails
        rollbackCart: (state) => {
            if (state.previousState) {
                state.cartItems = state.previousState;
                state.previousState = null;
            }
        }
    },

    extraReducers: (builder) => {
        builder
            // ✅ Fetch cart
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.cartItems = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.error = action.payload;
            })  

            // ✅ Add to cart (Optimistic UI with rollback)
            .addCase(addToCart.pending, (state, action) => {
                state.previousState = [...state.cartItems]; // Save rollback state
                const { pId, quantity,name,price } = action.meta.arg;
                const existingItem = state.cartItems.find(item => item.pId === pId);

                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    state.cartItems.push({ pId, quantity,name,price });
                }
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.cartItems = action.payload; // Directly update from API response
                state.previousState = null;
            })            
            .addCase(addToCart.rejected, (state, action) => {
                state.error = action.payload;
                state.cartItems = state.previousState || state.cartItems; // Rollback on failure
                state.previousState = null;
            })

            // ✅ Update cart item (Optimistic UI with rollback)
            .addCase(updateCart.pending, (state, action) => {
                state.previousState = [...state.cartItems];
                const { itemId, quantity } = action.meta.arg;
                const item = state.cartItems.find(item => item.pId === itemId);
                if (item) {
                    item.quantity = quantity;
                }
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                state.cartItems = action.payload;
                state.previousState = null;
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.error = action.payload;
                state.cartItems = state.previousState || state.cartItems;
                state.previousState = null;
            })

            // ✅ Remove from cart (Optimistic UI with rollback)
            .addCase(removeFromCart.pending, (state, action) => {
                state.previousState = [...state.cartItems];
                const { pId } = action.meta.arg;
                state.cartItems = state.cartItems.filter(item => item.pId !== pId);
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.cartItems = action.payload;
                state.previousState = null;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.error = action.payload;
                state.cartItems = state.previousState || state.cartItems;
                state.previousState = null;
            })

            // ✅ Clear cart (Optimistic UI with rollback)
            .addCase(clearCart.pending, (state) => {
                state.previousState = [...state.cartItems];
                state.cartItems = [];
            })
            .addCase(clearCart.fulfilled, (state, action) => {
                state.cartItems = action.payload;
                state.previousState = null;
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.error = action.payload;
                state.cartItems = state.previousState || state.cartItems;
                state.previousState = null;
            });
    }
});

export const { savePreviousState, rollbackCart } = cartSlice.actions;
export default cartSlice.reducer;
