<div align="center">
<img width="1200" height="475" alt="PyFixer-Pro Banner" src="https://github.com/mttechindustries/mttechindustries.github.io/blob/main/MT-Tech-Industries.png?raw=true" />
</div>

# PyFixer-Pro - Advanced Python Code Analysis & Fixing Tool

PyFixer-Pro is an advanced Python code analysis and fixing tool developed by MT Tech Industries LLC that leverages multiple AI providers to identify and fix code issues, improve code quality, and visualize dependencies. The enhanced version includes comprehensive metrics, advanced analysis, and intelligent suggestions.

## Features

- **Multi-AI Provider Support**: Choose from Gemini, OpenAI, Mistral, OpenRouter, Qwen, and Z.AI
- **Code Analysis**: Identify bugs, architectural issues, and PEP8 violations
- **Smart Code Fixes**: Apply AI-powered fixes to common code problems
- **Code Formatting**: Auto-format code to PEP8 standards
- **Dependency Visualization**: Interactive dependency graph visualization
- **Real-time Editing**: Live code editing with syntax highlighting
- **Project Management**: Multi-file project support
- **Code Metrics Dashboard**: Detailed metrics on complexity, maintainability, duplication, security, and performance
- **AI Provider Status**: Monitor connection status, response times, usage, and costs for each provider
- **Advanced Analysis**: Specialized analysis for security, performance, duplication, and complexity
- **Intelligent Code Suggestions**: AI-powered suggestions for code improvements with before/after comparisons
- **Provider Performance Tracking**: Compare effectiveness of different AI providers for specific tasks

## Developed by MT Tech Industries LLC

This project is proudly developed and maintained by [MT Tech Industries LLC](https://mttechindustries.github.io/). Our commitment is to provide cutting-edge development tools that empower developers worldwide.

## Supported AI Providers

- Google Gemini
- OpenAI GPT-4
- Mistral AI
- OpenRouter
- Alibaba Qwen
- Z.AI

## Enhanced UI Components

### Top Navigation
- **DEPENDENCIES**: Toggle dependency visualization
- **METRICS**: View comprehensive code quality metrics
- **PROVIDERS**: Monitor AI provider status and performance
- **ADVANCED**: Access specialized analysis tools
- **SUGGESTIONS**: Browse intelligent code improvement suggestions

### Panels
- **Code Metrics Panel**: Shows complexity, maintainability, duplication, security, and performance scores
- **AI Provider Status Panel**: Displays connection status, response times, usage statistics, and estimated costs
- **Advanced Analysis Panel**: Offers specialized analysis for security, performance, duplication, and complexity
- **Code Suggestions Panel**: Provides categorized code improvement suggestions with confidence scoring

## Run Locally

**Prerequisites:** Node.js

### Option 1: Using the startup script (Recommended)
1. Make the script executable:
   ```bash
   chmod +x ./startup.sh
   ```
2. Run the startup script:
   ```bash
   ./startup.sh
   ```
3. After running the script, the application will start automatically. Look for the URL in the terminal output (typically `http://localhost:3000` or another available port) and copy it to your browser.

### Option 2: Manual setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables in `.env.local`:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   OPENAI_API_KEY=your_openai_api_key
   MISTRAL_API_KEY=your_mistral_api_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   QWEN_API_KEY=your_qwen_api_key
   ZAI_API_KEY=your_zai_api_key
   ```
3. Run the app:
   ```bash
   npm run dev
   ```
4. After running the command, look for the URL in the terminal output (typically `http://localhost:3000` or another available port) and copy it to your browser.

The application will be available at the URL shown in the terminal output (typically `http://localhost:3000` or another available port if 3000 is in use).

## Configuration

Access the settings panel (gear icon in top-right) to configure your preferred AI provider and API keys.

## Architecture

PyFixer-Pro uses an abstract AI provider interface that allows seamless switching between different AI services. The architecture supports:

- Pluggable AI providers
- Centralized configuration management
- Consistent API across different providers
- Easy addition of new AI services
- Comprehensive error handling and fallback mechanisms
- Modular component architecture for easy extension

## Advanced Features

### Code Quality Metrics
- **Complexity Score**: Measures code complexity to identify overly complex functions
- **Maintainability Index**: Assesses how easy the code is to maintain
- **Duplication Detection**: Identifies duplicated code blocks
- **Security Score**: Flags potential security vulnerabilities
- **Performance Rating**: Evaluates code for performance issues

### AI Provider Management
- **Performance Tracking**: Monitors response times and accuracy of different providers
- **Cost Estimation**: Shows estimated costs for API usage
- **Usage Statistics**: Tracks API call counts and frequency
- **Connection Status**: Real-time monitoring of provider availability

### Intelligent Suggestions
- **Category Filtering**: Organize suggestions by optimization, readability, security, etc.
- **Confidence Scoring**: Each suggestion includes a confidence percentage
- **Before/After Views**: See code transformations before and after applying suggestions
- **One-Click Application**: Easily implement suggested improvements

## About MT Tech Industries LLC

MT Tech Industries LLC is committed to developing innovative technology solutions that advance the field of software development. Our products focus on enhancing developer productivity and code quality through intelligent automation and advanced AI technologies.

Learn more about us at [https://mttechindustries.github.io/](https://mttechindustries.github.io/)

## Contributing

Contributions are welcome! Feel free to submit pull requests or open issues for bugs and feature requests.

## License

MIT
