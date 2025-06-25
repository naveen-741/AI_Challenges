import { useCartContext } from './CartContextProvider';
import useCartTotal from './useCartTotal';
import { ICartProduct } from 'models';

const useCartProducts = () => {
  const { products, setProducts } = useCartContext();
  const { updateCartTotal } = useCartTotal();

  // Returns a new product object with updated quantity if IDs match, else returns the original product
  const updateQuantitySafely = (
    currentProduct: ICartProduct,
    targetProduct: ICartProduct,
    quantity: number
  ): ICartProduct => {
    if (currentProduct.id === targetProduct.id) {
      return {
        ...currentProduct,
        quantity: currentProduct.quantity + quantity,
      };
    }
    return currentProduct;
  };

  // Adds a product to the cart or updates its quantity if it already exists
  const addProduct = (newProduct: ICartProduct) => {
    if (newProduct.quantity <= 0) return; // Defensive: don't add zero/negative quantity

    setProducts((prevProducts: ICartProduct[]) => {
      const isProductAlreadyInCart = prevProducts.some(
        (product: ICartProduct) => newProduct.id === product.id
      );

      let updatedProducts;
      if (isProductAlreadyInCart) {
        updatedProducts = prevProducts.map((product: ICartProduct) =>
          updateQuantitySafely(product, newProduct, newProduct.quantity)
        );
      } else {
        updatedProducts = [...prevProducts, newProduct];
      }

      updateCartTotal(updatedProducts);
      return updatedProducts;
    });
  };

  const removeProduct = (productToRemove: ICartProduct) => {
    setProducts((prevProducts: ICartProduct[]) => {
      const updatedProducts = prevProducts.filter(
        (product: ICartProduct) => product.id !== productToRemove.id
      );
      updateCartTotal(updatedProducts);
      return updatedProducts;
    });
  };

  const increaseProductQuantity = (productToIncrease: ICartProduct) => {
    setProducts((prevProducts: ICartProduct[]) => {
      const updatedProducts = prevProducts.map((product: ICartProduct) =>
        updateQuantitySafely(product, productToIncrease, 1)
      );
      updateCartTotal(updatedProducts);
      return updatedProducts;
    });
  };

  const decreaseProductQuantity = (productToDecrease: ICartProduct) => {
    setProducts((prevProducts: ICartProduct[]) => {
      const updatedProducts = prevProducts.map((product: ICartProduct) =>
        updateQuantitySafely(product, productToDecrease, -1)
      );
      updateCartTotal(updatedProducts);
      return updatedProducts;
    });
  };

  return {
    products,
    addProduct,
    removeProduct,
    increaseProductQuantity,
    decreaseProductQuantity,
  };
};

export default useCartProducts;
