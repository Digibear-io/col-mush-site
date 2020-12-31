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
  saved: false,
  archetype: 0,
  blood: 0,
  heart: 0,
  mind: 0,
  spirit: 0,
  mortality: 0,
  night: 0,
  power: 0,
  wild: 0,
  gear: [],
  questions: [],
  moves: [],
};

// Character store
const charSlice = createSlice({
  name: "chargen",
  initialState: charState,
  reducers: {
    name: (state, action) => {
      const newState = {
        ...state,
        ...{ name: action.payload },
      };
      return newState;
    },
    look: (state, action) => {
      const newState = {
        ...state,
        ...{ look: action.payload },
      };
      return newState;
    },
    demeanor: (state, action) => {
      const newState = {
        ...state,
        ...{ demeanor: action.payload },
      };
      return newState;
    },
    set: (state, action) => {
      const newState = {
        ...state,
        ...{
          [action.payload.key]: action.payload.value,
        },
      };
      return newState;
    },
    load: (state, action) => {
      return action.payload;
    },
  },
});

export const { name, look, demeanor, load, set } = charSlice.actions;
export const charStore = configureStore({ reducer: charSlice.reducer });
