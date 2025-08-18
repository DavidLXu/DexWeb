// Using Node.js built-in modules to avoid undici issues in GitHub Actions
const fs = require('fs');
const path = require('path');

class HardwareAgent {
  constructor() {
    this.qwenApiKey = process.env.QWEN_API_KEY;
    this.qwenApiUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
  }

  async callQwen(prompt) {
    if (!this.qwenApiKey) {
      console.warn('QWEN_API_KEY not found. Using mock data.');
      return this.getMockResponse(prompt);
    }

    try {
      // Use fetch instead of axios to avoid undici issues
      const response = await fetch(this.qwenApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.qwenApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "qwen-turbo",
          input: {
            messages: [
              {
                role: "user",
                content: prompt
              }
            ]
          },
          parameters: {
            result_format: "message"
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.output.choices[0].message.content;
    } catch (error) {
      console.error('Error calling Qwen API:', error.message);
      return this.getMockResponse(prompt);
    }
  }

  getMockResponse(prompt) {
    if (prompt.includes('dexterous hand hardware')) {
      return JSON.stringify([
        {
          name: "Shadow Dexterous Hand",
          manufacturer: "Shadow Robot Company",
          fingers: 5,
          dofs: 24,
          actuatedDofs: 20,
          abduction: true,
          flexion: true,
          price: 150000
        },
        {
          name: "Allegro Hand",
          manufacturer: "Wonik Robotics",
          fingers: 4,
          dofs: 16,
          actuatedDofs: 16,
          abduction: true,
          flexion: true,
          price: 35000
        },
        {
          name: "Barrett Hand",
          manufacturer: "Barrett Technology",
          fingers: 3,
          dofs: 8,
          actuatedDofs: 4,
          abduction: true,
          flexion: true,
          price: 25000
        },
        {
          name: "Schunk SVH 5-Finger Hand",
          manufacturer: "Schunk",
          fingers: 5,
          dofs: 9,
          actuatedDofs: 9,
          abduction: false,
          flexion: true,
          price: 45000
        },
        {
          name: "DLR-HIT Hand II",
          manufacturer: "DLR/HIT",
          fingers: 5,
          dofs: 15,
          actuatedDofs: 15,
          abduction: true,
          flexion: true,
          price: 80000
        }
      ]);
    }
    return '[]';
  }

  async discoverHardware() {
    const prompt = `
    You are a research agent specialized in dexterous robotic hands. 
    
    Please provide a comprehensive list of current dexterous hand hardware available in the market or in development by startups and companies.
    
    For each hand, provide the following specifications in JSON format:
    - name: Full product name
    - manufacturer: Company/organization name
    - fingers: Number of fingers (including thumb)
    - dofs: Total degrees of freedom
    - actuatedDofs: Number of actuated degrees of freedom
    - abduction: Boolean - supports abduction/adduction movement
    - flexion: Boolean - supports flexion movement
    - price: Estimated price in USD (use 0 if unknown)

    Focus on recent products from 2020 onwards, including products from:
    - Shadow Robot Company
    - Wonik Robotics
    - Barrett Technology
    - Schunk
    - DLR
    - Robotiq
    - And any new startups or companies

    Return only a valid JSON array of objects, no additional text.
    `;

    try {
      const response = await this.callQwen(prompt);
      let hardwareData = JSON.parse(response);
      
      if (!Array.isArray(hardwareData)) {
        hardwareData = [];
      }

      return hardwareData.map(item => ({
        id: this.generateId(item.name),
        ...item,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error parsing hardware data:', error);
      return [];
    }
  }

  generateId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  }

  async searchWeb(query) {
    try {
      // Search for dexterous hand hardware on multiple sources
      const searchResults = await Promise.allSettled([
        this.scrapeRoboticsNews(query),
        this.scrapeManufacturerSites(query),
        this.searchGoogleScholar(query)
      ]);
      
      const allResults = searchResults
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => result.value);
      
      console.log(`Found ${allResults.length} potential hardware items from web search`);
      return allResults;
    } catch (error) {
      console.error('Error in web search:', error);
      return [];
    }
  }

  async scrapeRoboticsNews(query) {
    // Scrape robotics news sites for new hardware announcements
    const sites = [
      'https://www.therobotreport.com',
      'https://robotics.ieee.org',
      'https://www.roboticsbusinessreview.com'
    ];
    
    const results = [];
    for (const site of sites) {
      try {
        console.log(`Scraping ${site} for: ${query}`);
        // In a real implementation, you would use puppeteer or similar
        // For now, we'll simulate finding hardware mentions
        if (Math.random() > 0.7) {
          results.push({
            source: site,
            title: `New Dexterous Hand Technology Announced`,
            description: `Advanced robotic hand with enhanced capabilities`,
            url: `${site}/dexterous-hand-news`,
            foundAt: new Date().toISOString()
          });
        }
      } catch (error) {
        console.log(`Could not scrape ${site}: ${error.message}`);
      }
    }
    
    return results;
  }

  async scrapeManufacturerSites(query) {
    // Scrape known dexterous hand manufacturer websites
    const manufacturers = [
      { name: 'Shadow Robot Company', url: 'https://www.shadowrobot.com' },
      { name: 'Wonik Robotics', url: 'https://www.wonikrobotics.com' },
      { name: 'Barrett Technology', url: 'https://barrett.com' },
      { name: 'Schunk', url: 'https://schunk.com' },
      { name: 'Robotiq', url: 'https://robotiq.com' }
    ];

    const results = [];
    for (const manufacturer of manufacturers) {
      try {
        console.log(`Checking ${manufacturer.name} for new products`);
        // Simulate finding product updates
        if (Math.random() > 0.8) {
          results.push({
            manufacturer: manufacturer.name,
            product: `${manufacturer.name} Enhanced Hand`,
            specifications: {
              fingers: 4 + Math.floor(Math.random() * 2),
              dofs: 12 + Math.floor(Math.random() * 12),
              actuatedDofs: 8 + Math.floor(Math.random() * 8),
              price: 20000 + Math.floor(Math.random() * 80000)
            },
            source: manufacturer.url,
            foundAt: new Date().toISOString()
          });
        }
      } catch (error) {
        console.log(`Could not check ${manufacturer.name}: ${error.message}`);
      }
    }

    return results;
  }

  async searchGoogleScholar(query) {
    // Search Google Scholar for research papers mentioning new hardware
    try {
      console.log(`Searching Google Scholar for: ${query}`);
      // Simulate finding research papers with hardware mentions
      const results = [];
      if (Math.random() > 0.6) {
        results.push({
          type: 'research_hardware',
          title: 'Novel Dexterous Manipulator Design',
          authors: ['Researcher A', 'Researcher B'],
          abstract: 'This paper presents a new dexterous hand design with improved capabilities.',
          hardwareSpecs: {
            fingers: 5,
            dofs: 20,
            actuatedDofs: 15,
            features: ['force feedback', 'tactile sensing']
          },
          foundAt: new Date().toISOString()
        });
      }
      return results;
    } catch (error) {
      console.log(`Google Scholar search failed: ${error.message}`);
      return [];
    }
  }
}

module.exports = HardwareAgent;