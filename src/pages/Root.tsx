import Navbar from "@/components/Navbar"
import { Outlet } from "react-router-dom"

const Root = () => {
  return (
    <div className="bg-transparent py-4 h-screen flex flex-col overflow-hidden">
      <Navbar />

      <main className="custom-scroll px-6 sm:px-0 flex-1 py-20 sm:pt-20 overflow-y-auto min-h-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Root