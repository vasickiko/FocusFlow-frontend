import { useState } from "react"

import api from "@/api/api"

import logo from "@/assets/logo.png"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault(); 
    try{ 
        await api.post("/api/auth/signup", { username, email, password, confirmPassword }); 
    } catch (error) { 
        console.error(error); 
    } 
}

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>

          <div className="flex flex-col items-center gap-6 text-center">      
            <img src={logo} alt="FocusFlow Logo" className="h-15 w-15" />
            <div className="flex flex-col items-center gap-1">
                <h1 className="text-4xl font-bold">Register An Account</h1>
                <p className="text-lg font-medium">Already have an account? <Link to="/login" className="font-semibold underline">Login</Link></p>
            </div> 
          </div>

          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input
              id="username"
              type="text"
              placeholder="John Doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="johndoe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Field>

          <Field>
            <Button type="submit">Create Account</Button>
          </Field>
          <FieldSeparator>Or</FieldSeparator>
         
          <Button variant="outline" type="button">
            Google
          </Button>  
        </FieldGroup>
      </form>

       <div className="flex items-center justify-center">
        <p className="text-lg font-medium">Go to <Link to="/" className="font-semibold underline">home</Link></p>
       </div>
      
    </div>
  )
}