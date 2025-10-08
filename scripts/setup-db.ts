import { execSync } from "child_process"

console.log("🚀 Setting up database...\n")

try {
  console.log("📦 Generating Prisma Client...")
  execSync("npx prisma generate", { stdio: "inherit" })

  console.log("\n📊 Pushing schema to database...")
  execSync("npx prisma db push", { stdio: "inherit" })

  console.log("\n✅ Database setup complete!")
  console.log("\n🎉 You can now run: npm run dev")
} catch (error) {
  console.error("\n❌ Database setup failed:", error)
  process.exit(1)
}
