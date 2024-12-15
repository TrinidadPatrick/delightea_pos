import {create} from 'zustand';

const CurrentOrdersStore= create((set) => ({
  CurrentOrders: null,
  setCurrentOrders: (value) => set(() => ({ CurrentOrders: value })),
}));

export default CurrentOrdersStore;