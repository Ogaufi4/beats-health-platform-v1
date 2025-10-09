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

  // Create MOH user
  const mohPassword = await bcrypt.hash("moh123", 10)
  const moh = await prisma.user.upsert({
    where: { email: "moh@beats.health" },
    update: {},
    create: {
      email: "moh@beats.health",
      password: mohPassword,
      role: "moh",
      status: "active",
      phone: "+2671234568",
      profile: {
        create: {
          firstName: "MOH",
          lastName: "User",
          location: "Gaborone",
          district: "South East",
        },
      },
    },
  })

  console.log("Created MOH user:", moh.email)

  // Create doctor user
  const doctorPassword = await bcrypt.hash("doctor123", 10)
  const doctor = await prisma.user.upsert({
    where: { email: "doctor@beats.health" },
    update: {},
    create: {
      email: "doctor@beats.health",
      password: doctorPassword,
      role: "doctor",
      status: "active",
      phone: "+2671234569",
      profile: {
        create: {
          firstName: "Dr. John",
          lastName: "Doe",
          specialization: "Cardiologist",
          location: "Gaborone",
          district: "South East",
        },
      },
    },
  })

  console.log("Created doctor user:", doctor.email)

  // Create nurse user
  const nursePassword = await bcrypt.hash("nurse123", 10)
  const nurse = await prisma.user.upsert({
    where: { email: "nurse@beats.health" },
    update: {},
    create: {
      email: "nurse@beats.health",
      password: nursePassword,
      role: "nurse",
      status: "active",
      phone: "+2671234570",
      profile: {
        create: {
          firstName: "Nurse",
          lastName: "Jane",
          location: "Gaborone",
          district: "South East",
        },
      },
    },
  })

  console.log("Created nurse user:", nurse.email)

  // Create pharmacist user
  const pharmacistPassword = await bcrypt.hash("pharmacist123", 10)
  const pharmacist = await prisma.user.upsert({
    where: { email: "pharmacist@beats.health" },
    update: {},
    create: {
      email: "pharmacist@beats.health",
      password: pharmacistPassword,
      role: "pharmacist",
      status: "active",
      phone: "+2671234571",
      profile: {
        create: {
          firstName: "Pharma",
          lastName: "John",
          location: "Gaborone",
          district: "South East",
        },
      },
    },
  })

  console.log("Created pharmacist user:", pharmacist.email)

  // Create facility admin user
  const facAdminPassword = await bcrypt.hash("facadmin123", 10)
  const facAdmin = await prisma.user.upsert({
    where: { email: "facadmin@beats.health" },
    update: {},
    create: {
      email: "facadmin@beats.health",
      password: facAdminPassword,
      role: "facility_admin",
      status: "active",
      phone: "+2671234572",
      profile: {
        create: {
          firstName: "Facility",
          lastName: "Admin",
          location: "Gaborone",
          district: "South East",
        },
      },
    },
  })

  console.log("Created facility admin user:", facAdmin.email)

  // Create community health worker user
  const chwPassword = await bcrypt.hash("chw123", 10)
  const chw = await prisma.user.upsert({
    where: { email: "chw@beats.health" },
    update: {},
    create: {
      email: "chw@beats.health",
      password: chwPassword,
      role: "chw",
      status: "active",
      phone: "+2671234573",
      profile: {
        create: {
          firstName: "Community",
          lastName: "Worker",
          location: "Rural Village",
          district: "Central",
        },
      },
    },
  })

  console.log("Created CHW user:", chw.email)

  // Create central medical stores user
  const cmsPassword = await bcrypt.hash("cms123", 10)
  const cms = await prisma.user.upsert({
    where: { email: "cms@beats.health" },
    update: {},
    create: {
      email: "cms@beats.health",
      password: cmsPassword,
      role: "cms",
      status: "active",
      phone: "+2671234574",
      profile: {
        create: {
          firstName: "CMS",
          lastName: "User",
          location: "Gaborone",
          district: "South East",
        },
      },
    },
  })

  console.log("Created CMS user:", cms.email)
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
