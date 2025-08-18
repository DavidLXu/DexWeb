# DexWeb GitHub Pages Deployment Guide

## 🚀 Quick Deploy to GitHub Pages

Your DexWeb is now ready for GitHub Pages deployment with automated data updates!

### 📋 **Prerequisites**
- GitHub account
- Git installed locally
- (Optional) Qwen API key for real data updates

### 🔧 **Setup Steps**

#### 1. **Create GitHub Repository**
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial DexWeb deployment"

# Create repository on GitHub, then:
git remote add origin https://github.com/USERNAME/dexweb.git
git branch -M main
git push -u origin main
```

#### 2. **Configure GitHub Pages**
1. Go to your repository on GitHub
2. Settings → Pages
3. Source: **GitHub Actions**
4. Save

#### 3. **Add Qwen API Key (Optional)**
1. Repository → Settings → Secrets and variables → Actions
2. Add new secret: `QWEN_API_KEY` = `your_api_key_here`
3. (Without this, system uses realistic mock data)

#### 4. **Enable Workflow Permissions**
1. Settings → Actions → General
2. Workflow permissions: **Read and write permissions**
3. Save

### ⚡ **Automatic Deployment**

**GitHub Actions will automatically**:
- ✅ Run every 6 hours to discover new data
- ✅ Update hardware and papers JSON files
- ✅ Build and deploy the frontend
- ✅ Commit updated data back to repository

**Manual Trigger**:
- Go to Actions tab → "Update Dexterous Hands Data" → "Run workflow"

### 🌐 **Access Your Site**

**URL**: `https://USERNAME.github.io/REPOSITORY-NAME/`

Example: `https://johndoe.github.io/dexweb/`

### 📊 **How It Works**

#### **GitHub Actions Workflow**:
1. **Scheduled**: Runs every 6 hours (GitHub free tier limit)
2. **Data Discovery**: Uses your AI agents to find new hardware/papers
3. **Build**: Creates static website from React app
4. **Deploy**: Publishes to GitHub Pages
5. **Commit**: Saves updated data back to repository

#### **Data Sources**:
- ArXiv API simulation (5 search terms)
- IEEE Xplore simulation
- Manufacturer site monitoring
- Qwen AI agent analysis

#### **Static Architecture**:
- **Frontend**: React app served from GitHub Pages
- **Data**: Static JSON files updated by GitHub Actions
- **No Backend**: Everything runs client-side

### 🔧 **Manual Commands**

```bash
# Test data update locally
npm run update-data

# Build for deployment
npm run build

# Full deploy process
npm run deploy
```

### 📁 **File Structure for Deployment**

```
DexWeb/
├── .github/workflows/
│   └── update-data.yml          # GitHub Actions workflow
├── frontend/
│   ├── public/
│   │   ├── hardware.json        # Static data files
│   │   └── papers.json          # Static data files
│   └── src/                     # React source code
├── backend/agents/              # AI agents (used by Actions)
├── scripts/
│   └── update-data.js           # Data update script
└── data/                        # Source data files
```

### 🎯 **Features Available**

**✅ Working Features**:
- Interactive radar chart comparison
- Bilingual interface (English/Chinese)
- Hardware specifications display
- Research papers with categories
- Manual refresh button (refreshes data from static files)
- Responsive mobile design

**⏰ Automated Updates**:
- New hardware discovery every 6 hours
- Research paper collection from multiple sources
- Data persistence across deployments
- Commit history of all updates

### 🔍 **Monitoring**

**Check Update Status**:
1. Repository → Actions tab
2. See workflow runs and success/failure
3. Click on runs to see detailed logs

**Data Verification**:
- Check commit history for `"🤖 Auto-update dexterous hands data"`
- Review `data/hardware.json` and `data/papers.json` for new entries
- Visit live site to see updates

### ⚠️ **Limitations**

**GitHub Pages Limitations**:
- Static hosting only (no backend server)
- 6-hour minimum update frequency (GitHub Actions free tier)
- 1GB storage limit
- 100GB bandwidth per month

**Workarounds Implemented**:
- Static JSON files for data storage
- Client-side data fetching
- GitHub Actions for server-like functionality
- Mock data fallback when API unavailable

### 🛠 **Troubleshooting**

**Common Issues**:

1. **Site not accessible**: Check Pages configuration in Settings
2. **No data updates**: Verify QWEN_API_KEY secret and workflow permissions
3. **Build fails**: Check Actions logs for detailed error messages
4. **Old data**: Manual trigger workflow or wait for next scheduled run

**Debug Steps**:
```bash
# Test locally first
npm run update-data
npm run build

# Check if data files exist
ls -la data/
ls -la frontend/public/
```

### 🎉 **Success!**

Your DexWeb is now:
- ✅ Deployed on GitHub Pages (free)
- ✅ Automatically updating every 6 hours
- ✅ Discoviring new hardware and papers
- ✅ Bilingual and mobile-friendly
- ✅ No backend server required

**Live Site**: `https://USERNAME.github.io/REPOSITORY-NAME/`