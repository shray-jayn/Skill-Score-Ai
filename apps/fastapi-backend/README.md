# Skill Score AI - FastAPI Backend

## 🚀 Overview

Skill Score AI is a **FastAPI-based** backend designed to analyze coaching conversations and generate structured feedback using **OpenAI** and **AssemblyAI** for transcription and NLP processing.

---

## 📦 Features

✅ **Single API Endpoint** - `/analyze` for processing coaching conversations

✅ **FastAPI Framework** - Lightweight and high-performance backend

✅ **OpenAI GPT Integration** - For generating insights and feedback

✅ **AssemblyAI** - For transcription of coaching conversations

✅ **PostgreSQL Database** - Stores session and coaching round details


✅ **Environment-Based Configurations** - Secured with `.env` file

---

## 🛠 Tech Stack

- **FastAPI** - Python framework for building APIs
- **OpenAI GPT-4o** - AI model for text analysis
- **AssemblyAI** - Speech-to-text transcription
- **PostgreSQL** - Database for session storage
- **Docker** (Optional) - Containerization support

---

## 🛠 Setup & Installation

### 🔧 Prerequisites

Ensure you have the following installed:

- **Python 3.9+**
- **PostgreSQL**
- **pip** (Python package manager)
- **Virtualenv** (recommended)

### 📥 Clone Repository

```sh
git clone https://github.com/shray-jayn/Skill-Score-Ai.git
cd skill-score-ai
cd apps
cd fastapi-backend

```

### 📦 Install Dependencies

```sh
pip install -r requirements.txt
```

### 🔑 Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```ini
# API Keys (Replace with actual keys before deployment)
ASSEMBLY_API_KEY="your_assembly_api_key"
OPENAI_API_KEY="your_openai_api_key"

# Database Credentials (Replace with actual database details)
DB_NAME="your_database_name"
DB_USER="your_database_user"
DB_PASSWORD="your_database_password"
DB_HOST="your_database_host"
DB_PORT="your_database_port"
```

### 🏗 Run Database Migrations

Ensure your PostgreSQL database is running, then apply migrations:

```sh
alembic upgrade head
```

### 🚀 Start the Server

Run the FastAPI server:

```sh
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at: `http://localhost:8000`

---

## 🔥 API Endpoint

### 📌 Analyze Coaching Conversation

- **Endpoint:** `POST /analyze`
- **Description:** Transcribes and analyzes coaching conversations.
- **Request Body:**

```json
{
  "url": "https://your-audio-file-url.com/audio.mp3",
  "teamName": "Coaching Team A",
  "coachingRound": "1",
  "coacheeName1": "John Doe",
  "coacheeName2": "Jane Smith",
  "formattedDate": "2024-02-01",
  "userId": "uuid-generated-id"
}
```

- **Response:**

```json
{
  "success": true,
  "message": "Processing completed."
}
```

---

## 🐳 Docker Setup (Optional)

To run the API in a Docker container:

1. **Build the Docker image:**
   ```sh
   docker build -t skill-score-ai .
   ```
2. **Run the container:**
   ```sh
   docker run -p 8000:8000 --env-file .env skill-score-ai
   ```

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📩 Contact

For any queries, reach out at **[your-email@example.com](mailto\:your-email@example.com)** or visit the [GitHub Repo](https://github.com/yourusername/skill-score-ai).

