# 📂 **Skill Score AI - Frontend**  
A **modern AI-powered coaching feedback platform** built with **React**, powered by a **FastAPI backend**, and managed in a **TurboRepo monorepo**. Skill Score AI enables users to securely upload coaching sessions, analyze feedback, and generate structured reports.

![Skill Score AI Banner](screenshots/banner.png)

---

## 🚀 **Features**
✅ Secure user authentication with JWT  
✅ Intuitive **file upload** with real-time processing  
✅ **AI-powered coaching insights** using OpenAI  
✅ **Audio & transcript analysis** with AssemblyAI  
✅ **Dashboard for coaching feedback visualization**  
✅ **Report generation** for coaching rounds  
✅ **Recoil state management** for real-time updates  
✅ **Ant Design & TailwindCSS** for a sleek UI  

---

## 📦 **Tech Stack**
- **Frontend**: React, Vite, TailwindCSS, Recoil, React Router, Ant Design  
- **Backend**: FastAPI, NestJS
- **Build Tool**: TurboRepo  
- **State Management**: Recoil  
- **API Calls**: Axios  

---

## 🎨 **Screenshots**
Here are some screenshots of the frontend interface:

### 📁 **Dashboard View**
![Dashboard Screenshot](screenshots/dashboard.png)

### 📤 **File Upload**
![File Upload Screenshot](screenshots/upload.png)

### 📊 **Coaching Feedback**
![Coaching Feedback Screenshot](screenshots/feedback.png)

### 📄 **Report Generation**
![Report Screenshot](screenshots/report.png)

*(Ensure these screenshots are available in your repo under the `screenshots/` folder.)*

---

## 🛠 **Installation & Setup**

### ⚡ **Prerequisites**
- Node.js `>= 18`
- PNPM / Yarn / NPM (preferred: `pnpm`)
- TurboRepo installed globally _(optional)_

### 🏗️ **Step 1: Clone the repository**
```sh
git clone https://github.com/shray-jayn/Skill-Score-Ai.git
cd Skill-Score-Ai
cd apps/frontend
```

### 🚀 **Step 2: Install dependencies**
Using PNPM:
```sh
pnpm install
```
Or with Yarn:
```sh
yarn install
```

### 🏃 **Step 3: Start the frontend app**
```sh
pnpm dev  # or yarn dev
```
Your Skill Score AI frontend will be running at **`http://localhost:5173`** (default Vite port).

---

## 🏗 **Build for Production**
To build the frontend:
```sh
pnpm build  # or yarn build
```
For a preview of the production build:
```sh
pnpm preview  # or yarn preview
```

---

## 📜 **Folder Structure**
```
/skill-score-ai
  ├── /apps
  │   ├── /frontend           # React app (this repo)
  │   ├── /backend            # NestJs backend 
  │   ├── /fastapi-backend    # FastAPI backend
  ├── /packages
  ├── turbo.json      # TurboRepo config
  ├── package.json
  ├── README.md
```

---

## 🔍 **Linting & Code Quality**
Run ESLint to check for code issues:
```sh
pnpm lint
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

