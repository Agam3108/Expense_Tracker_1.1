
export default {
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./utils/schema.tsx",
 
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL,
     host: "ep-billowing-lab-a8obs80x.eastus2.azure.neon.tech",
     database: "Expense Tracker",
     user: "Expense Tracker_owner",
    password: "nkm9xB0vPFTl",
    ssl: { rejectUnauthorized: false }
  }
} 