import { LoginForm } from "@/components/login-form"

import logo from "@/assets/logo.png"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted dark:bg-black p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <img src={logo} alt="Focus Flow" className="size-4" />
          </div>
          Focus Flow
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
