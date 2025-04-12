# Overview of AI

# Research and Development of an Enterprise Management System Utilizing RAG Model for Internal Document Analysis and Retrieval

## Overview

This project focuses on researching and developing an enterprise management system that leverages the Retrieval-Augmented Generation (RAG) model to analyze and retrieve internal documents efficiently. The system is designed to assist users in querying and understanding legal and administrative documents, providing intelligent responses and document insights.

## Features

### 1. **Document Processing**

- Extracts metadata, keywords, and penalties from uploaded documents.
- Cleans and normalizes Vietnamese text for better processing.
- Splits documents into manageable chunks for efficient analysis.
- **Technology**: Python, `re` (Regular Expressions), `tqdm`.

### 2. **Legal Document Analysis**

- Detects document sections such as penalties, definitions, and procedures.
- Extracts legal references and highlights important legal terms.
- **Technology**: Python, `re` (Regular Expressions).

### 3. **Chatbot Interface**

- Provides an interactive chat interface for querying documents.
- Suggests questions based on document content.
- Displays chat history and allows users to manage conversations.
- **Technology**: Streamlit.

### 4. **Natural Language Processing**

- Utilizes a Large Language Model (LLM) to generate intelligent responses.
- Enhances responses with professional formatting and highlights key points.
- **Technology**: Google Generative AI (Gemini 1.5 Pro), LangChain.

### 5. **Vector Search**

- Implements vector-based similarity search for document retrieval.
- Integrates FAISS for efficient document indexing and querying.
- **Technology**: FAISS.

### 6. **Caching and Optimization**

- Caches extracted keywords, section types, and processed chunks for faster performance.
- **Technology**: Python `functools.lru_cache`.

### 7. **Document Management**

- Supports uploading and processing `.docx` and `.pdf` files.
- Displays processed document metadata, such as title, type, page count, and upload date.
- **Technology**: `docx2txt`, `pypdf`.

### 8. **Environment Configuration**

- Loads environment variables for secure API key management.
- **Technology**: `python-dotenv`.

### 9. **Customizable Prompt Templates**

- Generates structured prompts for legal document analysis.
- **Technology**: LangChain `PromptTemplate`.

### 10. **Interactive Sidebar**

- Displays processed documents and allows users to reload or clear data.
- **Technology**: Streamlit.

# Overview of the website

## Introduction

This project is a full-stack web application built with a **NestJS** backend and a **Vite-powered** frontend. It is designed to provide a robust, scalable, and modern solution for web development, leveraging TypeScript for both the backend and frontend to ensure type safety and maintainability.

## Features

### Frontend-Only Features

These features are implemented entirely on the frontend and do not require backend interaction:

- **Real-Time Chat**: Users can send and receive messages in real-time using Firebase Firestore.
- **Kanban Board**: Drag-and-drop task management for projects.
- **Task Filtering**: Filter tasks by deadline, status, or assigned users.
- **Responsive Design**: Fully responsive UI for desktop and mobile devices.
- **Notifications**: Display notifications for user actions like task updates or chat messages.
- **File Upload Validation**: Validate file size and format before uploading (e.g., CVs, images).

### Backend-Integrated Features

These features rely on backend APIs for data storage and processing:

- **User Authentication**: Login, logout, and token-based authentication using JWT.
- **Recruitment Management**:
  - Job postings with descriptions, deadlines, and attachments.
  - Application submission with CV uploads.
- **Project Management**:
  - Create, update, and delete projects.
  - Assign members to projects.
- **Attendance Management**:
  - Record attendance for employees.
  - Approve or reject leave requests.
- **Payroll Management**:
  - Calculate and display monthly salaries.
  - Generate payroll reports.
- **Admin Dashboard**:
  - Manage users, projects, and recruitment processes.
  - View detailed CVs and evaluate candidates.
- **Chat Room Management**:
  - Create chat rooms and manage members.
  - Upload and share images in chat.

---

## Technologies Used

### Frontend

- **React**: For building the user interface.
- **TypeScript**: For type-safe development.
- **Tailwind CSS**: For styling and responsive design.
- **Firebase**:
  - Firestore: Real-time database for chat and notifications.
  - Storage: For storing uploaded files like images and documents.
- **TinyMCE**: Rich text editor for job descriptions and task details.
- **React Router**: For navigation and routing.

### Backend

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: Database for storing user, project, and task data.
- **JWT**: For secure authentication and authorization.
- **Axios**: For making HTTP requests from the frontend.

### DevOps

- **Vite**: For fast development and build processes.
- **Postman**: For API testing and documentation.
- **Git**: Version control system for collaboration.

---

## How It Works

### User Flow

1. **Login**: Users authenticate using their email and password.
2. **Dashboard**: Users access their personalized dashboard based on their role (Admin/User).
3. **Recruitment**:
   - Admins post job listings.
   - Users apply for jobs by uploading their CVs.
4. **Project Management**:
   - Admins create projects and assign members.
   - Users manage tasks using the Kanban board.
5. **Chat**:
   - Users communicate in real-time via chat rooms.
   - Images and files can be shared in chat.
6. **Attendance**:
   - Admins manage attendance records and leave requests.
   - Employees submit leave requests for approval.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository.
2. Navigate to the `backend/` and `frontend/` directories and run `npm install` or `yarn` to install dependencies.

### Running the Application

- **Backend**: Run `npm run start` in the `backend/` directory.
- **Frontend**: Run `npm run dev` in the `frontend/` directory.

## Contributing

Contributions are welcome! Please follow the coding standards and guidelines outlined in the project.

## License

This project is licensed under the MIT License.

<h2 align="center">🔒 Please note that this is a demo project 🔒</h2>

<p align="center">
  For confidentiality reasons, only part of the source code is shared.<br/>
  👉 <a href="https://connectwork.vercel.app/">Live Demo: connectwork.vercel.app</a><br/>
  📞 Contact: 0329903471
</p>
