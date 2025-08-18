#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

// Import our agents
const HardwareAgent = require('../backend/agents/hardwareAgent');
const PaperAgent = require('../backend/agents/paperAgent');

const dataDir = path.join(__dirname, '../data');
const hardwareFile = path.join(dataDir, 'hardware.json');
const papersFile = path.join(dataDir, 'papers.json');

async function updateData() {
  try {
    console.log('🚀 Starting data update...');
    
    // Ensure data directory exists
    await fs.ensureDir(dataDir);
    
    // Initialize agents
    const hardwareAgent = new HardwareAgent();
    const paperAgent = new PaperAgent();
    
    console.log('🔍 Discovering hardware and papers...');
    
    // Run discovery in parallel
    const [hardwareData, papersData] = await Promise.all([
      hardwareAgent.discoverHardware().catch(err => {
        console.error('Hardware discovery failed:', err.message);
        return [];
      }),
      paperAgent.discoverPapers().catch(err => {
        console.error('Paper discovery failed:', err.message);
        return [];
      })
    ]);
    
    console.log(`📊 Found ${hardwareData.length} hardware items and ${papersData.length} papers`);
    
    // Read existing data
    let currentHardware = [];
    let currentPapers = [];
    
    try {
      if (await fs.pathExists(hardwareFile)) {
        currentHardware = await fs.readJson(hardwareFile);
      }
      if (await fs.pathExists(papersFile)) {
        currentPapers = await fs.readJson(papersFile);
      }
    } catch (error) {
      console.warn('Error reading existing data, starting fresh:', error.message);
    }
    
    // Merge new data with existing data
    const updatedHardware = mergeData(currentHardware, hardwareData, 'name');
    const updatedPapers = mergeData(currentPapers, papersData, 'title');
    
    // Write updated data
    await fs.writeJson(hardwareFile, updatedHardware, { spaces: 2 });
    await fs.writeJson(papersFile, updatedPapers, { spaces: 2 });
    
    console.log('✅ Data update completed successfully!');
    console.log(`📈 Total: ${updatedHardware.length} hardware items, ${updatedPapers.length} papers`);
    
    // Log statistics
    const newHardware = updatedHardware.filter(item => 
      new Date(item.lastUpdated) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    const newPapers = updatedPapers.filter(item => 
      new Date(item.lastUpdated) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    
    console.log(`🆕 New in last 24h: ${newHardware.length} hardware, ${newPapers.length} papers`);
    
  } catch (error) {
    console.error('❌ Data update failed:', error);
    process.exit(1);
  }
}

function mergeData(current, newData, keyField) {
  const merged = [...current];
  
  newData.forEach(newItem => {
    const existingIndex = merged.findIndex(item => 
      item[keyField] && newItem[keyField] && 
      item[keyField].toLowerCase() === newItem[keyField].toLowerCase()
    );
    
    if (existingIndex >= 0) {
      // Update existing item
      merged[existingIndex] = { 
        ...merged[existingIndex], 
        ...newItem, 
        lastUpdated: new Date().toISOString() 
      };
    } else {
      // Add new item
      merged.push({ 
        ...newItem, 
        lastUpdated: new Date().toISOString() 
      });
    }
  });
  
  // Sort by lastUpdated (newest first)
  return merged.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
}

// Run the update
if (require.main === module) {
  updateData();
}

module.exports = { updateData };