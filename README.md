# Turborepo Starter - Skill Score AI

This is the root **Turborepo** for **Skill Score AI**, an AI-powered coaching analysis platform that includes both **frontend** and **backend** applications.

---

## 🚀 **Using this Example**
Run the following command to create a new Turborepo:
```sh
npx create-turbo@latest
```

---

## 📞 **What's Inside?**
This Turborepo includes the following packages/apps:

### **Apps**
- `apps/frontend`: Skill Score AI **React** frontend (Vite + Recoil)
- `apps/backend-nestjs`: Skill Score AI **NestJS** backend (API for user authentication, file uploads, and data management)
- `apps/backend-fastapi`: Skill Score AI **FastAPI** backend (AI-driven coaching analysis and feedback)

### **Packages**
- `@repo/ui`: A shared React component library
- `@repo/eslint-config`: ESLint configurations (includes `eslint-config-prettier`)
- `@repo/typescript-config`: TypeScript configurations used throughout the monorepo

Each package/app is **100% TypeScript (except the FastAPI backend, which is Python-based).**

---

## 🚀 **Skill Score AI Features**
✅ **User Authentication** (JWT-based authentication)  
✅ **File Upload & Management** (Azure Storage integration)  
✅ **Coaching Analysis via AI** (OpenAI GPT & AssemblyAI integration)  
✅ **Real-time Feedback** (AI-generated coaching insights)  
✅ **PDF Report Generation** (React PDF Renderer)  
✅ **Recoil State Management** (Efficient frontend data handling)  
✅ **PostgreSQL Database** (Using Prisma ORM)  
✅ **FastAPI + NestJS Hybrid Backend** (Optimized architecture)  

---

## 🛠 **Utilities**
This Turborepo has additional tools already set up:
- **TypeScript** for static type checking
- **ESLint** for code linting
- **Prettier** for code formatting
- **TurboRepo** for monorepo optimization

---

## 🏷 **Setup & Build**
### 🔧 **Setup Locally**
1. **Clone the repository**
```sh
git clone https://github.com/shray-jayn/Skill-Score-AI.git
cd skill-score-ai
```
2. **Install dependencies**
```sh
pnpm install
```
3. **Setup environment variables**
Create a `.env` file in each app (`backend-nestjs`, `backend-fastapi`, and `frontend`) and configure them with required values (database credentials, API keys, JWT secrets, etc.).

4. **Run database migrations (NestJS Backend)**
```sh
pnpm prisma migrate dev
```

### 🏢 **Build**
To build all apps and packages, run:
```sh
pnpm build
```

---

## 🏃 **Develop**
To develop all apps and packages, run:
```sh
pnpm dev
```
This will start:
- **Frontend** at `http://localhost:5173`
- **NestJS Backend** at `http://localhost:3000/api`
- **FastAPI Backend** at `http://localhost:8000`

---

## ⚡ **Remote Caching**
Turborepo can use **Remote Caching** to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo caches locally. To enable **Remote Caching**, you need a **Vercel** account. If you don't have an account, create one and enter the following commands:
```sh
cd skill-score-ai
npx turbo login
```
This will authenticate the Turborepo CLI with your Vercel account.

Next, link your Turborepo to **Remote Cache** by running:
```sh
npx turbo link
```

---

## 🔗 **Useful Links**
Learn more about **Turborepo**:
- [Tasks](https://turbo.build/repo/docs/core-concepts/tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

---

## 🐝 **License**
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 📩 **Contact & Support**
Have questions or suggestions?  
Reach out via **[shrayjayn1@gmail.com](mailto:shrayjayn1@gmail.com)** or open an issue.

---

### 🎯 **Now you're ready to build and scale Skill Score AI with Turborepo! 🚀**
