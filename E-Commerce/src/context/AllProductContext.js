import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/api';

export const AllProductContext = createContext(null);

export function AllProductProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                const items = response?.data?.products ?? [];
                setProducts(items);
            } catch (fetchError) {
                console.error(fetchError);
                setError('Unable to load products from the API.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const featuredProducts = useMemo(
        () => products.filter((product) => product?.featured),
        [products]
    );

    const value = {
        products,
        featuredProducts,
        loading,
        error,
    };

    return createElement(AllProductContext.Provider, { value }, children);
}

export function useAllProduct() {
    const context = useContext(AllProductContext);
    if (!context) {
        throw new Error('useAllProduct must be used inside AllProductProvider');
    }
    return context;
}