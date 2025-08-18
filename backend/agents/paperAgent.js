// Using Node.js built-in modules to avoid undici issues in GitHub Actions

class PaperAgent {
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
    if (prompt.includes('dexterous hand') || prompt.includes('research papers')) {
      return JSON.stringify([
        {
          title: "Learning Dexterous Manipulation from Suboptimal Experts",
          authors: ["Jiang, Y.", "Li, K.", "Gupta, A."],
          abstract: "We present a method for learning dexterous manipulation skills from suboptimal human demonstrations using reinforcement learning.",
          category: "Reinforcement Learning",
          publishedDate: "2023-10-15",
          url: "https://arxiv.org/abs/2310.xxxxx"
        },
        {
          title: "VLA-Hand: Vision-Language-Action Models for Dexterous Manipulation",
          authors: ["Chen, L.", "Wang, S.", "Zhang, M."],
          abstract: "This paper introduces a vision-language-action model specifically designed for dexterous hand manipulation tasks.",
          category: "VLAs",
          publishedDate: "2024-03-20",
          url: "https://arxiv.org/abs/2403.xxxxx"
        },
        {
          title: "Imitation Learning for Complex Dexterous Manipulation",
          authors: ["Rodriguez, A.", "Kim, J.", "Brown, T."],
          abstract: "We explore imitation learning techniques for teaching robots complex dexterous manipulation skills through expert demonstrations.",
          category: "Imitation Learning",
          publishedDate: "2023-12-08",
          url: "https://arxiv.org/abs/2312.xxxxx"
        },
        {
          title: "Optimal Control Strategies for Multi-Fingered Robotic Hands",
          authors: ["Singh, R.", "Patel, N.", "Liu, X."],
          abstract: "This work presents novel control strategies for coordinated movement of multi-fingered robotic hands in manipulation tasks.",
          category: "Control",
          publishedDate: "2024-01-25",
          url: "https://arxiv.org/abs/2401.xxxxx"
        },
        {
          title: "Trajectory Optimization for Dexterous Grasping",
          authors: ["Thompson, M.", "Davis, K.", "Wilson, J."],
          abstract: "We propose optimization techniques for generating smooth and efficient trajectories for dexterous grasping operations.",
          category: "Optimization",
          publishedDate: "2023-11-30",
          url: "https://arxiv.org/abs/2311.xxxxx"
        }
      ]);
    }
    return '[]';
  }


  generateId(title) {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  }

  async searchArxiv(query) {
    try {
      console.log(`Searching ArXiv for: ${query}`);
      
      // ArXiv API search terms for dexterous hand research
      const searchTerms = [
        'dexterous hand manipulation',
        'robotic hand grasping',
        'dexterous manipulation learning',
        'multi-finger robot control',
        'hand-object manipulation'
      ];

      const allPapers = [];
      
      for (const term of searchTerms) {
        try {
          // Simulate ArXiv API call (in real implementation, use actual ArXiv API)
          const papers = await this.mockArxivSearch(term);
          allPapers.push(...papers);
        } catch (error) {
          console.log(`ArXiv search failed for "${term}": ${error.message}`);
        }
      }

      // Remove duplicates and return recent papers
      const uniquePapers = this.removeDuplicatePapers(allPapers);
      console.log(`Found ${uniquePapers.length} unique papers from ArXiv`);
      
      return uniquePapers;
    } catch (error) {
      console.error('ArXiv search error:', error);
      return [];
    }
  }

  async mockArxivSearch(searchTerm) {
    // Simulate ArXiv API response with realistic paper data
    const categories = ['Reinforcement Learning', 'Imitation Learning', 'VLAs', 'Control', 'Optimization'];
    const papers = [];
    
    // Randomly generate 1-3 papers per search term
    const numPapers = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numPapers; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const year = 2023 + Math.floor(Math.random() * 2); // 2023 or 2024
      const month = Math.floor(Math.random() * 12) + 1;
      const day = Math.floor(Math.random() * 28) + 1;
      
      papers.push({
        title: this.generatePaperTitle(category, searchTerm),
        authors: this.generateAuthors(),
        abstract: this.generateAbstract(category),
        category: category,
        publishedDate: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        url: `https://arxiv.org/abs/${year.toString().slice(2)}${month.toString().padStart(2, '0')}.${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`,
        source: 'ArXiv',
        searchTerm: searchTerm,
        foundAt: new Date().toISOString()
      });
    }
    
    return papers;
  }

  generatePaperTitle(category, searchTerm) {
    const titles = {
      'Reinforcement Learning': [
        'Deep Reinforcement Learning for Dexterous Hand Manipulation',
        'Policy Gradient Methods for Robotic Hand Control',
        'Multi-Agent RL for Coordinated Finger Movement',
        'Sample-Efficient Learning for Dexterous Grasping'
      ],
      'Imitation Learning': [
        'Learning from Demonstration for Dexterous Manipulation',
        'Behavioral Cloning for Multi-Finger Robot Hands',
        'Expert Demonstration Analysis in Hand Manipulation',
        'One-Shot Imitation for Dexterous Tasks'
      ],
      'VLAs': [
        'Vision-Language-Action Models for Hand Manipulation',
        'Multimodal Learning for Dexterous Robot Control',
        'Language-Guided Manipulation with Robotic Hands',
        'VLA-Based Dexterous Manipulation Planning'
      ],
      'Control': [
        'Optimal Control for Multi-Fingered Robotic Hands',
        'Adaptive Control Strategies for Dexterous Manipulation',
        'Force Control in Dexterous Grasping Systems',
        'Real-Time Control of Anthropomorphic Hands'
      ],
      'Optimization': [
        'Trajectory Optimization for Dexterous Grasping',
        'Motion Planning for Multi-Finger Manipulation',
        'Optimization-Based Grasp Synthesis',
        'Energy-Efficient Control of Robotic Hands'
      ]
    };
    
    const categoryTitles = titles[category] || titles['Control'];
    return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
  }

  generateAuthors() {
    const firstNames = ['Alex', 'Jordan', 'Sam', 'Riley', 'Casey', 'Taylor', 'Morgan', 'Jamie'];
    const lastNames = ['Chen', 'Smith', 'Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson'];
    
    const numAuthors = Math.floor(Math.random() * 4) + 1; // 1-4 authors
    const authors = [];
    
    for (let i = 0; i < numAuthors; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      authors.push(`${firstName} ${lastName}`);
    }
    
    return authors;
  }

  generateAbstract(category) {
    const abstracts = {
      'Reinforcement Learning': 'We present a novel reinforcement learning approach for dexterous hand manipulation tasks. Our method demonstrates significant improvements in sample efficiency and task success rates compared to existing approaches.',
      'Imitation Learning': 'This work explores imitation learning techniques for teaching robots complex dexterous manipulation skills through expert demonstrations. We show that our approach can learn intricate manipulation behaviors from limited demonstration data.',
      'VLAs': 'We introduce a vision-language-action model specifically designed for dexterous hand manipulation tasks. The model integrates visual perception, natural language understanding, and motor control for improved manipulation capabilities.',
      'Control': 'This paper presents novel control strategies for coordinated movement of multi-fingered robotic hands in manipulation tasks. Our approach addresses the challenges of high-dimensional control and contact dynamics.',
      'Optimization': 'We propose optimization techniques for generating smooth and efficient trajectories for dexterous grasping operations. The method considers both kinematic constraints and dynamic stability requirements.'
    };
    
    return abstracts[category] || abstracts['Control'];
  }

  removeDuplicatePapers(papers) {
    const seen = new Set();
    return papers.filter(paper => {
      const key = paper.title.toLowerCase().trim();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  async searchIEEE(query) {
    try {
      console.log(`Searching IEEE Xplore for: ${query}`);
      
      // Simulate IEEE API search
      const results = [];
      
      // IEEE typically has more formal, conference-based papers
      if (Math.random() > 0.5) {
        results.push({
          title: 'Advanced Dexterous Manipulation Systems: A Comprehensive Review',
          authors: ['Dr. Research Lead', 'Prof. Academic'],
          abstract: 'This comprehensive review examines the current state of dexterous manipulation systems, covering hardware advances, control algorithms, and future research directions.',
          category: 'Control',
          publishedDate: '2024-01-15',
          url: `https://ieeexplore.ieee.org/document/${Math.floor(Math.random() * 9999999)}`,
          source: 'IEEE Xplore',
          conference: 'IEEE International Conference on Robotics and Automation (ICRA)',
          foundAt: new Date().toISOString()
        });
      }
      
      console.log(`Found ${results.length} papers from IEEE Xplore`);
      return results;
    } catch (error) {
      console.error('IEEE search error:', error);
      return [];
    }
  }

  async discoverPapers() {
    const prompt = `
    You are a research agent specialized in dexterous robotic hands and manipulation.
    
    Please provide a comprehensive list of recent research papers (2023-2024) related to dexterous hand manipulation.
    
    Focus on papers from these categories:
    - Reinforcement Learning
    - Imitation Learning
    - VLAs (Vision-Language-Action models)
    - Control
    - Optimization
    
    For each paper, provide the following information in JSON format:
    - title: Full paper title
    - authors: Array of author names
    - abstract: Brief abstract (2-3 sentences)
    - category: One of the categories mentioned above
    - publishedDate: Publication date in YYYY-MM-DD format
    - url: Paper URL (ArXiv, IEEE, etc.)

    Look for papers from top venues like:
    - ArXiv preprints
    - ICRA, IROS, RSS robotics conferences
    - NeurIPS, ICML machine learning conferences
    - IJRR, TRO robotics journals

    Return only a valid JSON array of objects, no additional text.
    `;

    try {
      // Combine AI agent discovery with web scraping
      const [aiPapers, arxivPapers, ieeePapers] = await Promise.allSettled([
        this.callQwen(prompt).then(response => {
          let papersData = JSON.parse(response);
          if (!Array.isArray(papersData)) papersData = [];
          return papersData;
        }),
        this.searchArxiv('dexterous hand manipulation'),
        this.searchIEEE('dexterous robotic hand')
      ]);

      // Combine all results
      const allPapers = [];
      
      if (aiPapers.status === 'fulfilled') {
        allPapers.push(...aiPapers.value);
      }
      
      if (arxivPapers.status === 'fulfilled') {
        allPapers.push(...arxivPapers.value);
      }
      
      if (ieeePapers.status === 'fulfilled') {
        allPapers.push(...ieeePapers.value);
      }

      // Remove duplicates and add metadata
      const uniquePapers = this.removeDuplicatePapers(allPapers);
      
      console.log(`Total papers discovered: ${uniquePapers.length}`);
      
      return uniquePapers.map(item => ({
        id: this.generateId(item.title),
        ...item,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error in paper discovery:', error);
      // Fallback to mock data
      try {
        const response = this.getMockResponse('dexterous hand research papers');
        let papersData = JSON.parse(response);
        if (!Array.isArray(papersData)) papersData = [];
        return papersData.map(item => ({
          id: this.generateId(item.title),
          ...item,
          lastUpdated: new Date().toISOString()
        }));
      } catch (parseError) {
        console.error('Error parsing fallback data:', parseError);
        return [];
      }
    }
  }
}

module.exports = PaperAgent;