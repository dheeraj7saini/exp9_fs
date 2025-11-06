#!/usr/bin/env bash
set -e
sudo apt-get update -y
sudo apt-get install -y nginx
sudo rm -rf /var/www/html/*
sudo mkdir -p /var/www/html
# Copy built files from current directory (run this after npm run build)
sudo cp -r dist/* /var/www/html/
sudo tee /etc/nginx/sites-available/default >/dev/null <<'CONF'
server {
  listen 80 default_server;
  listen [::]:80 default_server;
  root /var/www/html;
  index index.html;
  server_name _;
  location / {
    try_files $uri /index.html;
  }
}
CONF
sudo systemctl restart nginx
echo "Frontend deployed to Nginx on port 80"
