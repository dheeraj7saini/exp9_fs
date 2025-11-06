# Full Stack on AWS with ALB (React + Node)

This repo contains a minimal full stack app and step-by-step instructions to deploy on AWS EC2 with an **Application Load Balancer**.

## Folders
- `backend/`: Node/Express API (port 3000), health check at `/api/health`
- `frontend/`: React (Vite) app that calls the API via `VITE_API_BASE_URL`
- `infra/`: AWS setup guide (ALB, Target Group, Security Groups, Route 53)
- `scripts/`: Ubuntu install scripts for backend (systemd) and frontend (nginx)

## Quick Local Run
```bash
# Backend
cd backend && npm install && npm start
# Frontend (new terminal)
cd frontend && npm install && npm run dev
# Visit http://localhost:5173 (frontend), API at http://localhost:3000
```

## Docker (Optional)
```bash
# Backend
docker build -t alb-backend ./backend
docker run -p 3000:3000 alb-backend

# Frontend
docker build -t alb-frontend ./frontend
docker run -p 8080:80 alb-frontend
```

## Deploy on AWS
See `infra/README_AWS.md` for the full walkthrough.
