# PrepGenie.ai 🚀

**PrepGenie.ai** is an AI-driven interview preparation and resume-tailoring platform built to bridge the gap between a candidate’s qualifications and a job’s requirements.

It analyzes a candidate’s resume against a specific job description, identifies skill gaps, generates personalized interview preparation resources, builds structured preparation roadmaps, and creates ATS-optimized resumes tailored to the target role.

---

## ✨ Features

### 1. Intelligent Skill-Gap Analysis
Upload a resume and a job description to receive a structured breakdown of missing or weak skills, categorized by importance and relevance to the target role.

### 2. Targeted Interview Preparation
Generates role-specific technical and behavioral interview questions, along with:
- the interviewer’s likely intention behind each question
- the best way to approach the answer
- key areas the candidate should prepare

### 3. Personalized Daily Roadmaps
Creates a day-by-day interview preparation plan based on:
- the candidate’s current profile
- the target job requirements
- the severity of missing skills
- the available preparation time

### 4. Dynamic ATS-Optimized Resume Generation
Automatically generates a tailored resume aligned with the target job description and exports it as a clean ATS-friendly PDF.

### 5. Secure Authentication System
Includes a complete JWT-based authentication flow with:
- secure login and registration
- HttpOnly cookie-based session handling
- token blacklisting for logout
- protected frontend routes

### 6. Historical Dashboard
Users can save, revisit, and manage past interview reports through a structured dashboard interface.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** SCSS / Sass
- **Routing:** React Router DOM
- **State Management:** React Context API + Custom Hooks
- **HTTP Client:** Axios with interceptors

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JWT + bcryptjs
- **File Handling:** Multer, pdf-parse

### AI & Utilities
- **LLM Integration:** Google Gemini (`@google/genai`)
- **Schema Validation:** Zod + zod-to-json-schema
- **PDF Rendering:** Puppeteer

---

## 🧠 How It Works

1. The user uploads their resume and provides a job description.
2. The backend extracts resume content and combines it with the job requirements.
3. Gemini analyzes the candidate’s profile against the role.
4. The system generates:
   - skill-gap analysis
   - interview questions
   - preparation strategy
   - personalized roadmap
   - tailored resume content
5. The report is saved to the user dashboard for future access.
6. Users can generate and download a job-targeted PDF resume from any saved report.

---

## 🏗️ Frontend Architecture

The frontend follows a **Four-Layer Architecture** for better scalability and maintainability.

### 1. UI Layer (`/pages`, `/components`)
Responsible for rendering pages, layouts, and reusable UI components.

### 2. Hook Layer (`/hooks`)
Contains custom hooks that orchestrate business logic and connect state with API operations.

### 3. State Layer (`/context`)
Manages shared application state such as authenticated user data, loading states, and report data.

### 4. API Layer (`/services`)
Handles communication with the backend using Axios.

---

## 📁 Project Structure

```bash
PrepGenie.ai/
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Route-level pages
│   │   ├── hooks/           # Custom hooks
│   │   ├── context/         # Global state management
│   │   ├── services/        # API layer
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # Express routes
│   │   ├── models/          # Mongoose models
│   │   ├── middlewares/     # Auth / upload / error middleware
│   │   ├── services/        # AI, resume, report logic
│   │   ├── utils/           # Utility functions
│   │   └── config/          # DB and environment config
│   └── package.json
│
└── README.md
```

---

## ⚙️ Local Development Setup

### Prerequisites
Make sure you have the following installed:

- **Node.js** (v18 or later recommended)
- **MongoDB** (local instance or MongoDB Atlas)
- **Google Gemini API key**

---

## 1. Clone the Repository

```bash
git clone https://github.com/Shashwata32/InterviewAI.git
cd InterviewAI
```

---

## 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory and add the following:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

Start the backend development server:

```bash
npm run dev
```

---

## 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run locally at:

```bash
http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend `.env`
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

If your application uses additional frontend environment variables, add them in a frontend `.env` file as required by Vite.

---

## 🛣️ API Endpoints

### Authentication Routes (`/api/auth`)

#### `POST /register`
Registers a new user.

#### `POST /login`
Authenticates a user and sets an HttpOnly cookie.

#### `GET /logout`
Logs out the user by blacklisting the token and clearing cookies.

#### `GET /get-me`
Returns the currently authenticated user.

---

### Interview Engine Routes (`/api/interview`)

#### `POST /`
Accepts:
- resume file
- self description
- job description

Generates an AI-powered interview report and saves it to the database.

#### `GET /reports`
Fetches all saved interview reports for the authenticated user.

#### `GET /reports/:id`
Fetches a single interview report by its ID.

#### `POST /resume/pdf/:id`
Generates and downloads a tailored ATS-friendly resume PDF for the selected report.

---

## 📄 Resume Generation Workflow

PrepGenie.ai not only evaluates a candidate’s profile but also converts the generated resume content into a polished PDF.

### Flow:
1. AI generates job-targeted resume content
2. Resume content is converted into HTML
3. Puppeteer renders the HTML into a PDF
4. The final resume is delivered as an ATS-friendly downloadable document

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing with `bcryptjs`
- HttpOnly cookie support
- Protected routes on both frontend and backend
- Token blacklisting for secure logout
- Structured validation for AI responses

---

## 💡 Use Cases

PrepGenie.ai is useful for:

- students preparing for internships or placements
- freshers applying to software roles
- candidates switching domains and identifying missing skills
- job seekers who want role-specific interview prep
- applicants who need tailored ATS-friendly resumes quickly

---

## 🚀 Future Improvements

Potential enhancements for the platform include:

- support for multiple resume templates
- company-specific interview preparation modes
- mock interview chat interface
- interview performance tracking
- exportable preparation checklists
- role-based analytics and progress dashboards
- support for multiple LLM providers

---

## 👨‍💻 Author

**Developed by Shashwata_32**

If you found this project useful, feel free to star the repository and share feedback.

---

## 📌 Note

Because **Puppeteer** is a relatively large dependency, the initial backend installation may take longer than usual depending on network speed and system configuration.
