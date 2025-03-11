// Updated NotificationCenter.jsx with better formatting
import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, X, Info } from 'lucide-react';

const NotificationCenter = ({ notifications = [], onDismiss, onViewAll }) => {
  const [activeNotifications, setActiveNotifications] = useState(notifications);
  
  useEffect(() => {
    setActiveNotifications(notifications);
  }, [notifications]);
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle color="#10b981" size={18} />;
      case 'warning':
        return <AlertTriangle color="#f59e0b" size={18} />;
      case 'error':
        return <AlertTriangle color="#ef4444" size={18} />;
      default:
        return <Info color="#3b82f6" size={18} />;
    }
  };
  
  return (
    <div style={{
      padding: '0 8px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <Bell size={18} />
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            margin: 0,
          }}>
            Notifications
          </h3>
          {activeNotifications.length > 0 && (
            <span style={{
              backgroundColor: 'rgba(51, 65, 85, 0.8)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '600',
              padding: '2px 8px',
              borderRadius: '9999px',
              marginLeft: '4px',
            }}>
              {activeNotifications.length}
            </span>
          )}
        </div>
        
        {activeNotifications.length > 0 && onViewAll && (
          <button 
            style={{
              background: 'none',
              border: 'none',
              color: '#3b82f6',
              fontSize: '14px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
            }}
            onClick={onViewAll}
          >
            View All
          </button>
        )}
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {activeNotifications.length === 0 ? (
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            padding: '20px 0',
            margin: 0,
          }}>
            No new notifications
          </p>
        ) : (
          activeNotifications.map(notification => (
            <div 
              key={notification.id} 
              style={{
                position: 'relative',
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                borderRadius: '8px',
                padding: '12px 12px 12px 16px',
                border: '1px solid rgba(51, 65, 85, 0.5)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
              }}
            >
              <button
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.6)',
                  padding: '4px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onClick={() => onDismiss(notification.id)}
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
              
              <div style={{
                display: 'flex',
                gap: '12px',
                paddingRight: '20px',
              }}>
                <div style={{
                  flexShrink: 0,
                  marginTop: '2px',
                }}>
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div style={{
                  flex: 1,
                }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    margin: '0 0 6px 0',
                  }}>
                    {notification.title}
                  </p>
                  
                  <p style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: '0 0 8px 0',
                  }}>
                    {notification.message}
                  </p>
                  
                  {notification.vessel && (
                    <div style={{
                      backgroundColor: 'rgba(15, 23, 42, 0.7)',
                      padding: '8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      marginTop: '8px',
                      marginBottom: '8px',
                    }}>
                      <p style={{
                        margin: '0 0 4px 0',
                      }}>
                        Vessel: {notification.vessel.name} (IMO: {notification.vessel.imo})
                      </p>
                      {notification.vessel.eta && (
                        <p style={{
                          margin: '0',
                        }}>
                          ETA: {new Date(notification.vessel.eta).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginTop: '8px',
                  }}>
                    {new Date(notification.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;