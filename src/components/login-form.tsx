import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { GoogleLogin } from "@react-oauth/google"

import api from "@/api/api"
import { LoaderCircle } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setLoading(true)

      const response = await api.post("/api/auth/login", {
        identifier,
        password,
      })

      localStorage.setItem("token", response.data.token)
      navigate("/dashboard")
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setGoogleLoading(true)

      const response = await api.post("/api/auth/google-login", {
        credential: credentialResponse.credential,
      })

      localStorage.setItem("token", response.data.token)
      navigate("/dashboard")
    } catch (error) {
      console.error(error)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Google account or email
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <Field>
              {googleLoading ? (
                <Button variant="outline" type="button" disabled>
                  <LoaderCircle className="animate-spin" />
                  Logging in with Google...
                </Button>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.log("Google login failed")}
                />
              )}
            </Field>

            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Or continue with
            </FieldSeparator>

            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="identifier">
                    Email or username
                  </FieldLabel>
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Email or username"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Field>

                <Field>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      "Login"
                    )}
                  </Button>

                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup">Sign up</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </FieldGroup>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        Go to <Link to="/">home</Link>
      </FieldDescription>
    </div>
  )
}