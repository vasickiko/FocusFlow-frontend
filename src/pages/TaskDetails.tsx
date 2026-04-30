import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import api from "@/api/api";

import Timer from "@/components/Timer";
import type { Task } from "../features/tasks/tasksSlice";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { ImageIcon, LoaderCircle } from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";

const TaskDetails = () => {
  const { taskId } = useParams();

  const [task, setTask] = useState<Task | null>(null);
  const [bgImage, setBgImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const images = [
    {
      desc: "Clear",
      img: null,
    },
    {
      desc: "Ghibli",
      img: "https://images.steamusercontent.com/ugc/1758073114103109159/20B042641BF6359FEE0D9E96CE7D62205EB179A3/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false",
    },

  ];

  const fetchTask = async () => {
    try {
      setLoading(true);   
      const res = await api.get(`/api/tasks/${taskId}`);

      setTask({
        ...res.data,
        id: res.data._id,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeBackground = (image: string | null) => {
    setBgImage(image);

    if (image) {
      localStorage.setItem(`task-bg-${taskId}`, image);
    } else {
      localStorage.removeItem(`task-bg-${taskId}`);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  useEffect(() => {
    const savedImage = localStorage.getItem(`task-bg-${taskId}`);
    setBgImage(savedImage);
  }, [taskId]);

  if (loading) return <div className="h-screen w-screen flex items-center justify-center"><LoaderCircle className="animate-spin" /></div>;
  if (!task) return <div>Task not found</div>;

  return (
    <div
  className="h-dvh overflow-hidden container relative flex flex-col items-center justify-center gap-10 mx-auto bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: bgImage ? `url(${bgImage})` : "none" }}>
      <h1 className="absolute left-1/2 -translate-x-1/2 text-center capitalize top-10 leading-tighter text-3xl font-semibold tracking-tight text-balance text-primary lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter max-w-4xl">
        {task.title}
      </h1>
      <Timer selectedTask={task} />

      
      <div className="absolute bottom-10 right-10 flex items-center gap-1 ">
        <ThemeToggle variant="secondary" />
        <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="h-8 w-8" variant={"secondary"}>
            <ImageIcon />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex gap-4 flex-wrap justify-center">
              {images.map((image) => (
                <div
                  key={image.desc}
                  onClick={() => handleChangeBackground(image.img)}
                  className="flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  {image.img ? (
                    <img
                      src={image.img}
                      alt=""
                      className="h-20 rounded-lg w-20 object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-lg bg-transparent border flex items-center justify-center text-black text-sm font-medium">
                      
                    </div>
                  )}

                  <p>{image.desc}</p>
                </div>
              ))}
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
      

    </div>
  );
};

export default TaskDetails;