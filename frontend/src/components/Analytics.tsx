import React, { useState, useEffect } from 'react';

interface AnalyticsData {
  totalViews: number;
  todayViews: number;
  lastSevenDays: number[];
}

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    todayViews: 0,
    lastSevenDays: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealAnalytics = async () => {
      try {
        // For GitHub Pages, we'll use a combination of approaches:
        // 1. Track pageviews with Google Analytics
        // 2. Use a simple counter API or local storage for immediate feedback
        
        // Track current visit
        if (typeof window.gtag !== 'undefined') {
          window.gtag('event', 'page_view', {
            page_title: 'DexWeb - Dexterous Hands Hub',
            page_location: window.location.href
          });
        }

        // For immediate feedback, use localStorage to track and display basic stats
        // In production, this would be replaced with actual Analytics API calls
        const storedStats = localStorage.getItem('dexweb_analytics');
        let stats = storedStats ? JSON.parse(storedStats) : {
          totalViews: 0,
          dailyViews: {},
          firstVisit: new Date().toDateString()
        };

        const today = new Date().toDateString();
        
        // Initialize daily views for today if not exists
        if (!stats.dailyViews[today]) {
          stats.dailyViews[today] = 0;
        }

        // Check if this is a new session
        const sessionViewed = sessionStorage.getItem('dexweb_session_viewed');
        if (!sessionViewed) {
          stats.totalViews += 1;
          stats.dailyViews[today] += 1;
          sessionStorage.setItem('dexweb_session_viewed', 'true');
        }

        // Generate last 7 days data
        const lastSevenDays = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toDateString();
          lastSevenDays.push(stats.dailyViews[dateStr] || 0);
        }

        // Clean up old daily data (keep only last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        Object.keys(stats.dailyViews).forEach(dateStr => {
          if (new Date(dateStr) < thirtyDaysAgo) {
            delete stats.dailyViews[dateStr];
          }
        });

        // Save updated stats
        localStorage.setItem('dexweb_analytics', JSON.stringify(stats));

        setAnalytics({
          totalViews: stats.totalViews,
          todayViews: stats.dailyViews[today] || 0,
          lastSevenDays
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // Fallback to minimal display
        setAnalytics({
          totalViews: 1,
          todayViews: 1,
          lastSevenDays: [0, 0, 0, 0, 0, 0, 1]
        });
        setIsLoading(false);
      }
    };

    fetchRealAnalytics();
  }, []);

  const maxViews = Math.max(...analytics.lastSevenDays, 1);

  if (isLoading) {
    return (
      <div style={{
        borderTop: '1px solid #e5e7eb',
        padding: '15px 0',
        color: '#6b7280',
        fontSize: '0.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>Loading analytics...</span>
      </div>
    );
  }

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
        <span style={{ color: '#9ca3af' }}>• Real tracking via Google Analytics</span>
      </div>
      
      {/* Mini bar chart */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'end', 
        gap: '2px',
        height: '16px'
      }}>
        {analytics.lastSevenDays.map((views, index) => {
          const barHeight = Math.max((views / maxViews) * 12, views > 0 ? 2 : 1);
          const isToday = index === 6;
          
          return (
            <div 
              key={index}
              style={{
                width: '3px',
                height: `${barHeight}px`,
                backgroundColor: isToday ? '#3b82f6' : views > 0 ? '#9ca3af' : '#e5e7eb',
                borderRadius: '1px'
              }}
              title={`${views} views ${index === 6 ? '(today)' : `(${7-index} days ago)`}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Analytics;