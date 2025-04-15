import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaArrowRight, FaSearch } from 'react-icons/fa';
import './SearchBar.css';
import no from './images/no.jpg';

const SearchBar = ({ onProductSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const searchRef = useRef(null);

    // Get products directly from Redux store
    const { products } = useSelector(state => state.products);

    const handleSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
    
        if (term) {
            const filtered = products.filter(product => {
                return (
                    product.name?.toLowerCase().includes(term) ||
                    product.brand?.toLowerCase().includes(term) ||
                    product.category?.toLowerCase().includes(term) ||
                    product.description?.toLowerCase().includes(term)||
                    product.packOf?.toString().includes(term)
                );
            });
    
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    };

    const handleProductClick = (productId) => {
        onProductSelect(productId);
        setSearchTerm('');
        setFilteredProducts([]);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setFilteredProducts([]);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="searchbar-container" ref={searchRef}>
            <input 
                type="text" 
                placeholder="search" 
                className="searchbar-input" 
                value={searchTerm} 
                onChange={handleSearchChange} 
            />
            <div className="search-icon">
                <FaSearch />
            </div>

            {filteredProducts.length > 0 && (
                <div className="searchbar-results">
                    {filteredProducts.map(product => (
                        <div
                            key={product._id}
                            className="searchbar-item"
                            onClick={() => handleProductClick(product._id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={
                                    product.productImage?.startsWith('http')
                                        ? product.productImage
                                        : `${process.env.REACT_APP_API_URL}/${product.productImage || ''}`
                                }
                                alt={product.name}
                                className="searchbar-product-image"
                                onError={(e) => (e.target.src = no)}
                            />
                            <p>{product.name}</p>
                            <FaArrowRight className="arrow-symbol" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
