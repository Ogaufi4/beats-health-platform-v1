"use client"

import type React from "react"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { signUp } from "@/app/actions/auth"
import { toast } from "@/components/ui/use-toast"

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<
    "doctor" | "nurse" | "pharmacist" | "facility_admin" | "moh" | "chw" | "super_admin" | "cms"
  >("doctor")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signUp({ email, password, name, role })

      toast({
        title: "Success",
        description: "Account created! Signing you in...",
      })

      // Automatically sign in after successful signup
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.ok) {
        // Force a hard redirect to dashboard
        window.location.href = "/dashboard"
      } else {
        toast({
          title: "Success",
          description: "Account created! Please sign in.",
        })
        router.push("/auth/signin")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold text-gray-900">Beats Health</span>
          </div>
          <p className="text-gray-600">Create your healthcare account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Sign up to get started with Beats Health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  minLength={6}
                  autoComplete="new-password"
                />
                <p className="text-xs text-gray-500">Must be at least 6 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">I am a</Label>
                <Select
                  value={role}
                  onValueChange={(
                    value: "doctor" | "nurse" | "pharmacist" | "facility_admin" | "moh" | "chw" | "super_admin" | "cms",
                  ) => setRole(value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">Doctor / Specialist</SelectItem>
                    <SelectItem value="nurse">Nurse</SelectItem>
                    <SelectItem value="pharmacist">Pharmacist</SelectItem>
                    <SelectItem value="chw">Community Health Worker (CHW)</SelectItem>
                    <SelectItem value="facility_admin">Facility Administrator</SelectItem>
                    <SelectItem value="moh">Ministry of Health Admin</SelectItem>
                    <SelectItem value="cms">Central Medical Stores</SelectItem>
                    <SelectItem value="super_admin">Super Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Create Account
                  </span>
                )}
              </Button>
            </form>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-blue-600 hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
