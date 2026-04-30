import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Session = {
  _id: string;
  taskId: {
    _id: string;
    title: string;
  } | null;
  plannedDuration: number;
  actualDuration: number;
  createdAt: string;
  updatedAt: string;
  endedAt: string | null;
  completed: boolean;
};

type SessionsState = {
  sessions: Session[];
  currentSessionId: string | null;
};

const initialState: SessionsState = {
  sessions: [],
  currentSessionId: null,
};

const sessionsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    startSession: (state, action: PayloadAction<Session>) => {
      state.sessions.push(action.payload);
      state.currentSessionId = action.payload._id;
    },

    endSession: (state, action: PayloadAction<{ timeLeft: number; endedAt: string; completed: boolean;}>) => {
     
      if (!state.currentSessionId) return;

      const foundSession = state.sessions.find((session) => session._id === state.currentSessionId);

      if (foundSession) {
        foundSession.endedAt = action.payload.endedAt;
        foundSession.completed = action.payload.completed;    
        foundSession.actualDuration = foundSession.plannedDuration - action.payload.timeLeft;
      }

      state.currentSessionId = null;
    },

    setSessions: (state, action: PayloadAction<Session[]>) => {
      state.sessions = action.payload
    }

  },
});

export const { startSession, endSession, setSessions } = sessionsSlice.actions;
export default sessionsSlice.reducer;