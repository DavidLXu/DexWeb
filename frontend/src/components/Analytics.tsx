import React, { useState, useEffect } from 'react';

interface AnalyticsData {
  totalViews: number;
  todayViews: number;
  lastSevenDays: number[];
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    todayViews: 0,
    lastSevenDays: []
  });

  useEffect(() => {
    // Simulate tracking global visitor data (in real app, this would be server-side)
    const initializeAnalytics = () => {
      // Simulate realistic visitor data
      const baseViews = 1247; // Starting total
      const todayViews = Math.floor(Math.random() * 25) + 8; // 8-32 today
      
      // Generate last 7 days data (more realistic pattern)
      const lastSevenDays = [];
      for (let i = 6; i >= 0; i--) {
        const dayMultiplier = i === 0 ? 1 : 0.3 + Math.random() * 0.7;
        const views = Math.floor((15 + Math.random() * 20) * dayMultiplier);
        lastSevenDays.push(views);
      }
      lastSevenDays[6] = todayViews; // Today's views
      
      setAnalytics({
        totalViews: baseViews + todayViews + Math.floor(Math.random() * 50),
        todayViews,
        lastSevenDays
      });
    };

    initializeAnalytics();

    // Increment view count once per session
    const viewRecorded = sessionStorage.getItem('global_view_recorded');
    if (!viewRecorded) {
      setAnalytics(prev => ({
        ...prev,
        totalViews: prev.totalViews + 1,
        todayViews: prev.todayViews + 1,
        lastSevenDays: prev.lastSevenDays.map((views, index) => 
          index === 6 ? views + 1 : views
        )
      }));
      sessionStorage.setItem('global_view_recorded', 'true');
    }
  }, []);

  const maxViews = Math.max(...analytics.lastSevenDays, 1);

  return (
    <div style={{
      borderTop: '1px solid #e5e7eb',
      padding: '15px 0',
      color: '#6b7280',
      fontSize: '0.75rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '20px',
      flexWrap: 'wrap'
    }}>
      {/* View counters */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <span>{analytics.totalViews.toLocaleString()} views</span>
        <span>{analytics.todayViews} today</span>
      </div>
      
      {/* Mini bar chart */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'end', 
        gap: '2px',
        height: '16px'
      }}>
        {analytics.lastSevenDays.map((views, index) => {
          const barHeight = Math.max((views / maxViews) * 12, 1);
          const isToday = index === 6;
          
          return (
            <div 
              key={index}
              style={{
                width: '3px',
                height: `${barHeight}px`,
                backgroundColor: isToday ? '#3b82f6' : '#d1d5db',
                borderRadius: '1px'
              }}
              title={`${views} views`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Analytics;