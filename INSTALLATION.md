# PyFixer-Pro - Installation Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Git

## Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/mttechindustries/pyfixer-pro.git
cd pyfixer-pro
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory with your API keys:

```env
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
MISTRAL_API_KEY=your_mistral_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
QWEN_API_KEY=your_qwen_api_key
ZAI_API_KEY=your_zai_api_key
```

### 4. Start the Development Server

#### Option 1: Using the startup script (Recommended)
Run the startup script which will check prerequisites, install dependencies, and start the server:
```bash
chmod +x ./startup.sh
./startup.sh
```
After running the script, look for the URL in the terminal output (typically `http://localhost:3000` or another available port) and copy it to your browser.

#### Option 2: Using npm directly
```bash
npm run dev
```
After running the command, look for the URL in the terminal output (typically `http://localhost:3000` or another available port) and copy it to your browser.

The application will be available at the URL shown in the terminal output (typically `http://localhost:3000` or another available port if 3000 is in use).

## Configuration Options

### AI Provider Selection
- Access the settings panel (gear icon) to switch between AI providers
- Each provider requires its respective API key
- Monitor provider performance and costs in the AI Provider Status panel

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| GEMINI_API_KEY | Google Gemini API key | Yes* |
| OPENAI_API_KEY | OpenAI API key | Yes* |
| MISTRAL_API_KEY | Mistral AI API key | Yes* |
| OPENROUTER_API_KEY | OpenRouter API key | Yes* |
| QWEN_API_KEY | Alibaba Qwen API key | Yes* |
| ZAI_API_KEY | Z.AI API key | Yes* |

*At least one API key is required to use the application

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the production version |
| `npm run preview` | Previews the production build locally |

## Development

### Project Structure
```
pyfixer-pro/
├── components/          # React UI components
├── services/           # AI service implementations
├── types.ts           # TypeScript type definitions
├── App.tsx           # Main application component
├── README.md         # Project documentation
└── package.json      # Dependencies and scripts
```

### Adding New AI Providers
1. Implement the `AIProvider` interface in `services/aiService.ts`
2. Register the provider with `AIFactory.registerProvider()`
3. Add the provider to the settings panel UI

## Troubleshooting

### Common Issues
- **API Key Errors**: Ensure all API keys are correctly set in `.env.local`
- **CORS Issues**: Some AI providers may have browser restrictions; consider using a proxy
- **Build Errors**: Run `npm install` to ensure all dependencies are installed

### Performance Tips
- Use the AI Provider Status panel to monitor response times
- Switch to faster providers during heavy usage
- Monitor API usage to stay within rate limits

## Support

For support, please contact MT Tech Industries LLC at https://mttechindustries.github.io/

## License

MIT License - See LICENSE file for details