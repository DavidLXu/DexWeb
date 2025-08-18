import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Translations {
  [key: string]: {
    en: string;
    zh: string;
  };
}

const translations: Translations = {
  // Header
  title: {
    en: 'DexWeb',
    zh: 'DexWeb'
  },
  subtitle: {
    en: 'Comprehensive tracking of dexterous hand hardware and research',
    zh: '灵巧手硬件和研究的综合跟踪'
  },
  
  // Navigation
  hardwareTab: {
    en: 'Hardware Comparison',
    zh: '硬件对比'
  },
  papersTab: {
    en: 'Research Papers',
    zh: '研究论文'
  },
  
  // Hardware Section
  hardwareTitle: {
    en: 'Dexterous Hand Hardware Comparison',
    zh: '灵巧手硬件对比'
  },
  manufacturer: {
    en: 'Manufacturer',
    zh: '制造商'
  },
  fingers: {
    en: 'Fingers',
    zh: '手指数'
  },
  totalDofs: {
    en: 'Total DoFs',
    zh: '总自由度'
  },
  actuatedDofs: {
    en: 'Actuated DoFs',
    zh: '驱动自由度'
  },
  abduction: {
    en: 'Abduction/Adduction',
    zh: '展收运动'
  },
  flexion: {
    en: 'Flexion',
    zh: '屈伸运动'
  },
  price: {
    en: 'Price',
    zh: '价格'
  },
  lastUpdated: {
    en: 'Last updated',
    zh: '最后更新'
  },
  yes: {
    en: 'Yes',
    zh: '是'
  },
  no: {
    en: 'No',
    zh: '否'
  },
  noHardwareData: {
    en: 'No hardware data available. The agent will discover and update hardware information automatically.',
    zh: '暂无硬件数据。系统将自动发现和更新硬件信息。'
  },
  
  // Papers Section
  papersTitle: {
    en: 'Dexterous Hand Research Papers',
    zh: '灵巧手研究论文'
  },
  filterByCategory: {
    en: 'Filter by category',
    zh: '按分类筛选'
  },
  all: {
    en: 'All',
    zh: '全部'
  },
  reinforcementLearning: {
    en: 'Reinforcement Learning',
    zh: '强化学习'
  },
  imitationLearning: {
    en: 'Imitation Learning',
    zh: '模仿学习'
  },
  vlas: {
    en: 'VLAs',
    zh: 'VLAs'
  },
  control: {
    en: 'Control',
    zh: '控制'
  },
  optimization: {
    en: 'Optimization',
    zh: '优化'
  },
  authors: {
    en: 'Authors',
    zh: '作者'
  },
  category: {
    en: 'Category',
    zh: '分类'
  },
  published: {
    en: 'Published',
    zh: '发表时间'
  },
  abstract: {
    en: 'Abstract',
    zh: '摘要'
  },
  siteAnalytics: {
    en: 'Site Analytics',
    zh: '网站分析'
  },
  totalViews: {
    en: 'Total Views',
    zh: '总访问量'
  },
  todayViews: {
    en: 'Today\'s Views',
    zh: '今日访问'
  },
  dailyViews: {
    en: 'Daily Views',
    zh: '每日访问'
  },
  noPapersFound: {
    en: 'No papers found for the selected category. The agent will discover and update research papers automatically.',
    zh: '所选分类下未找到论文。系统将自动发现和更新研究论文。'
  },
  
  // Chart
  chartTitle: {
    en: 'Dexterous Hand Hardware Comparison',
    zh: '灵巧手硬件对比'
  },
  affordability: {
    en: 'Affordability',
    zh: '性价比'
  },
  
  // Loading and Error
  loading: {
    en: 'Loading dexterous hands data...',
    zh: '正在加载灵巧手数据...'
  },
  errorMessage: {
    en: 'Failed to fetch data. Please ensure the backend server is running.',
    zh: '获取数据失败。请确保后端服务器正在运行。'
  },
  
  // Language
  language: {
    en: 'English',
    zh: '中文'
  },
  
  // Update
  updateData: {
    en: 'Update Data',
    zh: '更新数据'
  },
  updating: {
    en: 'Updating...',
    zh: '更新中...'
  },
  updateSuccess: {
    en: 'Data updated successfully!',
    zh: '数据更新成功！'
  },
  updateError: {
    en: 'Failed to update data',
    zh: '数据更新失败'
  }
};

interface LanguageContextType {
  language: 'en' | 'zh';
  setLanguage: (lang: 'en' | 'zh') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');

  const t = (key: string): string => {
    const translation = translations[key];
    return translation ? translation[language] : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};