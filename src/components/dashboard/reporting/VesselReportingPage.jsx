import React, { useState, useMemo } from 'react';
import ReportingDashboard from './ReportingDashboard';
import { Button } from '../../ui/button';
import { 
  Plus, 
  FileCheck, 
  AlertTriangle, 
  Bell, 
  CheckCircle, 
  Ship, 
  X, 
  Calendar, 
  Info 
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { sampleVessels } from './data';
import StatCard from './components/StatCard';
import AlertManager from './components/AlertManager';
import '../DashboardStyles.css';

const VesselReportingPage = () => {
  // States
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'info',
      title: '5-Day Notification Due',
      message: 'The vessel Pacific Explorer is due for 5-day notification.',
      timestamp: new Date().toISOString(),
      vessel: {
        name: 'Pacific Explorer',
        imo: '9876543',
        eta: '2025-03-15T10:30:00'
      }
    },
    {
      id: '2',
      type: 'warning',
      title: 'Checklist Concerns',
      message: 'Concerns flagged in the checklist for Nordic Star.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      vessel: {
        name: 'Nordic Star',
        imo: '9876545',
        eta: '2025-03-20T15:45:00'
      }
    }
  ]);
  
  const [alerts, setAlerts] = useState([
    {
      id: 'alert1',
      type: 'warning',
      title: 'Urgent: Missing Documentation',
      message: 'Nordic Star is missing required cargo documentation. Please address this issue before arrival.',
      actions: [
        { id: 'view', label: 'View Details', primary: true },
        { id: 'dismiss', label: 'Dismiss', primary: false }
      ]
    }
  ]);
  const [activeTab, setActiveTab] = useState('all');
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [newFormDialogOpen, setNewFormDialogOpen] = useState(false);
  const [formTypeToCreate, setFormTypeToCreate] = useState('notification');
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [vessels, setVessels] = useState(sampleVessels);

  // Handler functions
  const handleCloseNotificationDrawer = () => setNotificationDrawerOpen(false);
  const handleCloseFormDialog = () => setNewFormDialogOpen(false);
  
  const handleFormSubmitted = (vesselId, formType, formData) => {
    // Update vessels with form data
    const updatedVessels = vessels.map(vessel => {
      if (vessel.imo_no === vesselId) {
        if (formType === 'notification') {
          return { 
            ...vessel, 
            notificationSubmitted: true, 
            notificationDate: new Date().toISOString(), 
            notificationData: formData 
          };
        } else if (formType === 'checklist') {
          return { 
            ...vessel, 
            checklistCompleted: true, 
            checklistDate: new Date().toISOString(), 
            checklistData: formData, 
            checklistConcerns: formData.hasConcerns ? formData.concerns : null 
          };
        }
      }
      return vessel;
    });
    
    setVessels(updatedVessels);
    setNewFormDialogOpen(false);
    
    // Show a temporary success notification
    const newNotification = {
      id: `success-${Date.now()}`,
      type: 'success',
      title: `${formType === 'notification' ? '5-Day Notification' : 'Checklist'} Submitted`,
      message: `Successfully submitted for vessel ${vessels.find(v => v.imo_no === vesselId)?.vessel_name}`,
      timestamp: new Date().toISOString()
    };
    
    setNotifications([newNotification, ...notifications]);
    
    // Remove success notification after 5 seconds
    setTimeout(() => {
      setNotifications(currentNotifications => 
        currentNotifications.filter(n => n.id !== newNotification.id)
      );
    }, 5000);
  };

  const handleDismissAlert = (alertId) => setAlerts(alerts.filter(a => a.id !== alertId));
  
  const handleDismissNotification = (notificationId) => setNotifications(notifications.filter(n => n.id !== notificationId));
  
  const handleCreateNewForm = (type) => {
    setFormTypeToCreate(type);
    setSelectedVessel(null);
    setNewFormDialogOpen(true);
  };

  const handleAlertAction = (alertId, actionId) => {
    if (actionId === 'dismiss') {
      handleDismissAlert(alertId);
    } else if (actionId === 'view') {
      // Handle view details action
      // For example, find the vessel related to this alert and open details
      handleDismissAlert(alertId);
    }
  };

  // Form content renderer
  const renderFormContent = () => {
    const vessel = selectedVessel || vessels[0];
    const NotificationForm = React.lazy(() => import('./forms/NotificationForm'));
    const ChecklistForm = React.lazy(() => import('./forms/ChecklistForm'));
    
    return (
      <React.Suspense fallback={<FormLoadingSkeleton />}>
        {formTypeToCreate === 'notification' ? (
          <NotificationForm 
            vessel={vessel} 
            onSubmit={(formData) => handleFormSubmitted(vessel.imo_no, 'notification', formData)} 
            onCancel={handleCloseFormDialog}
          />
        ) : (
          <ChecklistForm 
            vessel={vessel} 
            onSubmit={(formData) => handleFormSubmitted(vessel.imo_no, 'checklist', formData)}
            onCancel={handleCloseFormDialog}
          />
        )}
      </React.Suspense>
    );
  };
  
  // Filtered vessels based on active tab
  const filteredVessels = useMemo(() => {
    switch (activeTab) {
      case 'pending':
        return vessels.filter(v => !v.notificationSubmitted || !v.checklistCompleted);
      case 'completed':
        return vessels.filter(v => v.notificationSubmitted && v.checklistCompleted);
      case 'concerns':
        return vessels.filter(v => v.checklistConcerns);
      default:
        return vessels;
    }
  }, [vessels, activeTab]);
  
  // Stats data
  const pendingCount = vessels.filter(v => !v.notificationSubmitted || !v.checklistCompleted).length;
  const completedCount = vessels.filter(v => v.notificationSubmitted && v.checklistCompleted).length;
  const concernsCount = vessels.filter(v => v.checklistConcerns).length;
  
  // Tab styling
  const getTabStyle = (tabName) => {
    return activeTab === tabName 
      ? { backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#fff' }
      : { backgroundColor: 'transparent', color: 'rgba(255, 255, 255, 0.6)' };
  };
  
  return (
    <div className="vessel-reporting-container">
      {/* Stats Cards */}
      <div className="stats-container">
        <StatCard 
          title="Pending Reports" 
          value={pendingCount}
          icon={<Bell size={20} color="#fbbf24" />} 
        />
        <StatCard 
          title="Completed" 
          value={completedCount}
          icon={<CheckCircle size={20} color="#34d399" />} 
        />
        <StatCard 
          title="With Concerns" 
          value={concernsCount}
          icon={<AlertTriangle size={20} color="#f87171" />} 
        />
      </div>
      
      {/* Vessel Reports header */}
      <div className="reports-header">
        <div className="reports-title">
          <h2>Vessel Reports</h2>
          <span className="vessel-count">
            {filteredVessels.length} {filteredVessels.length === 1 ? 'vessel' : 'vessels'} shown
          </span>
        </div>
        
        <div className="action-buttons">
          <Button 
            variant="outline" 
            onClick={() => setNotificationDrawerOpen(true)}
            className="notification-button"
          >
            <Bell size={16} />
            <span>Notifications</span>
            {notifications.length > 0 && (
              <span className="notification-badge">
                {notifications.length}
              </span>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => handleCreateNewForm('notification')}
            className="action-button"
          >
            <Calendar size={16} />
            <span>5-Day Notification</span>
          </Button>
          
          <Button 
            onClick={() => handleCreateNewForm('checklist')}
            className="action-button primary"
          >
            <FileCheck size={16} />
            <span>Checklist</span>
          </Button>
        </div>
      </div>
      
      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="alerts-section">
          <AlertManager 
            alerts={alerts} 
            onDismiss={handleDismissAlert}
            onAction={handleAlertAction}
          />
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className="tab-button" 
          style={getTabStyle('all')}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button 
          className="tab-button" 
          style={getTabStyle('pending')}
          onClick={() => setActiveTab('pending')}
        >
          Pending
        </button>
        <button 
          className="tab-button" 
          style={getTabStyle('completed')}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
        <button 
          className="tab-button" 
          style={getTabStyle('concerns')}
          onClick={() => setActiveTab('concerns')}
        >
          Concerns
        </button>
      </div>
      
      {/* Table Container */}
      <div className="table-container">
        <ReportingDashboard 
          vessels={filteredVessels}
          onFormSubmit={handleFormSubmitted}
        />
      </div>
      
      {/* Dialogs - Form and Notifications */}
      <Dialog open={notificationDrawerOpen} onOpenChange={setNotificationDrawerOpen}>
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle className="dialog-title">
              <Bell size={16} className="dialog-icon" />
              Notifications
            </DialogTitle>
          </DialogHeader>
          <NotificationList notifications={notifications} onDismiss={handleDismissNotification} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={newFormDialogOpen} onOpenChange={setNewFormDialogOpen}>
        <DialogContent className="dialog-content">
          <DialogHeader>
            <DialogTitle className="dialog-title">
              {formTypeToCreate === 'notification' ? (
                <>
                  <Calendar size={16} className="dialog-icon" />
                  5-Day Notification
                </>
              ) : (
                <>
                  <FileCheck size={16} className="dialog-icon" />
                  Checklist
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <VesselSelector 
            vessels={vessels} 
            selectedVessel={selectedVessel} 
            onSelect={setSelectedVessel} 
          />
          
          {selectedVessel && renderFormContent()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Enhanced Notification List Component
const NotificationList = ({ notifications, onDismiss }) => (
  <div className="notification-list">
    {notifications.length === 0 ? (
      <div className="empty-notifications">
        <Bell size={24} className="empty-icon" />
        <p>No new notifications</p>
      </div>
    ) : (
      notifications.map(notification => (
        <NotificationCard key={notification.id} notification={notification} onDismiss={onDismiss} />
      ))
    )}
  </div>
);

// Enhanced Notification Card Component
const NotificationCard = ({ notification, onDismiss }) => (
  <div className="notification-card">
    <button
      className="dismiss-button"
      onClick={() => onDismiss(notification.id)}
      aria-label="Dismiss notification"
    >
      <X size={14} />
    </button>
    
    <div className="notification-content">
      <div className="notification-icon">
        {notification.type === 'success' ? <CheckCircle color="#10b981" size={18} /> :
         notification.type === 'warning' ? <AlertTriangle color="#f59e0b" size={18} /> :
         notification.type === 'error' ? <AlertTriangle color="#ef4444" size={18} /> :
         <Info color="#3b82f6" size={18} />}
      </div>
      
      <div className="notification-details">
        <p className="notification-title">
          {notification.title}
        </p>
        <p className="notification-message">
          {notification.message}
        </p>
        
        {notification.vessel && (
          <div className="vessel-info">
            <p>
              <span className="label">Vessel:</span> {notification.vessel.name} <span className="imo">(IMO: {notification.vessel.imo})</span>
            </p>
            {notification.vessel.eta && (
              <p>
                <span className="label">ETA:</span> {new Date(notification.vessel.eta).toLocaleString()}
              </p>
            )}
          </div>
        )}
        
        <div className="notification-time">
          <span className="time-dot"></span>
          {new Date(notification.timestamp).toLocaleString()}
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Vessel Selector Component
const VesselSelector = ({ vessels, selectedVessel, onSelect }) => (
  <div className="vessel-selector">
    <label className="selector-label">
      <Ship size={14} className="label-icon" />
      Select Vessel
    </label>
    <select 
      className="vessel-select"
      value={selectedVessel?.imo_no || ''}
      onChange={(e) => {
        const selectedImo = e.target.value;
        onSelect(vessels.find(v => v.imo_no === selectedImo) || null);
      }}
    >
      <option value="">Select a vessel...</option>
      {vessels.map(vessel => (
        <option key={vessel.imo_no} value={vessel.imo_no}>
          {vessel.vessel_name} (IMO: {vessel.imo_no})
        </option>
      ))}
    </select>
  </div>
);

// Form Loading Skeleton Component
const FormLoadingSkeleton = () => (
  <div className="form-skeleton">
    <div className="skeleton-item w-75"></div>
    <div className="skeleton-item w-100"></div>
    <div className="skeleton-item w-50"></div>
    <div className="skeleton-item w-100"></div>
    <div className="skeleton-item w-75"></div>
    <div className="skeleton-item h-100"></div>
    <div className="skeleton-actions">
      <div className="skeleton-button"></div>
      <div className="skeleton-button primary"></div>
    </div>
  </div>
);

export default VesselReportingPage;