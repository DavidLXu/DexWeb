import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface UpdateButtonProps {
  onUpdateComplete: () => void;
}

const UpdateButton: React.FC<UpdateButtonProps> = ({ onUpdateComplete }) => {
  const { t } = useLanguage();
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdate = async () => {
    setIsUpdating(true);
    setMessage(null);

    try {
      // For static deployment, we just refresh the data
      // The actual updates happen via GitHub Actions
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      setMessage(t('updateSuccess'));
      onUpdateComplete();
    } catch (error) {
      setMessage(t('updateError'));
      console.error('Update failed:', error);
    } finally {
      setIsUpdating(false);
      setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <button
        onClick={handleUpdate}
        disabled={isUpdating}
        style={{
          background: isUpdating ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          cursor: isUpdating ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          opacity: isUpdating ? 0.7 : 1
        }}
        onMouseOver={(e) => {
          if (!isUpdating) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }}
        onMouseOut={(e) => {
          if (!isUpdating) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        <span style={{ fontSize: '16px' }}>
          {isUpdating ? '🔄' : '🔄'}
        </span>
        {isUpdating ? t('updating') : t('updateData')}
      </button>
      
      {message && (
        <div
          style={{
            background: message.includes('success') || message.includes('成功') 
              ? 'rgba(76, 175, 80, 0.9)' 
              : 'rgba(244, 67, 54, 0.9)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            animation: 'fadeIn 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default UpdateButton;