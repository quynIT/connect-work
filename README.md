# Project Overview

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
