# PyFixer-Pro - User Manual

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [UI Components](#ui-components)
4. [AI Provider Management](#ai-provider-management)
5. [Code Analysis Features](#code-analysis-features)
6. [Advanced Features](#advanced-features)
7. [Troubleshooting](#troubleshooting)

## Overview

PyFixer-Pro is an advanced Python code analysis and fixing tool developed by MT Tech Industries LLC. It leverages multiple AI providers to identify and fix code issues, improve code quality, and visualize dependencies with comprehensive metrics and intelligent suggestions.

### Key Features
- Multi-AI provider support (Gemini, OpenAI, Mistral, OpenRouter, Qwen, Z.AI)
- Real-time code editing with syntax highlighting
- Dependency visualization with interactive graphs
- Comprehensive code metrics dashboard
- Advanced analysis tools for security, performance, and complexity
- Intelligent code suggestions with confidence scoring

## Getting Started

### Initial Setup
1. Launch PyFixer-Pro by running `npm run dev`
2. Access the settings panel (gear icon) to configure your AI provider
3. Enter your API keys for the providers you wish to use
4. Select your preferred AI provider from the dropdown
5. Click "Save Settings" to apply your configuration

### Basic Workflow
1. Create or open Python files in the file explorer
2. Edit code in the main editor panel
3. Click "ANALYZE" to scan for issues
4. Review issues in the diagnostics panel
5. Apply fixes using "APPLY SMART FIX" buttons
6. Use additional panels for metrics and suggestions

## UI Components

### Main Interface
- **File Explorer**: Navigate and manage project files
- **Code Editor**: Real-time editing with syntax highlighting
- **Diagnostics Panel**: View and fix code issues
- **Dependency Map**: Visualize module relationships

### Top Navigation Controls
- **DEPENDENCIES**: Toggle dependency visualization panel
- **METRICS**: View comprehensive code quality metrics
- **PROVIDERS**: Monitor AI provider status and performance
- **ADVANCED**: Access specialized analysis tools
- **SUGGESTIONS**: Browse intelligent code improvement suggestions

### Settings Panel
- **AI Provider Selection**: Choose from available providers
- **API Key Management**: Configure keys for each provider
- **Provider Configuration**: Adjust provider-specific settings

## AI Provider Management

### Switching Providers
1. Click the gear icon in the top-right corner
2. Select your preferred AI provider from the dropdown
3. Enter the corresponding API key
4. Click "Save Settings"

### Provider Comparison
- Use the AI Provider Status panel to compare response times
- Monitor usage statistics and estimated costs
- Track performance metrics for each provider
- Switch providers based on specific task requirements

### Performance Tracking
- Response time monitoring for each provider
- Usage count tracking
- Cost estimation per provider
- Connection status indicators

## Code Analysis Features

### Standard Analysis
- **Bug Detection**: Identify logical errors and typos
- **Architecture Issues**: Find structural problems
- **PEP8 Violations**: Enforce Python style guidelines
- **Security Vulnerabilities**: Flag potential security risks

### Code Metrics Panel
- **Complexity Score**: Measure code complexity (0-100 scale)
- **Maintainability Index**: Assess ease of maintenance
- **Duplication Detection**: Identify repeated code blocks
- **Security Score**: Rate security posture
- **Performance Rating**: Evaluate performance characteristics

### Smart Fixes
- One-click application of AI-generated fixes
- Context-aware suggestions
- Preservation of code logic during fixes
- Preview of changes before application

## Advanced Features

### Advanced Analysis Panel
#### Analysis Types
- **Security Analysis**: Deep scan for vulnerabilities
- **Performance Analysis**: Identify bottlenecks
- **Duplication Analysis**: Find repeated code
- **Complexity Analysis**: Measure code complexity

#### Usage
1. Click "ADVANCED" in the top navigation
2. Select analysis type from the dropdown
3. Click "Run" to execute analysis
4. Review results in the analysis results section

### Code Suggestions Panel
#### Categories
- **Optimizations**: Performance improvements
- **Readability**: Code clarity enhancements
- **Security**: Vulnerability fixes
- **Performance**: Efficiency improvements
- **Best Practices**: Industry standard implementations

#### Applying Suggestions
1. Browse suggestions in the panel
2. Filter by category as needed
3. Review before/after code comparisons
4. Click "Apply Suggestion" to implement

### Dependency Visualization
- Interactive graph of module relationships
- Visual indication of active file
- Click nodes to navigate to files
- Identify circular dependencies

## Best Practices

### Maximizing Effectiveness
- Regularly analyze code during development
- Use multiple AI providers for diverse perspectives
- Monitor code metrics to maintain quality
- Apply suggestions selectively based on confidence scores

### Performance Optimization
- Use faster providers for routine tasks
- Monitor API usage to stay within limits
- Run advanced analyses periodically rather than continuously
- Focus on high-confidence suggestions

### Security Considerations
- Never hardcode API keys in source code
- Regularly rotate API keys
- Review security analysis results carefully
- Validate all automated fixes before deployment

## Troubleshooting

### Common Issues
- **API Key Errors**: Verify keys are correctly entered in settings
- **Provider Unavailable**: Check internet connection and provider status
- **Slow Response Times**: Try switching to a different provider
- **Analysis Failures**: Ensure code is valid Python syntax

### Support Resources
- Visit MT Tech Industries LLC at https://mttechindustries.github.io/
- Check the GitHub repository for updates and known issues
- Contact support for technical assistance

## Keyboard Shortcuts

| Shortcut | Action |
|----------|---------|
| Ctrl+S | Save current file |
| Ctrl+F | Find in file |
| Ctrl+H | Replace in file |
| Ctrl+/ | Toggle comment |
| Ctrl+Shift+F | Format code |

## Support

For technical support or questions about PyFixer-Pro, please visit:
- Website: https://mttechindustries.github.io/
- GitHub: https://github.com/mttechindustries/pyfixer-pro

## About MT Tech Industries LLC

MT Tech Industries LLC is committed to developing innovative technology solutions that advance the field of software development. Our products focus on enhancing developer productivity and code quality through intelligent automation and advanced AI technologies.