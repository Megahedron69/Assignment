# Quizzle

![Quizzle Logo](https://i.imgur.com/eHKi0Tj.png)

Welcome to **Quizzle**, a dynamic quiz app where users can engage in interactive quizzes, track their progress, and test their knowledge on various topics. Built with a modern tech stack, Quizzle offers a seamless experience with a polished frontend and a robust backend system.

## Features

- **Engaging Quizzes**: Dive into quizzes from various categories, complete with multiple-choice questions, images, and timed challenges.

- **Leaderboard**: Track scores in real-time and compete with others.

- **User Management**: Register or log in to save your progress and view past performances.

- **Responsive Design**: Optimized for both mobile and web with a sleek, modern interface.

## Frontend

Quizzle’s frontend is powered by **React Native** and designed to provide an intuitive user experience. The app features a smooth and minimalistic UI that focuses on usability and clarity, making it enjoyable for users of all ages.

### Key Technologies

- **React Native**: The framework powering the app’s cross-platform capabilities.

- **Expo**: Simplifies development, especially for building and deploying both Android and iOS apps.

- **Styled Components**: Ensures a visually appealing and consistent theme across the app.

## Backend

The backend is designed to handle all quiz-related operations efficiently. Quizzle uses **Node.js** with **Express.js** to serve the API endpoints. **PostgreSQL** acts as the database, ensuring quick and reliable data retrieval, while

### Key Features

- **RESTful API**: Handles quiz creation, user management, and leaderboard functionality.

- **PostgreSQL**: Stores quiz data, user progress, and leaderboard scores.

- **Supabase**: Improves performance by caching frequently accessed data.

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher)

- **Expo CLI** (v12.5.2 or higher)

- **PostgreSQL** Supabase database

### Installation

1. Clone the repository.

2. Install dependencies using:

```bash

npm install

```

3. Set up the PostgreSQL database and Redis (optional), and configure the environment variables.

4. Run the development server:

```bash

expo start

```

5. To build the app for Android or iOS, use the **EAS CLI**:

```bash

eas build --platform <android |  ios>

```

## UI Design

Quizzle’s UI is inspired by a sleek, minimalistic approach, ensuring that users have an engaging experience. The UI balances ease of use with vibrant colors and dynamic animations, making the quiz experience enjoyable.

### Credits

UI Inspiration by [Sithira Mithmal](https://www.behance.net/gallery/110674751/Quiz-App-UI-Design).
