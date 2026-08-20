import { create } from 'zustand';

export const useCartStore = create((set) => ({
  cart: [],
  deliveryAddress: {
    fullName: '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
  },

  addToCart: (product) => set((state) => {
    const productId = product._id?.$oid || product._id;
    const existingIndex = state.cart.findIndex(item => (item._id?.$oid || item._id) === productId);

    if (existingIndex > -1) {
      const updatedCart = [...state.cart];
      // Prevent ordering past available stock bounds
      if (updatedCart[existingIndex].cartQuantity < product.quantity) {
        updatedCart[existingIndex].cartQuantity += 1;
      }
      return { cart: updatedCart };
    }

    return { cart: [...state.cart, { ...product, cartQuantity: 1 }] };
  }),

  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => (item._id?.$oid || item._id) !== productId)
  })),

  clearCart: () => set({ cart: [] }),

  setDeliveryAddress: (addressData) => set((state) => ({
    deliveryAddress: { ...state.deliveryAddress, ...addressData }
  }))
}));
