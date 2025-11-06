#!/usr/bin/env bash
set -e
sudo apt-get update -y
# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs git
sudo mkdir -p /var/www/backend
sudo cp -r . /var/www/backend
cd /var/www/backend
npm install --production
# Setup systemd
sudo tee /etc/systemd/system/backend.service >/dev/null <<'UNIT'
[Unit]
Description=Node.js Backend Service
After=network.target

[Service]
WorkingDirectory=/var/www/backend
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
Environment=PORT=3000
Environment=ALLOW_ORIGIN=*

[Install]
WantedBy=multi-user.target
UNIT
sudo systemctl daemon-reload
sudo systemctl enable backend
sudo systemctl restart backend
echo "Backend installed and running on port 3000"
