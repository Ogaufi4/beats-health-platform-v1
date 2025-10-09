import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Starting database seed...")

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10)

  const admin = await prisma.user.upsert({
    where: { email: "admin@beats.health" },
    update: {},
    create: {
      email: "admin@beats.health",
      password: hashedPassword,
      role: "super_admin",
      status: "active",
      languagePref: "en",
      profile: {
        create: {
          name: "System Administrator",
        },
      },
    },
  })

  console.log("Created admin user:", admin.email)

  // Create a test doctor
  const doctorPassword = await bcrypt.hash("doctor123", 10)

  const doctor = await prisma.user.upsert({
    where: { email: "doctor@beats.health" },
    update: {},
    create: {
      email: "doctor@beats.health",
      password: doctorPassword,
      role: "doctor",
      status: "active",
      languagePref: "en",
      professionalId: "DOC001",
      profile: {
        create: {
          name: "Dr. John Smith",
          specialization: "General Practice",
          bio: "Experienced general practitioner",
        },
      },
    },
  })

  console.log("Created doctor user:", doctor.email)

  // Create a test patient
  const patientPassword = await bcrypt.hash("patient123", 10)

  const patient = await prisma.user.upsert({
    where: { email: "patient@beats.health" },
    update: {},
    create: {
      email: "patient@beats.health",
      password: patientPassword,
      role: "patient",
      status: "active",
      languagePref: "en",
      profile: {
        create: {
          name: "Jane Doe",
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
