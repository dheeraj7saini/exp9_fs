# AWS Deployment Guide: Full Stack on EC2 with Application Load Balancer

## Architecture
- Frontend (React) on 1 EC2 instance with Nginx (port 80, public)
- Backend (Node/Express) on 2+ EC2 instances (port 3000, private to ALB)
- Application Load Balancer (ALB) in front of backend instances
- (Optional) Route 53 DNS for pretty domains

## 1) Security Groups
- **alb-sg**: Inbound HTTP 80 from 0.0.0.0/0
- **backend-sg**: Inbound TCP 3000 from **alb-sg** only
- **frontend-sg**: Inbound HTTP 80 from 0.0.0.0/0

## 2) Backend EC2 (x2)
- AMI: Ubuntu 22.04 LTS, Instance type: t3.micro (free-tier friendly)
- Attach **backend-sg**
- User data (optional): just update & install git
- SSH in, upload project `backend` folder, then:
  ```bash
  cd backend
  cp .env.example .env   # edit ALLOW_ORIGIN to your frontend URL later
  bash ../scripts/install_backend_ubuntu.sh
  sudo systemctl status backend
  curl http://localhost:3000/api/health
  ```

## 3) Create Target Group
- Type: Instances, Protocol: HTTP, Port: 3000
- Health check path: `/api/health`
- Register both backend instances

## 4) Create ALB
- Internet-facing, attach **alb-sg**
- Listener HTTP:80 -> forward to Target Group
- Note the **ALB DNS name** (e.g., `alb-123.ap-south-1.elb.amazonaws.com`)

## 5) Frontend EC2 (x1)
- AMI: Ubuntu 22.04 LTS, Instance type: t3.micro
- Attach **frontend-sg**
- SSH in, install Node to build the app:
  ```bash
  # install Node 18 and git
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs git
  # upload or clone the frontend folder
  cd frontend
  cp .env.example .env
  # set VITE_API_BASE_URL to your ALB DNS (http://alb-....elb.amazonaws.com)
  sed -i 's#VITE_API_BASE_URL=.*#VITE_API_BASE_URL=http://YOUR-ALB-DNS-NAME#' .env
  npm install
  npm run build
  bash ../scripts/install_frontend_nginx.sh
  ```
- Open browser to `http://<FRONTEND_PUBLIC_IP>`

## 6) (Optional) Route 53
- Create hosted zone: `example.com`
- **api.example.com** -> ALB (A/AAAA Alias)
- **app.example.com** -> Frontend public IP (A record) or place another ALB in front of it
- Update `.env` ALLOW_ORIGIN and VITE_API_BASE_URL to the final domains

## 7) Test
- Visit the frontend URL and ensure it loads health and messages
- Add messages and verify round-robin behavior by stopping one backend instance (ALB should still serve via the other)

## 8) Hardening / Scaling
- Put the backend instances in an Auto Scaling Group (ASG) tied to the Target Group
- Use HTTPS: Add an ACM certificate and ALB listener 443
- Lock backend-sg inbound to ALB only (already covered)
- Use MongoDB Atlas or AWS DocumentDB for persistence
