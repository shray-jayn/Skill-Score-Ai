# 🚀 **Skill Score AI - Backend**

Skill Score AI is an **AI-driven coaching analytics platform** designed to analyze and enhance coaching sessions. This repository contains the **backend**, built using **NestJS** with **Prisma ORM** and **PostgreSQL**, operating in a **Turborepo** monorepo setup.

---

## 📦 **What's Inside?**
This backend includes:
- **NestJS** framework for a structured and scalable backend
- **PostgreSQL** as the database with Prisma ORM
- **JWT authentication** for secure API access
- **Azure Storage integration** for secure file storage
- **RESTful API endpoints** to manage coaching sessions, transcriptions, and analytics

### **Tech Stack**
- **Backend Framework**: NestJS  
- **Database**: PostgreSQL (managed with Prisma ORM)  
- **Authentication**: JWT-based authentication  
- **Storage**: Azure Blob Storage  
- **Testing**: Jest  
- **CI/CD**: Docker (optional deployment setup)  

---

## 🚀 **Skill Score AI Features**
✅ **Coaching Session Tracking** (Monitor individual and team coaching sessions)  
✅ **AI-powered Coaching Analytics** (Provides insights based on transcriptions)  
✅ **Transcription Analysis** (Extracts key coaching styles and performance metrics)  
✅ **Secure Authentication** (JWT-based authentication)  
✅ **Session Feedback Management** (Stores session improvements & detailed feedback)  
✅ **File Uploads & Storage** (Azure Blob Storage integration)  
✅ **Search API** to find coaching sessions efficiently  
✅ **Role-based Access Control** (Admin/Coach/User roles)  

---

## 🛠 **Setup & Installation**
### ⚡ **Prerequisites**
- Node.js `>= 18`
- PostgreSQL `>= 14`
- Azure Storage Account setup
- PNPM / Yarn / NPM (preferred: `pnpm`)

### 🏗️ **Setup Locally**
1. **Clone the repository**
```sh
git clone https://github.com/shray-jayn/Skill-Score-Ai.git
cd skill-score-ai
cd apps
cd backend
```
2. **Install dependencies**
```sh
pnpm install
```
3. **Setup environment variables**
Create a `.env` file in the root directory and configure it with required values (database credentials, Azure storage, JWT, etc.).

4. **Run database migrations**
```sh
pnpm prisma migrate dev
```

5. **Start the backend server**
```sh
pnpm dev  # or yarn dev
```
Your Skill Score AI backend will be running at **`http://localhost:3000`**.

---

## 📜 **API Routes**
### 🔐 **Authentication**
- `POST /users/register` - User registration
- `POST /users/login` - User login

### 🎯 **Coaching Sessions**
- `POST /coaching/fetch-sessions` - Fetch coaching sessions
- `POST /coaching/fetch-feedback` - Fetch coaching feedback
- `GET /coaching/coaching-style-stats/:coachingRoundId` - Get coaching style statistics
- `GET /coaching/coaching-style-timechart/:roundId` - Get coaching style timechart
- `GET /coaching/transcriptions/:coachingSessionName` - Fetch transcriptions

### 🔎 **Search API**
- `POST /search` - Search for coaching sessions

### 📂 **File Management**
- `POST /upload/files/generate-upload-url` - Generate upload URL for Azure Storage
- `POST /file/fetch-sessions` - Fetch file sessions

---

## 🏗 **Build for Production**
To build the backend:
```sh
pnpm build  # or yarn build
```

---

## 🔍 **Linting & Code Quality**
Run ESLint to check for code issues:
```sh
pnpm lint
```

---

## ⚡ **Remote Caching** (Optional for Monorepo)
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

## 📜 **Folder Structure**
```
/skill-score-ai
  ├── /apps
  │   ├── /backend   # NestJS backend (this repo)
  ├── /packages
  ├── prisma        # Prisma schema & migrations
  ├── .env           # Environment variables
  ├── package.json   # Dependencies & scripts
  ├── README.md      # Documentation
```

---

## 💡 **Contributing**
🚀 We welcome contributions! Feel free to:
- Open an **issue** for bug reports or feature requests  
- Create a **pull request** with your improvements  

---

## 📜 **License**
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 💌 **Contact & Support**
Have questions or suggestions?  
Reach out via **[shrayjayn1@gmail.com](mailto:shrayjayn1@gmail.com)** or open an issue.

---

