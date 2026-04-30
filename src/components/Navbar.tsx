import { useNavigate } from "react-router-dom"

//shadcn
import { Button } from "./ui/button"
import ThemeToggle from "./ThemeToggle"

//logos
import logo_black from "../assets/logo.png"
import logo_white from "../assets/logo-white.png"

const Navbar = () => {

    const navigate = useNavigate()

    const token = localStorage.getItem("token")

    function logOut(){
        if(!token) return
        localStorage.removeItem("token")
        navigate("/login")
    }

    return(
       <div className="w-full py-2.5 px-6 border-b sm:border-b-0 sm:px-15 flex justify-between items-center">
            <div className="flex gap-0.5 items-center">
                <img src={logo_black} alt="" className="sm:w-10 sm:h-10 h-8 w-8 dark:hidden" />
                <img src={logo_white} alt="" className="sm:w-10 sm:h-10 h-8 w-8 hidden dark:inline-block" />
            </div>

            <div className="flex items-center gap-2">
                {token ? 
                    <Button onClick={logOut}>Log Out</Button> 
                    : 
                    <div className="flex items-center gap-2">
                        <Button onClick={logOut}>Log In</Button>
                        <Button variant="secondary" onClick={logOut}>Sign Up</Button>
                    </div>
                }
                <ThemeToggle/>
            </div>
       </div>
    )
}

export default Navbar



