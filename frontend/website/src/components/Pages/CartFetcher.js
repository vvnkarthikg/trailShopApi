import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCart } from '../../store/slice/cartSlice';

const CartFetcher = () => {
    const token = localStorage.getItem('token');
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            dispatch(fetchCart(token));
        }
    }, [dispatch, token]);  // Added token to the dependency array

    return null;
};

export default CartFetcher;
