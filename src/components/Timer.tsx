import { useEffect } from "react";

//api
import api from "@/api/api";

//shadcn
import { Button } from "./ui/button";

//redux
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import type { Task } from "../features/tasks/tasksSlice";
import {
  startTimer,
  pauseTimer,
  resetTimer,
  tick,
  setMode,
  setTimeLeft,
  setFocusDuration,
  setBreakDuration,
} from "../features/timer/timerSlice";
import {
  startSession,
  endSession,
} from "../features/session/sessionSlice";
import { Pause, Play, RotateCcw } from "lucide-react";

//props
type TimerProps = {
  selectedTask: Task;
};

const Timer = ({ selectedTask }: TimerProps) => {

  //redux
  const dispatch = useDispatch();
  const { mode, timeLeft, isRunning } = useSelector((state: RootState) => state.timer);
  const { currentSessionId } = useSelector((state: RootState) => state.sessions);

  //useEffect
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      dispatch(tick());
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, dispatch]);

  useEffect(() => {
    dispatch(setFocusDuration(selectedTask.preset.focus));
    dispatch(setBreakDuration(selectedTask.preset.break));
    dispatch(setMode("focus"));
    dispatch(setTimeLeft(selectedTask.preset.focus));
  }, [
    selectedTask._id,
    selectedTask.preset.focus,
    selectedTask.preset.break,
    dispatch,
  ]);

  useEffect(() => {
    const finishSession = async () => {
      if (timeLeft === 0 && isRunning && currentSessionId) {
        await handleEndSession(true);
        dispatch(pauseTimer());
      }
    };

    finishSession();
  }, [timeLeft, isRunning, currentSessionId]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleStart = async () => {
    if (isRunning) return;

    if (!currentSessionId) {
      const created = await handleCreateSession();
      if (!created) return;
    }

    dispatch(startTimer());
  };

  const handlePause = async () => {
    if (currentSessionId) {
      await handleEndSession(false)
    }

    dispatch(pauseTimer());
  };

  const handleReset = async () => {
    if (currentSessionId) {
      await handleEndSession(false)
    }
    dispatch(resetTimer());
  };


  const handleBreak = async () => {
    if (currentSessionId) {
      await handleEndSession(false)
    }

    dispatch(pauseTimer());
    dispatch(setMode("break"));
    dispatch(setTimeLeft(selectedTask.preset.break));
  };

  const handleFocus = async () => {
    if (currentSessionId) {
      await handleEndSession(false)
    }

    dispatch(pauseTimer());
    dispatch(setMode("focus"));
    dispatch(setTimeLeft(selectedTask.preset.focus));
  };

  //api calls
  const handleCreateSession = async () => {
    try{
      const data = {
        taskId: selectedTask._id,
        plannedDuration: timeLeft,
      }
     console.log("CREATE SESSION DATA:", data);
      const res = await api.post("/api/create-session", data)
      dispatch(startSession(res.data))
      return true
    }catch(err){
      console.log(err);
      return false;
    }
  }

  const handleEndSession = async (completed = false) => {
    try{
    if (!currentSessionId) return;

    const data = {
      timeLeft,
      endedAt: new Date().toISOString(),
      completed,
    };
    await api.put(`/api/end-session/${currentSessionId}`, data);
    dispatch(endSession(data));
    }catch(err){
      console.log(err)
    }
  };

  const image = localStorage.getItem(`task-bg-${selectedTask._id}`);

  return (
    <div
  className={`flex flex-col rounded-2xl min-w-sm py-8 items-center justify-center ${
    image ? "bg-black/5 backdrop-blur-3xl" : ""
  }`}
>
      <div className="flex items-center gap-1">
        <Button onClick={handleFocus} variant={mode === "focus" ? "default" : "outline"}>Focus</Button>
        <Button onClick={handleBreak} variant={mode === "break" ? "default" : "outline"}>Break</Button> 
      </div>
      <h2 className="font-bold text-[100px] sm:text-[200px] ">{formatTime(timeLeft)}</h2>  
      <div className="flex items-center gap-2">
        <Button variant="secondary" className="border-border h-12 w-12 rounded-full" onClick={handleStart}><Play fill="currentColor" /></Button>
        <Button variant="secondary" className="border-border h-12 w-12 rounded-full" onClick={handlePause}><Pause fill="currentColor" /></Button>
        <Button variant="secondary" className="border-border h-12 w-12 rounded-full" onClick={handleReset}><RotateCcw strokeWidth={3}/></Button>
      </div>
    </div>
  );
};

export default Timer;