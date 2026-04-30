import Navbar from "@/components/Navbar"
import { Outlet } from "react-router-dom"

const Root = () => {
    return(
        <div className="bg-transparent h-screen flex flex-col">
            <Navbar/>
            <Outlet/>
        </div>
    )
}

export default Root