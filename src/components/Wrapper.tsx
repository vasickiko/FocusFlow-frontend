// shadcn
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Hourglass, TrendingUpDown, Layers2 } from "lucide-react";

const Wrapper = () => {
  const location = useLocation();

  const selectedButton = location.pathname.includes("sessions")
    ? "sessions"
    : location.pathname.includes("analytics")
    ? "analytics"
    : "tasks";

  return (
    <div className="container h-full min-h-0 py-12 sm:pt-18 sm:pb-5 flex flex-1 gap-4 flex-col mx-auto overflow-hidden">
      <div className="hidden sm:flex p-1 flex-col items-start gap-1 shrink-0">
        <h1 className="leading-tighter text-3xl font-semibold tracking-tight text-balance text-primary lg:leading-[1.1] lg:font-semibold xl:text-5xl xl:tracking-tighter max-w-4xl">
          Manage your tasks
        </h1>
        <p className="max-w-4xl text-base text-balance text-foreground sm:text-lg">
          Plan your sessions, stay focused and get things done.
        </p>
      </div>

      <div className="w-full flex flex-col flex-1 min-h-0 items-start gap-0 sm:gap-4">
        <div className="sm:px-1 sm:py-1 px-4 py-8 hidden sm:flex items-center w-full justify-between shrink-0">
          <div className="flex gap-2 w-fit">
            <Link to="/dashboard">
              <Button
                className="w-full"
                variant={selectedButton === "tasks" ? "default" : "outline"}
              >
                <Layers2 className="size-3" />
                Tasks
              </Button>
            </Link>

            <Link to="sessions">
              <Button
                className="w-full "
                variant={selectedButton === "sessions" ? "default" : "outline"}
              >
                <Hourglass className="size-3" />
                Sessions
              </Button>
            </Link>

            <Link to="analytics">
              <Button
                className="w-full"
                variant={selectedButton === "analytics" ? "default" : "outline"}
              >
                <TrendingUpDown className="size-3" />
                Analytics
              </Button>
            </Link>
          </div>

      
        </div>

        <div className="sm:px-1 py-8 sm:py-1 px-6 sm:flex-1 w-full flex-1 min-h-0 overflow-y-auto custom-scroll">
          <Outlet />
        </div>

        {/* mobile only */}
        <div className="fixed bottom-0 left-0 right-0 h-14 bg-white/20 dark:bg-black/20 backdrop-blur-lg z-50 flex p-3 border-t sm:hidden gap-2 w-full items-center justify-center">
          <Link to="/dashboard">
            <Button
              className="w-full"
              variant={selectedButton === "tasks" ? "default" : "outline"}
            >
              <Layers2 className="size-3" />
              Tasks
            </Button>
          </Link>
          <Link to="sessions">
            <Button
              className="w-full"
              variant={selectedButton === "sessions" ? "default" : "outline"}
            >
              <Hourglass className="size-3" />
              Sessions
            </Button>
          </Link>
          <Link to="analytics">
            <Button
              className="w-full"
              variant={selectedButton === "analytics" ? "default" : "outline"}
            >
              <TrendingUpDown className="size-3" />
              Analytics
            </Button>
          </Link>
         
        </div>
      </div>
    </div>
  );
};

export default Wrapper;