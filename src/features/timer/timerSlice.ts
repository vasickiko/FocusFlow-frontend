import { createSlice } from "@reduxjs/toolkit";

type TimerState = {
  mode: "focus" | "break";
  timeLeft: number;
  isRunning: boolean;
  focusDuration: number;
  breakDuration: number;
};

const initialState: TimerState = {
  mode: "focus",
  timeLeft: 1500,
  isRunning: false,
  focusDuration: 1500,
  breakDuration: 300,
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    startTimer: (state) => {
      state.isRunning = true;
    },
    pauseTimer: (state) => {
      state.isRunning = false;
    },
    resetTimer: (state) => {
    state.timeLeft = state.mode === "focus" ? state.focusDuration : state.breakDuration;
    state.isRunning = false;
    },
    tick: (state) => {
        if (state.timeLeft > 1) {
            state.timeLeft -= 1;
        } else {
            state.timeLeft = 0;
            state.isRunning = false;
        }
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setTimeLeft: (state, action) => {
      state.timeLeft = action.payload;
      state.isRunning = false;
    },
    setFocusDuration: (state, action) => {
      state.focusDuration = action.payload;
    },
    setBreakDuration: (state, action) => {
      state.breakDuration = action.payload;
    },
  },
});

export const {
  startTimer,
  pauseTimer,
  resetTimer,
  tick,
  setMode,
  setTimeLeft,
  setFocusDuration,
  setBreakDuration,
} = timerSlice.actions;

export default timerSlice.reducer;