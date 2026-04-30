import { SignupForm } from "@/components/signup-form"
import logo from "@/assets/logo.png"

export default function SignupPage() {
  return (
    <div className="dark:bg-black flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
           <div className="flex p-1 size-7 items-center justify-center rounded-md bg-white border text-primary-foreground">
            <img src={logo} alt="Focus Flow" className="size-4" />  
          </div>
          Focus Flow
        </a>
        <SignupForm />
      </div>
    </div>
  )
}
