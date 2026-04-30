import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

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
       <div className="w-full fixed top-0 bg-white/20 dark:bg-black/20 backdrop-blur-md z-50 py-2.5 sm:py-5 px-6 border-b sm:border-b-0 sm:px-15 flex justify-between items-center">
            <div className="flex gap-0.5 items-center">
                <Link to="/"><img src={logo_black} alt="" className="sm:w-10 sm:h-10 h-8 w-8 dark:hidden" />
                <Link to="/"><img src={logo_white} alt="" className="sm:w-10 sm:h-10 h-8 w-8 hidden dark:inline-block" /></Link></Link>
            </div>

            <div className="flex items-center gap-2">
                {token ? 
                    <div className="flex items-center gap-2">
                        <Button onClick={logOut}>Log out</Button> 
                        <Link to="/dashboard"><Button variant="outline">Dashboard</Button></Link>                
                    </div>
                    : 
                    <div className="flex items-center gap-2">
                        <Link to="/login"><Button>Log in</Button></Link>
                        <Link to="/signup"><Button variant="outline">Sign up</Button></Link>
                    </div>
                }
                <ThemeToggle/>
            </div>
       </div>
    )
}

export default Navbar



