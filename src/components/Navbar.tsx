import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import ThemeToggle from "./ThemeToggle";

import logo_black from "../assets/logo.png";
import logo_white from "../assets/logo-white.png";

import { Hourglass, Layers2, TrendingUpDown } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isDashboard = location.pathname.startsWith("/dashboard");

  const selectedButton = location.pathname.includes("/sessions")
    ? "sessions"
    : location.pathname.includes("/analytics")
    ? "analytics"
    : "tasks";

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
    {/* mobile */}
    {
      location.pathname !== "/" && (
        <div className="fixed bottom-0 left-0 right-0 h-14 bg-white/20 dark:bg-black/50 backdrop-blur-2xl z-50 flex p-3 border-t sm:hidden gap-2 w-full items-center justify-center">
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
      )
    }

    <div className="fixed top-0 left-0 right-0 h-14 bg-white/20 dark:bg-black/50 backdrop-blur-2xl z-50 flex p-3 px-6 border-t gap-2 w-full items-center justify-between">
      <Link to="/" className="flex items-center shrink-0">
        <img src={logo_black} alt="Logo" className="h-7 w-7 dark:hidden" />
        <img src={logo_white} alt="Logo" className="hidden h-7 w-7 dark:block" />
      </Link>

      {token && isDashboard && (
        <div className="hidden md:flex items-center gap-1">
          <Link to="/dashboard">
            <Button variant={selectedButton === "tasks" ? "default" : "ghost"}>
              <Layers2 className="size-3" />
              Tasks
            </Button>
          </Link>

          <Link to="/dashboard/sessions">
            <Button variant={selectedButton === "sessions" ? "default" : "ghost"}>
              <Hourglass className="size-3" />
              Sessions
            </Button>
          </Link>

          <Link to="/dashboard/analytics">
            <Button variant={selectedButton === "analytics" ? "default" : "ghost"}>
              <TrendingUpDown className="size-3" />
              Analytics
            </Button>
          </Link>
        </div>
      )}

      <div className="flex items-center gap-2">
        {token ? (
          <>
            {!isDashboard && (
              <Link to="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            )}

            <Button onClick={logOut}>Log out</Button>
          </>
        ) : (
          <>
            <Link to="/login">
              <Button>Log in</Button>
            </Link>

            <Link to="/signup">
              <Button variant="outline">Sign up</Button>
            </Link>
          </>
        )}

        <ThemeToggle />
      </div>
    </div>
    </>
  );
};

export default Navbar;