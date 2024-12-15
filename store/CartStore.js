import {create} from 'zustand';

const CartStore = create((set) => ({
  Cart: {order_id: null, items : []},
  setCart: (value) => set(() => ({ Cart: value })),
}));

export default CartStore;