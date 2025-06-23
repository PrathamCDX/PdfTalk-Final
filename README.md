# PDFTalks

PDFTalks is a full-stack web application that enables users to upload PDF documents, analyze their content, and interact with them through a chat-based interface. The project leverages a modern frontend built with React and TypeScript, and a robust backend powered by FastAPI.

## Features

- Upload and view PDF documents
- Analyze PDF content using backend processing
- Chat interface for querying and interacting with PDF data
- Responsive and modern UI with Tailwind CSS

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Python, FastAPI

## Project Structure

```
backend/
  main.py
  controllerFunctions.py
  requirements.txt
  ...
frontend/
  src/
    components/
    pages/
    ...
  package.json
  ...
```

## Getting Started

### Backend Setup

1. Navigate to the `backend` directory:
   ```sh
   cd backend
   ```
2. Create and activate a virtual environment (if not already set up):
   ```sh
   python -m venv env
   .\env\Scripts\activate
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Run the FastAPI server:
   ```sh
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Usage

- Add the necessary API keys in the .env file to run the app locally
- Open the frontend app in your browser (usually at `http://localhost:5173`) or access the hosted version at [pdf-talks-drab.vercel.app](https://pdf-talks-drab.vercel.app)
- Note: The backend is not hosted due to heavy ML models and free tier limitations. For full functionality, run the backend locally.
- Upload a PDF document
- Use the chat interface to ask questions or analyze the PDF content
