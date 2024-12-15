import {create} from 'zustand';

const AddonStore = create((set) => ({
  Addons: null,
  setAddons: (value) => set(() => ({ Addons: value })),
}));

export default AddonStore;