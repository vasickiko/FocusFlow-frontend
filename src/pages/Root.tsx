import Navbar from "@/components/Navbar"
import { Outlet } from "react-router-dom"

const Root = () => {
  return (
    <div className="bg-transparent h-screen flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Root