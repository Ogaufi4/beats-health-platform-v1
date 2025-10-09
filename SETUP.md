# BEATS Health Platform Setup

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Neon)

## Setup Steps

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables
Create a `.env.local` file with:
\`\`\`env
DATABASE_URL="postgresql://neondb_owner:npg_vhJzXZ5wbqH3@ep-falling-term-add9r6zd-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
\`\`\`

### 3. Generate Prisma Client
\`\`\`bash
npx prisma generate
\`\`\`

### 4. Push Database Schema
\`\`\`bash
npx prisma db push
\`\`\`

### 5. Seed Database (Optional)
\`\`\`bash
npm run db:seed
\`\`\`

This creates test accounts:
- Admin: admin@beats.health / admin123
- Doctor: doctor@beats.health / doctor123  
- Patient: patient@beats.health / patient123

### 6. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit http://localhost:3000

## Troubleshooting

### Prisma Client Error
If you see "PrismaClient is not exported", run:
\`\`\`bash
npx prisma generate
\`\`\`

### Database Connection Error
Check your DATABASE_URL in `.env.local`

### Authentication Error
Generate a new NEXTAUTH_SECRET:
\`\`\`bash
openssl rand -base64 32
\`\`\`
\`\`\`

Update package.json to ensure postinstall works:
