# AIPhen GenAI-Based Financial Assistant

## Overview
The GenAI-based Financial Assistant is a web application designed to bridge the gap in financial literacy for investors in India. The platform provides AI-driven financial education and investment product discovery, helping users understand investment concepts and explore financial instruments using structured UI elements.

## Demo Link 
http://aiphen.atrv.tech

## Objectives
- Educate users on investment concepts through AI-powered conversations and embedded fintech videos from YouTube.
- Provide a structured interface with filters and sorting to discover investment products.
- Integrate real-time financial data via Google Finance API.
- Ensure user security through email/password authentication.
- Store personal financial data (without providing direct investment advice).

## Target Audience
- First-time investors looking to understand financial concepts.
- Intermediate investors seeking structured guidance.
- Individuals exploring financial products but lacking expert advice.

## Core Features & User Journey

### 1. User Authentication
- Email/Password signup & login.
- Optional OTP verification for enhanced security.

### 2. Dashboard
- Displays trending financial topics and FAQs.
- Provides quick access to AI-powered Q&A.

### 3. AI-Powered Financial Education
- Users can ask financial questions, and AI provides structured, enhanced responses.
- Responses include text, charts, tables, and interactive visuals.
- Strictly educational—no direct investment recommendations.

### 4. Investment Product Discovery
- Filters & sorting options to find relevant financial products.
- Uses real-time data from Google Finance API.

### 5. User Profile & Preferences
- Stores personal financial inputs for tailored education.
- Allows users to track past interactions with AI.

### 6. Settings & Data Management
- Users can manage account details.
- Option to delete stored data to comply with privacy standards.

## High-Level Technical Stack Recommendations
- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB or PostgreSQL
- **Authentication**: JWT, OTP verification
- **API Integration**: Google Finance API
- **Hosting**: Vercel for frontend, AWS for backend

## Installation

To install and run the GenAI-Based Financial Assistant locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/A1THARV/AIPhen.git
    ```
2. Navigate to the project directory:
    ```bash
    cd AIPhen
    ```
3. Install the necessary dependencies:
    ```bash
    npm install
    ```

## Usage

Here's how you can use the GenAI-Based Financial Assistant:

1. Start the development server:
    ```bash
    npm start
    ```
2. Open your browser and navigate to `http://localhost:3000` to access the application.

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact Information

For any questions or feedback, please contact Atharv at a1games2121@gmail.com.
