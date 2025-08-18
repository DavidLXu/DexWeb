import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface DailyView {
  date: string;
  views: number;
}

interface AnalyticsData {
  totalViews: number;
  todayViews: number;
  dailyViews: DailyView[];
}

const Analytics: React.FC = () => {
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    todayViews: 0,
    dailyViews: []
  });

  useEffect(() => {
    // Load existing analytics data
    const loadAnalytics = () => {
      const stored = localStorage.getItem('dexweb_analytics');
      const today = new Date().toDateString();
      
      if (stored) {
        const data: AnalyticsData = JSON.parse(stored);
        
        // Check if we need to create today's entry
        const todayEntry = data.dailyViews.find(d => d.date === today);
        if (!todayEntry) {
          data.dailyViews.push({ date: today, views: 0 });
        }
        
        // Keep only last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        data.dailyViews = data.dailyViews.filter(d => 
          new Date(d.date) >= sevenDaysAgo
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setAnalytics(data);
      } else {
        // Initialize analytics
        const initialData: AnalyticsData = {
          totalViews: 0,
          todayViews: 0,
          dailyViews: [{ date: today, views: 0 }]
        };
        setAnalytics(initialData);
      }
    };

    loadAnalytics();
  }, []);

  useEffect(() => {
    // Record a view when component mounts
    const recordView = () => {
      const today = new Date().toDateString();
      
      setAnalytics(prev => {
        const newData = { ...prev };
        newData.totalViews += 1;
        
        // Update today's views
        const todayIndex = newData.dailyViews.findIndex(d => d.date === today);
        if (todayIndex >= 0) {
          newData.dailyViews[todayIndex].views += 1;
          newData.todayViews = newData.dailyViews[todayIndex].views;
        }
        
        // Save to localStorage
        localStorage.setItem('dexweb_analytics', JSON.stringify(newData));
        
        return newData;
      });
    };

    // Only record view once per session
    const viewRecorded = sessionStorage.getItem('view_recorded');
    if (!viewRecorded) {
      recordView();
      sessionStorage.setItem('view_recorded', 'true');
    }
  }, []);

  const maxViews = Math.max(...analytics.dailyViews.map(d => d.views), 1);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="analytics-container" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      margin: '20px 0',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '1.2em',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        📊 {t('siteAnalytics')}
      </h3>
      
      {/* View counters */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '15px',
        marginBottom: '25px'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '15px',
          borderRadius: '8px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#4ade80' }}>
            {analytics.totalViews.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
            {t('totalViews')}
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '15px',
          borderRadius: '8px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#60a5fa' }}>
            {analytics.todayViews.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
            {t('todayViews')}
          </div>
        </div>
      </div>

      {/* Daily views bar chart */}
      <div>
        <h4 style={{ 
          margin: '0 0 15px 0', 
          fontSize: '1em',
          opacity: 0.9
        }}>
          {t('dailyViews')} (Last 7 Days)
        </h4>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'end', 
          gap: '8px',
          height: '120px',
          padding: '10px 0'
        }}>
          {analytics.dailyViews.map((day, index) => {
            const barHeight = Math.max((day.views / maxViews) * 100, 2);
            const isToday = day.date === new Date().toDateString();
            
            return (
              <div 
                key={index} 
                style={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <div style={{
                  fontSize: '0.75em',
                  opacity: 0.8,
                  fontWeight: isToday ? 'bold' : 'normal'
                }}>
                  {day.views}
                </div>
                
                <div style={{
                  width: '100%',
                  height: `${barHeight}px`,
                  background: isToday 
                    ? 'linear-gradient(135deg, #4ade80, #22c55e)'
                    : 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                  borderRadius: '4px 4px 0 0',
                  minHeight: '2px',
                  position: 'relative',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease'
                }} />
                
                <div style={{
                  fontSize: '0.7em',
                  opacity: 0.7,
                  textAlign: 'center',
                  fontWeight: isToday ? 'bold' : 'normal',
                  color: isToday ? '#4ade80' : 'inherit'
                }}>
                  {formatDate(day.date)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div style={{ 
        marginTop: '15px', 
        fontSize: '0.8em', 
        opacity: 0.6,
        textAlign: 'center'
      }}>
        Analytics are stored locally in your browser
      </div>
    </div>
  );
};

export default Analytics;