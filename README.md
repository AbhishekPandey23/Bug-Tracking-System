# 🐞 Bug Tracking System (Mini Jira)

A modern **Bug Tracking System** built using **Next.js** — designed to help teams efficiently manage, track, and prioritize issues within projects.  
This project showcases a complete full-stack architecture integrating **Next.js**, **Zustand**, **Zod**, **Clerk**, **Shadcn/UI**, **TailwindCSS**, and a **serverless Neon PostgreSQL** database.

---

## 🚀 Tech Stack

| Category | Technology Used |
|-----------|----------------|
| **Frontend Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Styling** | [TailwindCSS](https://tailwindcss.com/) |
| **UI Components** | [Shadcn/UI](https://ui.shadcn.com/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) |
| **Form Validation** | [Zod](https://zod.dev/) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **Backend API** | REST API (Next.js API Routes) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Database** | [Neon](https://neon.tech/) – Serverless PostgreSQL |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🧩 Features

✅ **User Authentication (Clerk)**  
- Secure authentication using Clerk’s prebuilt login and signup flows  
- Role-based user sessions and access management  

✅ **Project Management**  
- Create, view, and manage multiple projects  
- Each project contains its own tickets/issues  

✅ **Ticket / Issue Tracking**  
- Create, assign, and update tickets  
- Manage status (`Open`, `In Progress`, `Resolved`) and priority (`Low`, `Medium`, `High`)  
- Edit or delete tickets as needed  

✅ **State Management (Zustand)**  
- Lightweight, centralized state for tickets and projects  
- Reactively updates UI without prop drilling  

✅ **Form Validation (Zod)**  
- Strong schema-based validation for all inputs  
- Prevents invalid or incomplete form submissions  

✅ **Serverless Database (Neon + Prisma)**  
- Fast, scalable, and zero-downtime serverless PostgreSQL database  
- Managed via Prisma ORM with schema migrations  

✅ **UI/UX (Shadcn/UI + TailwindCSS)**  
- Clean, accessible components and consistent design  
- Fully responsive layout  

✅ **RESTful API Architecture**  
- Organized CRUD endpoints for projects and tickets  
- Data fetched dynamically using Next.js server actions  

---