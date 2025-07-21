#!/bin/bash

# MTG Card Finder - Deployment Script
# This script automates the deployment process to Cloudflare Pages

set -e  # Exit on any error

echo "🚀 MTG Card Finder - Deployment Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if wrangler is installed
check_wrangler() {
    print_status "Checking Wrangler CLI installation..."
    if ! command -v wrangler &> /dev/null; then
        print_error "Wrangler CLI is not installed. Please install it first:"
        echo "npm install -g wrangler"
        exit 1
    fi
    print_success "Wrangler CLI is installed"
}

# Check if user is authenticated
check_auth() {
    print_status "Checking Cloudflare authentication..."
    if ! wrangler whoami &> /dev/null; then
        print_warning "Not authenticated with Cloudflare. Please run:"
        echo "wrangler login"
        exit 1
    fi
    print_success "Authenticated with Cloudflare"
}

# Install dependencies
install_deps() {
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
}

# Build the project
build_project() {
    print_status "Building the project..."
    npm run build
    print_success "Project built successfully"
}

# Test locally
test_local() {
    print_status "Testing locally with Wrangler..."
    echo "Starting local server... Press Ctrl+C to stop"
    npm run preview
}

# Deploy to staging
deploy_staging() {
    print_status "Deploying to staging environment..."
    npm run deploy:staging
    print_success "Deployed to staging successfully"
}

# Deploy to production
deploy_production() {
    print_status "Deploying to production environment..."
    npm run deploy
    print_success "Deployed to production successfully"
}

# Show deployment URLs
show_urls() {
    echo ""
    print_status "Deployment URLs:"
    echo "Production: https://mtg-card-forge.pages.dev"
    echo "Staging: https://mtg-card-forge-staging.pages.dev"
    echo ""
}

# Main deployment function
deploy() {
    local environment=$1
    
    check_wrangler
    check_auth
    install_deps
    build_project
    
    case $environment in
        "staging")
            deploy_staging
            ;;
        "production")
            deploy_production
            ;;
        *)
            print_error "Invalid environment. Use 'staging' or 'production'"
            exit 1
            ;;
    esac
    
    show_urls
}

# Show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  staging     Deploy to staging environment"
    echo "  production  Deploy to production environment"
    echo "  test        Test locally with Wrangler"
    echo "  build       Build the project only"
    echo "  install     Install dependencies only"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 staging     # Deploy to staging"
    echo "  $0 production  # Deploy to production"
    echo "  $0 test        # Test locally"
}

# Main script logic
case "${1:-help}" in
    "staging")
        deploy "staging"
        ;;
    "production")
        deploy "production"
        ;;
    "test")
        check_wrangler
        install_deps
        build_project
        test_local
        ;;
    "build")
        install_deps
        build_project
        print_success "Build completed"
        ;;
    "install")
        install_deps
        print_success "Dependencies installed"
        ;;
    "help"|*)
        show_usage
        ;;
esac 