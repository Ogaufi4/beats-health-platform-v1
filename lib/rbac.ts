export type AppRole =
  | "doctor"
  | "nurse"
  | "pharmacist"
  | "facility_admin"
  | "moh"
  | "chw"
  | "super_admin"
  | "cms"

export function hasRole(userRole: string | undefined, allowed: AppRole[]): boolean {
  if (!userRole) return false
  return allowed.includes(userRole as AppRole)
}

export function requireRole(userRole: string | undefined, allowed: AppRole[]) {
  if (!hasRole(userRole, allowed)) {
    throw new Error("Forbidden")
  }
}

