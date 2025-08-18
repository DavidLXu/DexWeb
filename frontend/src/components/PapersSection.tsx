import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  category: string;
  publishedDate: string;
  url: string;
  lastUpdated: string;
}

interface PapersSectionProps {
  papers: Paper[];
}

const PapersSection: React.FC<PapersSectionProps> = ({ papers }) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: t('all') },
    { key: 'Reinforcement Learning', label: t('reinforcementLearning') },
    { key: 'Imitation Learning', label: t('imitationLearning') },
    { key: 'VLAs', label: t('vlas') },
    { key: 'Control', label: t('control') },
    { key: 'Optimization', label: t('optimization') }
  ];
  
  const filteredPapers = selectedCategory === 'all' 
    ? papers 
    : papers.filter(paper => paper.category === selectedCategory);

  const getCategoryTranslation = (category: string) => {
    switch (category) {
      case 'Reinforcement Learning': return t('reinforcementLearning');
      case 'Imitation Learning': return t('imitationLearning');
      case 'VLAs': return t('vlas');
      case 'Control': return t('control');
      case 'Optimization': return t('optimization');
      default: return category;
    }
  };

  return (
    <div className="content-section">
      <h2>{t('papersTitle')}</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="category-filter" style={{ marginRight: '10px', fontWeight: 'bold' }}>
          {t('filterByCategory')}:
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            fontSize: '14px'
          }}
        >
          {categories.map(category => (
            <option key={category.key} value={category.key}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="paper-list">
        {filteredPapers.map((paper) => (
          <div key={paper.id} className="paper-item">
            <h3>
              <a href={paper.url} target="_blank" rel="noopener noreferrer" style={{ color: '#764ba2', textDecoration: 'none' }}>
                {paper.title}
              </a>
            </h3>
            <p><strong>{t('authors')}:</strong> {paper.authors.join(', ')}</p>
            <p><strong>{t('category')}:</strong> {getCategoryTranslation(paper.category)}</p>
            <p><strong>{t('published')}:</strong> {new Date(paper.publishedDate).toLocaleDateString()}</p>
            <p><strong>{t('abstract')}:</strong> {paper.abstract}</p>
            <p><small>{t('lastUpdated')}: {new Date(paper.lastUpdated).toLocaleDateString()}</small></p>
          </div>
        ))}
      </div>

      {filteredPapers.length === 0 && (
        <p>{t('noPapersFound')}</p>
      )}
    </div>
  );
};

export default PapersSection;