import { useCallback } from 'react';

import { useProductsContext } from './ProductsContextProvider';
import { IProduct } from 'models';
import { getProducts } from 'services/products';

const MAX_RETRIES = 3;
const RETRY_DELAY = 500; // ms

const useProducts = () => {
  const {
    isFetching,
    setIsFetching,
    products,
    setProducts,
    filters,
    setFilters,
    error,
    setError,
  } = useProductsContext();

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Enhanced fetchProducts with error handling and retry
  const fetchProducts = useCallback(async () => {
    setIsFetching(true);
    setError(null);
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const products: IProduct[] = await getProducts();
        setProducts(products);
        setIsFetching(false);
        setError(null);
        return;
      } catch (error: unknown) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        if (attempt < MAX_RETRIES) {
          await delay(RETRY_DELAY * attempt);
        }
      }
    }

    setIsFetching(false);
    setError(
      'Sorry, we could not load products at this time. Please check your connection and try again later.'
    );
    // eslint-disable-next-line no-console
    console.error('Failed to fetch products:', lastError);
  }, [setIsFetching, setProducts, setError]);

  // Optimized and memoized filterProducts
  const filterProducts = useCallback(
    (filters: string[]) => {
      setIsFetching(true);
      const t0 = performance.now();

      getProducts().then((products: IProduct[]) => {
        setIsFetching(false);
        let filteredProducts: IProduct[];

        if (filters && filters.length > 0) {
          const filterSet = new Set(filters);
          filteredProducts = products.filter((p: IProduct) =>
            p.availableSizes.some((size: string) => filterSet.has(size))
          );
        } else {
          filteredProducts = products;
        }

        setFilters(filters);
        setProducts(filteredProducts);

        const t1 = performance.now();
        // eslint-disable-next-line no-console
        console.log(
          `[Performance] Filtering ${products.length} products with ${
            filters.length
          } filters took ${(t1 - t0).toFixed(2)} ms`
        );
      });
    },
    [setIsFetching, setProducts, setFilters]
  );

  return {
    isFetching,
    fetchProducts,
    products,
    filterProducts,
    filters,
    error,
  };
};

export default useProducts;
