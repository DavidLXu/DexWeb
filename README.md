# DexWeb
**DexWeb - Dexterous Hands Hub**

A comprehensive website for tracking dexterous robotic hand hardware and research papers, featuring AI-powered agents for automatic discovery and updates.

🌐 **Live Site**: [https://davidlxu.github.io/DexWeb/](https://davidlxu.github.io/DexWeb/)

## Features

- 🤖 **Hardware Comparison**: Interactive radar charts comparing dexterous hand specifications
- 📚 **Research Papers**: Curated collection of recent papers on dexterous hand manipulation
- 🧠 **AI Agents**: Automated discovery using Qwen API for hardware and paper updates
- 🔄 **Auto Updates**: GitHub Actions runs every 6 hours to discover new research
- 📊 **Interactive Visualizations**: Chart.js powered comparisons and analytics
- 🌍 **Bilingual Support**: English/Chinese language switching
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend**: React with TypeScript, Chart.js for visualizations
- **Deployment**: GitHub Pages with automated CI/CD
- **AI Integration**: Qwen API for intelligent data discovery (optional)
- **Storage**: JSON file-based data storage
- **Automation**: GitHub Actions for scheduled updates
- **Build System**: Create React App with ESLint configuration

## Quick Start

### GitHub Pages Deployment (Recommended)

1. **Fork this repository**
2. **Enable GitHub Pages**:
   - Go to your repo Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: Select the branch with your built site
3. **Optional: Add API Key**:
   - Go to Settings → Secrets and variables → Actions
   - Add secret: `QWEN_API_KEY` with your Qwen API key
   - Without API key, the system uses realistic mock data

### Local Development

```bash
# Clone and setup
git clone https://github.com/your-username/DexWeb.git
cd DexWeb
npm install
cd frontend && npm install

# Start development server
cd frontend
npm start
```

This starts the frontend at `http://localhost:3000`.

## Architecture

### Current: GitHub Pages + GitHub Actions

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   GitHub Actions│───▶│  AI Agents       │───▶│  Static Files   │
│   (Every 6hrs)  │    │  Data Discovery  │    │  (GitHub Pages) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │  JSON Data Files │
                       │  hardware.json   │
                       │  papers.json     │
                       └──────────────────┘
```

### Legacy: Full-Stack (Available in `backend/` folder)

For local development with backend:

```bash
# Environment setup
cp .env.example .env
# Edit .env and add your QWEN_API_KEY

# Start both frontend and backend
npm run dev
```

## API Integration

### Qwen API Key Setup

1. Get your API key from [Alibaba Cloud DashScope](https://dashscope.aliyuncs.com/)
2. Add to GitHub Secrets: `QWEN_API_KEY`
3. Next automated run will use real AI discovery

### Without API Key

The system works perfectly with realistic mock data:
- Generates diverse dexterous hand hardware specs
- Creates academic papers across 5 research categories
- Simulates ArXiv and IEEE paper discovery

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

## Research Categories

- 🤖 **Reinforcement Learning**: Policy gradient methods, sample efficiency
- 👀 **Imitation Learning**: Learning from demonstrations, behavioral cloning
- 🗣️ **VLAs**: Vision-Language-Action models for manipulation
- 🎯 **Control**: Optimal control strategies, real-time control
- ⚡ **Optimization**: Trajectory optimization, grasp synthesis

## Development

### Adding New Hardware Sources

Modify `backend/agents/hardwareAgent.js` to include additional discovery sources.

### Adding New Paper Categories  

Update categories in:
- `frontend/src/components/PapersSection.tsx`
- `backend/agents/paperAgent.js` agent prompts

### Customizing Update Schedule

Modify the cron schedule in `.github/workflows/update-data.yml`:

```yaml
schedule:
  - cron: '0 */6 * * *'  # Every 6 hours
```

## GitHub Actions Workflow

The automated system:

1. **Discovers** new hardware and papers using AI agents
2. **Updates** JSON data files with new findings  
3. **Builds** the React frontend with latest data
4. **Deploys** to GitHub Pages automatically
5. **Commits** updated data back to the repository

## Deployment History

- **v1.0**: Backend + Frontend architecture
- **v2.0**: GitHub Pages deployment with automated updates
- **v2.1**: Node.js compatibility fixes and ESLint compliance

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly: `npm test`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built with ❤️ for the dexterous robotics research community