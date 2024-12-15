import {create} from 'zustand';

const ProductStore = create((set) => ({
  Products: null,
  setProducts: (value) => set(() => ({ Products: value })),
}));

export default ProductStore;