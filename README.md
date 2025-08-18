# DexWeb
**DexWeb - Dexterous Hands Hub**

A comprehensive website for tracking dexterous robotic hand hardware and research papers, featuring AI-powered agents for automatic discovery, real-time analytics, and advanced interactive visualizations.

🌐 **Live Site**: [https://davidlxu.github.io/DexWeb/](https://davidlxu.github.io/DexWeb/)

## ✨ Key Features

### 🤖 **Advanced Hardware Comparison**
- **Comprehensive Radar Charts**: Compare ALL dexterous hands simultaneously with intelligent transparency
- **Smart Layering**: Larger area hands positioned at bottom to prevent covering
- **Interactive Legends**: Hover to highlight specific hands while dimming others
- **20+ Unique Colors**: Distinct visualization for each robotic hand

### 📚 **Research Paper Tracking**
- **Curated Collection**: Latest papers on dexterous hand manipulation
- **5 Research Categories**: RL, Imitation Learning, VLAs, Control, Optimization
- **Real-time Discovery**: AI agents continuously find new research

### 🧠 **AI-Powered Intelligence**
- **Qwen API Integration**: Advanced AI for hardware and paper discovery
- **Automated Updates**: GitHub Actions runs every 6 hours
- **Smart Data Enrichment**: Realistic mock data when API unavailable

### 📊 **Real Analytics & Tracking**
- **Google Analytics 4**: Real global visitor tracking
- **Live View Counter**: Session-based unique visitor counting
- **Daily Patterns**: 7-day visitor analytics with mini bar charts
- **Privacy-First**: GDPR compliant tracking

### 🌍 **Multilingual Experience**
- **Bilingual Support**: Seamless English/Chinese switching
- **Technical Accuracy**: Hand and company names preserved
- **Context-Aware**: Smart translation for technical content

### 📱 **Modern Design**
- **Responsive Layout**: Optimized for desktop and mobile
- **Performance Optimized**: Fast loading with efficient data handling
- **Accessibility**: Clean, user-friendly interface

## 🛠️ Tech Stack

- **Frontend**: React with TypeScript, Chart.js for advanced visualizations
- **Analytics**: Google Analytics 4 with real-time visitor tracking
- **Deployment**: GitHub Pages with automated CI/CD
- **AI Integration**: Qwen API for intelligent data discovery
- **Data Storage**: Optimized JSON file-based persistence
- **Automation**: GitHub Actions with 6-hour scheduled updates
- **Build System**: Create React App with comprehensive ESLint configuration
- **Internationalization**: React Context-based bilingual support

## 🚀 Quick Start

### GitHub Pages Deployment (Recommended)

1. **Fork this repository**
2. **Enable GitHub Pages**:
   - Go to your repo Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: Select the branch with your built site
3. **Setup Analytics** (Optional):
   - Get Google Analytics 4 measurement ID
   - Replace `G-1GYLMSFH8S` in `frontend/public/index.html`
   - Real visitor tracking starts immediately
4. **Add AI Integration** (Optional):
   - Go to Settings → Secrets and variables → Actions
   - Add secret: `QWEN_API_KEY` with your Qwen API key
   - Without API key, system uses intelligent mock data

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

## 🏗️ Architecture

### Current: GitHub Pages + Real Analytics

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   GitHub Actions│───▶│  AI Agents       │───▶│  Static Site    │
│   (Every 6hrs)  │    │  Data Discovery  │    │  (GitHub Pages) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │                         │
                              ▼                         ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  JSON Data Files │    │ Google Analytics│
                       │  hardware.json   │    │ Real Tracking   │
                       │  papers.json     │    │ G-1GYLMSFH8S    │
                       └──────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
                                              ┌─────────────────┐
                                              │ Live Analytics  │
                                              │ Footer Display  │
                                              └─────────────────┘
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

## 🔧 Configuration

### Google Analytics Setup

1. **Get GA4 Measurement ID**: Visit [Google Analytics](https://analytics.google.com/)
2. **Create Property**: For your domain `davidlxu.github.io`
3. **Update Code**: Replace `G-1GYLMSFH8S` in `frontend/public/index.html`
4. **Deploy**: Real global tracking starts immediately

### Qwen API Integration

1. **Get API Key**: From [Alibaba Cloud DashScope](https://dashscope.aliyuncs.com/)
2. **Add Secret**: GitHub Settings → Secrets → `QWEN_API_KEY`
3. **Automatic Discovery**: Next run uses real AI agents

### Mock Data Mode

Without API keys, system provides intelligent mock data:
- **Hardware Discovery**: 20+ diverse dexterous hands with realistic specs
- **Research Papers**: Academic papers across all 5 categories
- **Source Simulation**: ArXiv and IEEE discovery patterns
- **Real Analytics**: Local session tracking with GA4 template

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

## 📈 Deployment History

- **v1.0**: Backend + Frontend architecture
- **v2.0**: GitHub Pages deployment with automated updates
- **v2.1**: Node.js compatibility fixes and ESLint compliance
- **v2.2**: Real Google Analytics integration (G-1GYLMSFH8S)
- **v2.3**: Advanced radar charts with all hands visualization
- **v2.4**: Smart layering and interactive legend hover system

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