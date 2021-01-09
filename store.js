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

const mobileMenuSlice = createSlice({
  name: "Mobile Menu",
  initialState: false,
  reducers: {
    mobileMenuToggle: (state) => !state,
    mobileMenuTrue: () => true,
    mobileMenuFalse: () => false,
  },
});

export const {
  mobileMenuToggle,
  mobileMenuFalse,
  mobileMenuTrue,
} = mobileMenuSlice.actions;
export const mobileStore = configureStore({ reducer: mobileMenuSlice.reducer });

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    inputHeight: 62,
    output: null,
    socket: null,
  },
  reducers: {
    setInputHeight: (state, action) => ({
      ...state,
      ...{ input: action.payload },
    }),
  },
});

export const { setInputHeight } = settingsSlice.actions;
export const settingsStore = configureStore({ reducer: settingsSlice.reducer });

const historySlice = createSlice({
  name: "history",
  initialState: [],
  reducers: {
    setHistory: (state, action) => [...state, action.payload],
  },
});

export const { setHistory } = historySlice.actions;
export const historyStore = configureStore({ reducer: menuSlice.reducer });

const charState = {
  name: "",
  look: "",
  demeanor: "",
  saved: false,
  archetype: 0,
  faction: 0,
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
  changed: false,
};

// Character store
const charSlice = createSlice({
  name: "chargen",
  initialState: charState,
  reducers: {
    set: (state, action) => {
      const newState = {
        ...state,
        ...{
          [action.payload.key]: action.payload.value,
        },
        ...{ changed: true },
      };
      return newState;
    },
    load: (state, action) => {
      const newState = {
        ...state,
        ...{ ...action.payload },
        ...{ changed: false },
      };
      return newState;
    },
  },
});

export const { load, set } = charSlice.actions;
export const charStore = configureStore({ reducer: charSlice.reducer });
