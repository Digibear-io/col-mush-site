import { configureStore, createSlice } from "@reduxjs/toolkit";

// Menu store
const menuSlice = createSlice({
  name: "menu",
  initialState: false,
  reducers: {
    toggle: (state) => !state,
  },
});
export const { toggle } = menuSlice.actions;
export const menuStore = configureStore({ reducer: menuSlice.reducer });

const charState = {
  name: "",
  look: "",
  demeanor: "",
  blood: 0,
  heart: 0,
  mind: 0,
  spirit: 0,
  mortality: 0,
  night: 0,
  power: 0,
  wild: 0,
  gear: [],
  moves: [],
};

// Character store
const charSlice = createSlice({
  name: "chargen",
  initialState: charState,
  reducers: {
    name: (state, action) => ({
      ...state,
      ...{ name: action.payload },
    }),
    look: (state, action) => ({
      ...state,
      ...{ look: action.payload },
    }),
    demeanor: (state, action) => ({
      ...state,
      ...{ demeanor: action.payload },
    }),

    set: (state, action) => ({
      ...state,
      ...{
        [action.payload.key]: action.payload.value,
      },
    }),
  },
});

export const { name, look, demeanor, raise, lower, set } = charSlice.actions;
export const charStore = configureStore({ reducer: charSlice.reducer });
