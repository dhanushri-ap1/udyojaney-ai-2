UdyojaneyAI

UdyojaneyAI is an AI-powered judicial workflow management system designed to convert court judgments into actionable tasks and streamline communication between Petitioners, Verifiers, and Responders.

The platform uses AI to extract tasks, assign responsibilities, track status updates, and improve transparency in judicial execution workflows.

Features
        AI-powered task extraction from court judgments
        Role-based dashboards:
        Petitioner
        Verifier
        Responder
        Human verification workflow
        Task approval and rejection system
        Task completion tracking
        Secure JWT authentication
        PostgreSQL database integration
        FastAPI backend APIs
        React frontend dashboard
        
Tech Stack
        Frontend
        React.js
        Axios
        Backend
        FastAPI
        Python
        Database
        PostgreSQL
        SQLAlchemy ORM
        AI Integration
        Groq LLM API
        OCR integration (in progress)
        Authentication
        JWT Tokens
Future Enhancements
        RAG-based legal intelligence system
        AI OCR for scanned judgments and PDFs
        Priority-based task management
        Smart notifications and reminders
        Improved UI/UX
        Secure audit logs and advanced access control


Project Structure
udyojaney-ai-2/
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── auth.py
│   ├── ai.py
│   └── .env
│
├── frontend/
│   ├── src/
│   └── public/
│
└── README.md


Installation
Backend Setup
    cd backend
    pip install -r requirements.txt
    python -m uvicorn main:app --reload

Backend runs on:
    http://127.0.0.1:8000


Frontend Setup
    cd frontend
    npm install
    npm start

Frontend runs on:
    http://localhost:3000

    
Demo Workflow
    Petitioner uploads/pastes court judgment
    AI extracts tasks automatically
    Verifier reviews and approves tasks
    Responder completes approved tasks
    Petitioner tracks progress and completion


    
