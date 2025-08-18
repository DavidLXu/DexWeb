# DexWeb - Dexterous Hands Hub

A comprehensive website for tracking dexterous robotic hand hardware and research papers, featuring AI-powered agents for automatic discovery and updates.

## Features

- **Hardware Comparison**: Interactive radar charts comparing dexterous hand specifications
- **Research Papers**: Curated collection of recent papers on dexterous hand manipulation
- **AI Agents**: Automated discovery using Qwen API for hardware and paper updates
- **Real-time Updates**: Hourly automated updates to keep data current
- **Interactive Visualizations**: Chart.js powered comparisons and analytics

## Tech Stack

- **Frontend**: React with TypeScript, Chart.js for visualizations
- **Backend**: Node.js with Express
- **AI Integration**: Qwen API for intelligent data discovery
- **Storage**: JSON file-based data storage
- **Automation**: Node-cron for scheduled updates

## Installation

1. **Clone and setup**:
   ```bash
   cd DexWeb
   npm install
   cd frontend && npm install
   ```

2. **Environment Configuration**:
   ```bash
   cp .env.example .env
   # Edit .env and add your QWEN_API_KEY
   ```

3. **Start Development**:
   ```bash
   npm run dev
   ```

   This starts both backend (port 3001) and frontend (port 3000).

## API Endpoints

- `GET /api/hardware` - Get all hardware data
- `GET /api/papers` - Get all research papers
- `GET /api/update` - Trigger manual data update

## Configuration

### Qwen API Key
Get your API key from [Alibaba Cloud DashScope](https://dashscope.aliyuncs.com/) and add it to your `.env` file.

### Update Schedule
The system automatically updates every hour. Modify the cron schedule in `backend/server.js` if needed.

## Data Structure

### Hardware
```json
{
  "id": "shadow-dexterous-hand",
  "name": "Shadow Dexterous Hand",
  "manufacturer": "Shadow Robot Company",
  "fingers": 5,
  "dofs": 24,
  "actuatedDofs": 20,
  "abduction": true,
  "flexion": true,
  "price": 150000,
  "lastUpdated": "2024-08-17T10:00:00.000Z"
}
```

### Papers
```json
{
  "id": "learning-dexterous-manipulation",
  "title": "Learning Dexterous Manipulation from Suboptimal Experts",
  "authors": ["Author 1", "Author 2"],
  "abstract": "Paper abstract...",
  "category": "Reinforcement Learning",
  "publishedDate": "2023-10-15",
  "url": "https://arxiv.org/abs/2310.xxxxx",
  "lastUpdated": "2024-08-17T10:00:00.000Z"
}
```

## Development

### Adding New Hardware Sources
Modify `backend/agents/hardwareAgent.js` to include additional discovery sources.

### Adding New Paper Categories
Update the categories in `frontend/src/components/PapersSection.tsx` and the agent prompts.

### Customizing Updates
Adjust the cron schedule in `backend/server.js` and agent prompts for different update behaviors.

## Production Deployment

1. Build the frontend:
   ```bash
   cd frontend && npm run build
   ```

2. Set production environment variables
3. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name dexweb
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.