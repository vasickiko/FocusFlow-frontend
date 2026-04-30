import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Preset = {
  type: "prebuild" | "custom";
  name?: string;
  focus: number;
  break: number;
};

export type Task = {
  _id: string;
  category: string;
  title: string;
  description: string;
  preset: Preset;
  status: "completed" | "in_progress" | "not_completed";
  createdAt: string;
};

type TasksState = {
  tasks: Task[];
  selectedTaskId: string | null;
};

const initialState: TasksState = {
  tasks: [],
  selectedTaskId: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    getTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    selectTask: (state, action: PayloadAction<string>) => {
      state.selectedTaskId = action.payload;
    },

    toggleTaskState: (state, action: PayloadAction<{taskId: string; status: "completed" | "in_progress" | "not_completed";}>) => {
      const foundTask = state.tasks.find(
        (task) => task._id === action.payload.taskId
      );

      if (foundTask) {
        foundTask.status = action.payload.status;
      }
    },

    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);

      if (state.selectedTaskId === action.payload) {
        state.selectedTaskId = null;
      }
    },
  },
});

export const {
  getTasks,
  addTask,
  selectTask,
  toggleTaskState,
  deleteTask,
} = tasksSlice.actions;

export default tasksSlice.reducer;