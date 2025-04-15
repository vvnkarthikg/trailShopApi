import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../../store/slice/productSlice';

const ProductFetcher = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts()); // Fetch products on mount
  }, [dispatch]);

  return null; // No JSX returned
};

export default ProductFetcher;
