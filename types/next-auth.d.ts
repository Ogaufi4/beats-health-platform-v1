declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      role: string
      status?: string
      name?: string | null
      image?: string | null
    }
  }

  interface User {
    role: string
    status?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    id: string
    status?: string
  }
}
