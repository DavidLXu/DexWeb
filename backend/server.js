const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const cron = require('node-cron');
const HardwareAgent = require('./agents/hardwareAgent');
const PaperAgent = require('./agents/paperAgent');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, '../data');
const hardwareFile = path.join(dataDir, 'hardware.json');
const papersFile = path.join(dataDir, 'papers.json');

async function ensureDataFiles() {
  await fs.ensureDir(dataDir);
  
  if (!await fs.pathExists(hardwareFile)) {
    await fs.writeJson(hardwareFile, []);
  }
  
  if (!await fs.pathExists(papersFile)) {
    await fs.writeJson(papersFile, []);
  }
}

app.get('/api/hardware', async (req, res) => {
  try {
    const hardware = await fs.readJson(hardwareFile);
    res.json(hardware);
  } catch (error) {
    console.error('Error reading hardware data:', error);
    res.status(500).json({ error: 'Failed to read hardware data' });
  }
});

app.get('/api/papers', async (req, res) => {
  try {
    const papers = await fs.readJson(papersFile);
    res.json(papers);
  } catch (error) {
    console.error('Error reading papers data:', error);
    res.status(500).json({ error: 'Failed to read papers data' });
  }
});

app.get('/api/update', async (req, res) => {
  try {
    console.log('Manual update triggered...');
    await updateData();
    res.json({ message: 'Update completed successfully' });
  } catch (error) {
    console.error('Error during manual update:', error);
    res.status(500).json({ error: 'Update failed' });
  }
});

async function updateData() {
  try {
    console.log('Starting data update...');
    
    const hardwareAgent = new HardwareAgent();
    const paperAgent = new PaperAgent();
    
    const [hardwareData, papersData] = await Promise.all([
      hardwareAgent.discoverHardware(),
      paperAgent.discoverPapers()
    ]);
    
    const currentHardware = await fs.readJson(hardwareFile);
    const currentPapers = await fs.readJson(papersFile);
    
    const updatedHardware = mergeData(currentHardware, hardwareData, 'name');
    const updatedPapers = mergeData(currentPapers, papersData, 'title');
    
    await fs.writeJson(hardwareFile, updatedHardware, { spaces: 2 });
    await fs.writeJson(papersFile, updatedPapers, { spaces: 2 });
    
    console.log(`Updated ${updatedHardware.length} hardware items and ${updatedPapers.length} papers`);
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

function mergeData(current, newData, keyField) {
  const merged = [...current];
  
  newData.forEach(newItem => {
    const existingIndex = merged.findIndex(item => 
      item[keyField].toLowerCase() === newItem[keyField].toLowerCase()
    );
    
    if (existingIndex >= 0) {
      merged[existingIndex] = { ...merged[existingIndex], ...newItem, lastUpdated: new Date().toISOString() };
    } else {
      merged.push({ ...newItem, lastUpdated: new Date().toISOString() });
    }
  });
  
  return merged;
}

cron.schedule('0 * * * *', () => {
  console.log('Running scheduled update...');
  updateData();
});

async function startServer() {
  await ensureDataFiles();
  
  console.log('Performing initial data update...');
  await updateData();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Automatic updates scheduled every hour');
  });
}

startServer().catch(console.error);