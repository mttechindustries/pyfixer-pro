#!/bin/bash

# PyFixer-Pro Startup Script
# Developed by MT Tech Industries LLC
# https://mttechindustries.github.io/

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "  _____      _       _                 "
echo " |  __ \    (_)     | |                "
echo " | |__) | __ ___   _| |__   ___  _ __  "
echo " |  ___/ '__| \ \ / / '_ \ / _ \| '_ \ "
echo " | |   | |  | |\ V /| | | | (_) | |_) |"
echo " |_|   |_|  |_| \_/ |_| |_|\___/| .__/ "
echo "                                | |    "
echo "                                |_|    "
echo ""
echo -e "  ${WHITE}PyFixer-Pro - Advanced Python Code Analysis Tool${CYAN}"
echo -e "  ${YELLOW}Developed by MT Tech Industries LLC${CYAN}"
echo -e "  ${BLUE}https://mttechindustries.github.io/${NC}"
echo ""

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking prerequisites...${NC}"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js is not installed${NC}"
        echo -e "${YELLOW}Please install Node.js (v18 or higher) before running PyFixer-Pro${NC}"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    MIN_VERSION="18.0.0"
    
    if [[ "$(printf '%s\n' "$MIN_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$MIN_VERSION" ]]; then
        echo -e "${YELLOW}⚠️  Node.js version is ${NODE_VERSION}, recommend v${MIN_VERSION} or higher${NC}"
    else
        echo -e "${GREEN}✅ Node.js v${NODE_VERSION} detected${NC}"
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}❌ npm is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ npm detected${NC}"
    
    # Check if we're in the correct directory
    if [[ ! -f "package.json" ]]; then
        echo -e "${RED}❌ package.json not found in current directory${NC}"
        echo -e "${YELLOW}Please run this script from the PyFixer-Pro project directory${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ PyFixer-Pro project detected${NC}"
}

# Function to install dependencies
install_dependencies() {
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    
    if [[ -f "package-lock.json" ]] || [[ -d "node_modules" ]]; then
        echo -e "${YELLOW}⚠️  Dependencies may already be installed${NC}"
        read -p "Reinstall dependencies? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm install
            echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
        else
            echo -e "${GREEN}✅ Skipping dependency installation${NC}"
        fi
    else
        npm install
        echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
    fi
}

# Function to check environment variables
check_environment() {
    echo -e "${BLUE}🔐 Checking environment configuration...${NC}"
    
    ENV_FILE=".env.local"
    if [[ -f "$ENV_FILE" ]]; then
        echo -e "${GREEN}✅ Environment file ($ENV_FILE) found${NC}"
        
        # Count configured API keys
        CONFIGURED_KEYS=0
        ALL_KEYS=("GEMINI_API_KEY" "OPENAI_API_KEY" "MISTRAL_API_KEY" "OPENROUTER_API_KEY" "QWEN_API_KEY" "ZAI_API_KEY")
        
        for KEY in "${ALL_KEYS[@]}"; do
            if grep -q "^${KEY}=" "$ENV_FILE"; then
                VALUE=$(grep "^${KEY}=" "$ENV_FILE" | cut -d'=' -f2-)
                if [[ -n "$VALUE" && "$VALUE" != "your_"* ]]; then
                    ((CONFIGURED_KEYS++))
                fi
            fi
        done
        
        echo -e "${GREEN}✅ $CONFIGURED_KEYS out of ${#ALL_KEYS[@]} API keys configured${NC}"
    else
        echo -e "${YELLOW}⚠️  Environment file ($ENV_FILE) not found${NC}"
        echo -e "${YELLOW}Create $ENV_FILE with your API keys to use PyFixer-Pro${NC}"
        echo -e "${YELLOW}See INSTALLATION.md for setup instructions${NC}"
    fi
}

# Function to start the application
start_application() {
    echo -e "${BLUE}🚀 Starting PyFixer-Pro Development Server...${NC}"
    echo ""
    echo -e "${YELLOW}The application will start shortly.${NC}"
    echo -e "${YELLOW}Once started, access it at the URL shown in the output below.${NC}"
    echo ""
    echo -e "${YELLOW}💡 Tip: Press Ctrl+C to stop the server when you're done${NC}"
    echo ""
    echo -e "${CYAN}┌─────────────────────────────────────────────────────────┐${NC}"
    echo -e "${CYAN}│${NC}              ${WHITE}PyFixer-Pro is Starting...${NC}                 ${CYAN}│${NC}"
    echo -e "${CYAN}├─────────────────────────────────────────────────────────┤${NC}"
    echo -e "${CYAN}│${NC}                                                         ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${GREEN}✓${NC} Look for the 'Local:' URL in the output below        ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${GREEN}✓${NC} Usually: http://localhost:3000 (or assigned port)    ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${GREEN}✓${NC} Press Ctrl+C to stop the server                     ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${GREEN}✓${NC} Restart later with: npm run dev                     ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}                                                         ${CYAN}│${NC}"
    echo -e "${CYAN}└─────────────────────────────────────────────────────────┘${NC}"
    echo ""
    echo -e "${WHITE}📋 Waiting for server to start... Look for the URL in the output below:${NC}"
    echo ""

    # Start the development server
    npm run dev
}

# Function to display help
show_help() {
    echo -e "${CYAN}PyFixer-Pro Startup Script${NC}"
    echo ""
    echo "Usage: ./startup.sh [options]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  -i, --install  Install dependencies only"
    echo "  -c, --check    Check environment only"
    echo "  -s, --start    Start the application only"
    echo ""
    echo "Examples:"
    echo "  ./startup.sh               # Full setup and start"
    echo "  ./startup.sh --install     # Install dependencies only"
    echo "  ./startup.sh --start       # Start application only"
    echo ""
    echo "For more information, visit:"
    echo "https://mttechindustries.github.io/"
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    -i|--install)
        check_prerequisites
        install_dependencies
        exit 0
        ;;
    -c|--check)
        check_prerequisites
        check_environment
        exit 0
        ;;
    -s|--start)
        check_prerequisites
        check_environment
        start_application
        exit 0
        ;;
    "")
        # Default: full setup and start
        ;;
    *)
        echo -e "${RED}Unknown option: $1${NC}"
        show_help
        exit 1
        ;;
esac

# Main execution flow
echo -e "${PURPLE}Starting PyFixer-Pro setup...${NC}"

check_prerequisites
install_dependencies
check_environment

echo ""
echo -e "${GREEN}Setup complete!${NC}"
echo -e "${WHITE}Starting PyFixer-Pro...${NC}"
echo ""

start_application