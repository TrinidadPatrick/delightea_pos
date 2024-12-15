import {create} from 'zustand';

const CategoryStore = create((set) => ({
  Categories: null,
  setCategories: (value) => set(() => ({ Categories: value })),
}));

export default CategoryStore;