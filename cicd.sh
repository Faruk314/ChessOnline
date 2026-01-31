#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status

# Configuration
REMOTE_USER="root"
REMOTE_HOST="192.168.10.61"
REMOTE_PORT="22"

# Paths on the remote server
REMOTE_DEST_FRONTEND="/var/www/chess.farukspahic.com"
REMOTE_DEST_BACKEND="/opt/chess"

function deploy_frontend() {
    echo "=============================="
    echo "   Deploying Frontend..."
    echo "=============================="
    
   
    # Install dependencies
    echo "Step 1: Installing frontend dependencies..."
    yarn install

    # Build the project
    echo "Step 2: Building frontend project with production mode..."
    # We load variables from .env.production during build by default if vite uses it, 
    # or we can explicitly copy/symlink it if needed. 
    # Vite automatically loads .env.production when running 'vite build' (which pnpm build calls).
    # To be safe, we can ensure the build mode is production.
    yarn build-frontend --mode production

    # Sync files to remote server
    echo "Step 3: Transferring frontend dist to ${REMOTE_HOST}..."
    rsync -avz -e "ssh -p ${REMOTE_PORT}" dist/ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DEST_FRONTEND}"

    # Reload Nginx
    echo "Step 4: Reloading Nginx..."
    ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "systemctl reload nginx"

    # Return to root
    cd ..
    echo "Frontend deployment complete."
}

function deploy_backend() {
    echo "=============================="
    echo "   Deploying Backend..."
    echo "=============================="

    # Install dependencies
    echo "Step 1: Installing backend dependencies..."
    yarn install

    # Build backend
    yarn build-backend 

    # Build frontend
    echo "Step 1.1: Building frontend project..."
    yarn build-frontend --mode production

    # Sync files to remote server
    # We exclude node_modules and just sync source code and config
    echo "Step 1: Transferring backend source to ${REMOTE_HOST}..."
    rsync -avz -e "ssh -p ${REMOTE_PORT}" \
        --exclude 'node_modules' \
        --exclude '.git' \
        --exclude 'dist' \
        dist-backend/ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DEST_BACKEND}"

    # Copy frontend dist to backend folder
    echo "Step 1.2: Transferring frontend dist to ${REMOTE_HOST}..."
    rsync -avz -e "ssh -p ${REMOTE_PORT}" dist "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DEST_BACKEND}/server/"

    # Copy .env.production file as .env.production and .env
    echo "Step 1.5: Copying .env.production to remote..."
    scp -P "${REMOTE_PORT}" .env.production "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DEST_BACKEND}/.env.production"
    ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "cp ${REMOTE_DEST_BACKEND}/.env.production ${REMOTE_DEST_BACKEND}/.env"

    echo "Step 1.6: Transferring db folder to ${REMOTE_HOST}..."
    rsync -avz -e "ssh -p ${REMOTE_PORT}" db "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DEST_BACKEND}"


    # Copy package.json and yarn.lock
    echo "Step 1.7: Copying package.json and yarn.lock..."
    scp -P "${REMOTE_PORT}" package.json yarn.lock "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DEST_BACKEND}/"

    echo "Step 2: Installing dependencies, running migrations, and restarting PM2..."
    ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "
        cd ${REMOTE_DEST_BACKEND} &&
        yarn install &&
        mkdir -p /var/log/chess &&
        npx dbmate up &&
        pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js
    "

    echo "Backend deployment complete."
}


# Main logic
case "$1" in
    frontend)
        deploy_frontend
        ;;
    backend)
        deploy_backend
        ;;
    all)
        deploy_frontend
        deploy_backend
        ;;
    *)
        echo "Usage: $0 {frontend|backend|set}"
        echo "Example: ./cicd.sh frontend"
        exit 1
        ;;
esac
