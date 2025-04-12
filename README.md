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

### Backend (NestJS)

- **Modular Architecture**: The backend is structured using NestJS modules, promoting scalability and maintainability.
- **RESTful API**: Provides a set of RESTful endpoints for seamless communication with the frontend.
- **Environment Configuration**: Uses `.env` files for managing environment-specific configurations.
- **Validation and Error Handling**: Implements robust validation and error-handling mechanisms.
- **File Uploads**: Supports file uploads, with uploaded files stored in the `uploads/` directory.
- **Testing**: Includes unit tests for controllers and services to ensure reliability.

### Frontend (Vite + TailwindCSS)

- **Modern Frontend Stack**: Built with Vite for fast development and optimized builds.
- **TailwindCSS Integration**: Provides a utility-first CSS framework for rapid UI development.
- **Responsive Design**: Ensures the application is mobile-friendly and works across various devices.
- **Environment Configuration**: Uses `.env` files for frontend-specific configurations.
- **Component-Based Architecture**: Promotes reusability and maintainability of UI components.

## Project Structure

### Backend

- **Configuration Files**: Includes `.env`, `.eslintrc.js`, `.prettierrc`, and `tsconfig.json` for environment setup, linting, formatting, and TypeScript configuration.
- **Source Code**: Located in the `backend/src/` directory, with controllers, services, and modules.
- **Testing**: Tests are located in the `backend/test/` directory.
- **Uploads**: Uploaded files are stored in the `backend/uploads/` directory.

### Frontend

- **Configuration Files**: Includes `vite.config.ts`, `tailwind.config.js`, and `tsconfig.json` for build, styling, and TypeScript configuration.
- **Source Code**: Located in the `frontend/src/` directory, containing components, pages, and assets.
- **Public Assets**: Static files are stored in the `frontend/public/` directory.

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
