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
import { useState } from "react"

import api from "@/api/api"
import { Link, useNavigate } from "react-router-dom"
import { LoaderCircle } from "lucide-react"

import { GoogleLogin } from "@react-oauth/google"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8
    const hasNumber = /\d/.test(password)

    if (!hasMinLength) {
      return "Password must be at least 8 characters long"
    }

    if (!hasNumber) {
      return "Password must contain at least 1 number"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError("")

    if (!username.trim()) {
      return setError("Username is required")
    }

    if (!email.trim()) {
      return setError("Email is required")
    }

    const passwordError = validatePassword(password)

    if (passwordError) {
      return setError(passwordError)
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match")
    }

    try {
      setLoading(true)

      await api.post("/api/auth/signup", {
        username,
        email,
        password,
        confirmPassword,
      })

      navigate("/login")
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "Failed to create account"
      )
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
      console.log(error)
      setError("Google signup failed")
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Create your account
          </CardTitle>

          <CardDescription>
            Create an account to start using FocusFlow
          </CardDescription>
        </CardHeader>

        <CardContent>
          <FieldGroup>
            <Field>
              {googleLoading ? (
                <Button variant="outline" disabled>
                  <LoaderCircle className="animate-spin" />
                  Creating account...
                </Button>
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError("Google signup failed")}
                />
              )}
            </Field>

            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Or continue with
            </FieldSeparator>

            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Username</FieldLabel>

                  <Input
                    id="name"
                    type="text"
                    placeholder="JohnDoe"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>

                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>

                <Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field>
                      <FieldLabel htmlFor="password">
                        Password
                      </FieldLabel>

                      <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="confirm-password">
                        Confirm Password
                      </FieldLabel>

                      <Input
                        id="confirm-password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                      />
                    </Field>
                  </div>

                  <FieldDescription>
                    Must be at least 8 characters and contain 1 number.
                  </FieldDescription>
                </Field>

                {error && (
                  <p className="text-sm text-red-500">
                    {error}
                  </p>
                )}

                <Field>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  <FieldDescription className="text-center">
                    Already have an account?{" "}
                    <Link to="/login">Log in</Link>
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