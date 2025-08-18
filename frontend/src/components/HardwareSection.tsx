import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import RadarChart from './RadarChart';

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

interface HardwareSectionProps {
  hardware: Hardware[];
}

const HardwareSection: React.FC<HardwareSectionProps> = ({ hardware }) => {
  const { t } = useLanguage();
  
  return (
    <div className="content-section">
      <h2>{t('hardwareTitle')}</h2>
      
      {hardware.length > 0 && (
        <div className="chart-container">
          <RadarChart hardware={hardware} />
        </div>
      )}

      <div className="hardware-grid">
        {hardware.map((item) => (
          <div key={item.id} className="hardware-card">
            <h3>{item.name}</h3>
            <p><strong>{t('manufacturer')}:</strong> {item.manufacturer}</p>
            <p><strong>{t('fingers')}:</strong> {item.fingers}</p>
            <p><strong>{t('totalDofs')}:</strong> {item.dofs}</p>
            <p><strong>{t('actuatedDofs')}:</strong> {item.actuatedDofs}</p>
            <p><strong>{t('abduction')}:</strong> {item.abduction ? t('yes') : t('no')}</p>
            <p><strong>{t('flexion')}:</strong> {item.flexion ? t('yes') : t('no')}</p>
            <p><strong>{t('price')}:</strong> ${item.price.toLocaleString()}</p>
            <p><small>{t('lastUpdated')}: {new Date(item.lastUpdated).toLocaleDateString()}</small></p>
          </div>
        ))}
      </div>

      {hardware.length === 0 && (
        <p>{t('noHardwareData')}</p>
      )}
    </div>
  );
};

export default HardwareSection;