import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import HardwareSection from './components/HardwareSection';
import PapersSection from './components/PapersSection';
import LanguageSwitcher from './components/LanguageSwitcher';
import UpdateButton from './components/UpdateButton';
import Analytics from './components/Analytics';

interface Hardware {
  id: string;
  name: string;
  manufacturer: string;
  fingers: number;
  dofs: number;
  actuatedDofs: number;
  abduction: boolean;
  flexion: boolean;
  price: number;
  lastUpdated: string;
}

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

function AppContent() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'hardware' | 'papers'>('hardware');
  const [hardware, setHardware] = useState<Hardware[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [hardwareRes, papersRes] = await Promise.all([
        axios.get('/DexWeb/hardware.json'),
        axios.get('/DexWeb/papers.json')
      ]);
      setHardware(hardwareRes.data);
      setPapers(papersRes.data);
      setError(null);
    } catch (err) {
      setError(t('errorMessage'));
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h1>{t('title')}</h1>
            <p>{t('subtitle')}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <UpdateButton onUpdateComplete={fetchData} />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'hardware' ? 'active' : ''}`}
          onClick={() => setActiveTab('hardware')}
        >
          {t('hardwareTab')}
        </button>
        <button
          className={`tab ${activeTab === 'papers' ? 'active' : ''}`}
          onClick={() => setActiveTab('papers')}
        >
          {t('papersTab')}
        </button>
      </div>

      {activeTab === 'hardware' && (
        <HardwareSection hardware={hardware} />
      )}

      {activeTab === 'papers' && (
        <PapersSection papers={papers} />
      )}
      
      <Analytics />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;