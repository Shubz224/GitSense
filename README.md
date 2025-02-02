# GitSense 🚀
![Q&A Screenshot](/public/logic.png) 

GitSense is a powerful and intuitive tool designed to help developers gain deeper insights into their GitHub repositories. With a beautiful UI, AI-powered commit summaries, and a smart Q&A system, GitSense makes it easier than ever to understand and interact with your codebase.

---

## 🌟 Features

1. **AI-Powered Commit Summaries**  
   - Automatically generate concise and meaningful summaries for each commit in your repository.
   - Summaries are generated using Google Gemini API, ensuring high-quality insights.

2. **Smart Q&A System**  
   - Ask any question about your repository, and GitSense will provide AI-generated answers.
   - The system retrieves the top 10 relevant files and summarizes the answer for quick understanding.

3. **Beautiful and Intuitive UI**  
   - A clean and modern dashboard to visualize commit history and summaries.
   - Easy-to-use interface for creating projects and linking GitHub repositories.

4. **Saved Q&A Section**  
   - All your questions and answers are saved for future reference.
   - Quickly revisit past queries and responses without re-asking.

5. **Powered by Cutting-Edge Tech**  
   - Built with Next.js, Prisma, NeonDB, LangChain, and Google Gemini API for a seamless and scalable experience.

---

## 🎯 Problem It Solves

Understanding and managing large codebases can be challenging, especially when dealing with numerous commits and files. Developers often spend hours digging through commit messages and code to find relevant information. GitSense addresses this problem by:

- **Simplifying Commit Analysis**: Automatically summarizing commits to save time and effort.
- **Enhancing Code Understanding**: Providing AI-generated answers to repository-related questions.
- **Improving Productivity**: Offering a centralized dashboard for all repository insights.

---

## 🛠️ Technologies Used

- **Frontend**: Next.js, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Prisma, NeonDB
- **AI/ML**: Google Gemini API, LangChain
- **Authentication**: Clerk
- **State Management**: React Query (TanStack Query)
- **UI Components**: Radix UI, Lucide Icons
- **Other Tools**: Axios, Zod, SuperJSON

---

## 🧠 How It Works

### 1. **Loading Repository Files**
   - GitSense uses **LangChain** to load repository files as documents.
   - Each document is processed and stored for further analysis.

### 2. **Generating Commit Summaries**
   - The **Google Gemini API** is used to generate concise summaries for each commit.
   - Summaries are displayed on the dashboard for easy reference.

### 3. **Creating Embeddings**
   - All documents are converted into embeddings using AI.
   - These embeddings are stored in the database for efficient retrieval.

### 4. **Answering User Questions**
   - When a user asks a question, it is converted into a vector.
   - A **cosine similarity query** is performed across all vectorized summaries.
   - The top 10 most relevant files are returned, along with an AI-generated summary of the answer.

---

## 🖼️ Screenshots

### Dashboard
![Dashboard Screenshot](/public/commits%20home.png)  


### Q&A Section
![Q&A Screenshot](/public/qa.png)  
![Q&A Screenshot](/public/saved%20quesions.png) 
![Q&A Screenshot](/public/Screenshot%20(61).png) 



---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v11 or higher)
- A Google Gemini API key
- A NeonDB database URL
- A Clerk authentication token

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/gitsense.git
2. Navigate to the project directory:
   ```bash
   cd gitsense

3.Set up environment variables:
  ```bash
     DATABASE_URL="your-neondb-url"
     GOOGLE_GEMINI_API_KEY="your-gemini-api-key"
    CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
     CLERK_SECRET_KEY="your-clerk-secret-ke

