# Beats Health Platform

A comprehensive health management platform built with Next.js 15, Prisma, and Neon PostgreSQL.

## Features

- 🔐 Complete authentication system (credentials + OAuth ready)
- 📅 Appointment booking system
- 👥 Role-based dashboards (Patients, Providers, Admin)
- 🏥 Provider directory with search
- 📊 Analytics and reporting
- 🌍 Bilingual support (English/Setswana)

## Quick Start

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Set Up Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`env
# Database (from your Neon dashboard)
DATABASE_URL="postgresql://neondb_owner:npg_vhJzXZ5wbqH3@ep-falling-term-add9r6zd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
\`\`\`

### 3. Initialize Database

\`\`\`bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
\`\`\`

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Management

\`\`\`bash
# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset

# Generate Prisma Client after schema changes
npx prisma generate
\`\`\`

## Project Structure

\`\`\`
app/
├── actions/          # Server actions
├── api/              # API routes
├── auth/             # Auth pages (signin/signup)
├── dashboard/        # Dashboard pages
├── providers/        # Provider listing
└── ...
components/
├── dashboard/        # Dashboard components
├── providers/        # Provider components
└── ui/               # UI components
lib/
├── prisma.ts         # Prisma client
└── auth.ts           # Auth utilities
prisma/
└── schema.prisma     # Database schema
\`\`\`

## User Roles

- **Patient**: Book appointments, view bookings
- **Provider**: Manage bookings, view schedule
- **Admin**: Full system access
- **Facility**: Facility management
- **CMS**: Content management
- **Doctor**: Medical provider access

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

Vercel will automatically run \`prisma generate\` via the postinstall script.

## Troubleshooting

### Prisma Client Error

If you see "PrismaClient is not a constructor":

\`\`\`bash
npx prisma generate
\`\`\`

### Database Connection Error

Check that your DATABASE_URL is correct and Neon database is accessible.

### Build Errors

Make sure all dependencies are installed:

\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`
\`\`\`

Create the environment template:

\`\`\`plaintext file=".env.local"
# Database URL from Neon
DATABASE_URL="postgresql://neondb_owner:npg_vhJzXZ5wbqH3@ep-falling-term-add9r6zd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth Configuration
# Generate a secret with: openssl rand -base64 32
NEXTAUTH_SECRET="generate-your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
