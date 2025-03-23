import {create} from 'zustand';

const now = new Date();

const OrderDateFilterStore = create((set) => ({
  dateFilter: new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)),
  setDateFilter: (value) => set(() => ({ dateFilter: value })),
}));

export default OrderDateFilterStore;