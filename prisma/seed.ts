import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database seed...")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@beats.health" },
    update: {},
    create: {
      email: "admin@beats.health",
      password: adminPassword,
      role: "super_admin",
      status: "active",
      phone: "+2671234567",
      profile: {
        create: {
          firstName: "Admin",
          lastName: "User",
          location: "Gaborone",
          district: "South East",
        },
      },
    },
  })

  console.log("Created admin user:", admin.email)

  // Create doctor
  const doctorPassword = await bcrypt.hash("doctor123", 10)
  const doctor = await prisma.user.upsert({
    where: { email: "doctor@beats.health" },
    update: {},
    create: {
      email: "doctor@beats.health",
      password: doctorPassword,
      role: "doctor",
      status: "active",
      phone: "+2671234568",
      profile: {
        create: {
          firstName: "Dr. John",
          lastName: "Doe",
          specialization: "General Practice",
          location: "Gaborone",
          district: "South East",
          bio: "Experienced general practitioner with 10 years in healthcare.",
        },
      },
    },
  })

  console.log("Created doctor user:", doctor.email)

  // Create patient
  const patientPassword = await bcrypt.hash("patient123", 10)
  const patient = await prisma.user.upsert({
    where: { email: "patient@beats.health" },
    update: {},
    create: {
      email: "patient@beats.health",
      password: patientPassword,
      role: "chw",
      status: "active",
      phone: "+2671234569",
      profile: {
        create: {
          firstName: "Jane",
          lastName: "Smith",
          location: "Gaborone",
          district: "South East",
          gender: "female",
        },
      },
    },
  })

  console.log("Created patient user:", patient.email)

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
