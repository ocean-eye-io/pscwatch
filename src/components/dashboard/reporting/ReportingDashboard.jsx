import React, { useState, useEffect, useRef } from 'react';
import { Table, StatusIndicator, TableBadge, ExpandedItem, ActionButton } from '../../common/Table';
import { Calendar, CheckSquare, AlertTriangle, Eye, Info, Star, Ship, X, Plus, Loader2 } from 'lucide-react';
import { Button } from '../../ui/button';

const ReportingDashboard = ({ 
  vessels = [],
  onFormSubmit
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeVessel, setActiveVessel] = useState(null);
  const [activeFormType, setActiveFormType] = useState('notification');
  const [vesselDetailsOpen, setVesselDetailsOpen] = useState(false);
  const [selectedVesselDetails, setSelectedVesselDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const formDialogRef = useRef(null);
  const detailsDialogRef = useRef(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Add click outside handlers for dialogs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFormOpen && formDialogRef.current && !formDialogRef.current.contains(event.target)) {
        setIsFormOpen(false);
      }
      if (vesselDetailsOpen && detailsDialogRef.current && !detailsDialogRef.current.contains(event.target)) {
        setVesselDetailsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFormOpen, vesselDetailsOpen]);

  // Open form dialog
  const handleOpenForm = (vessel, formType) => {
    setActiveVessel(vessel);
    setActiveFormType(formType);
    setIsFormOpen(true);
  };
  
  // Handle form submission
  const handleSubmitForm = (formData) => {
    if (activeVessel && activeFormType) {
      onFormSubmit(activeVessel.imo_no, activeFormType, formData);
      setIsFormOpen(false);
    }
  };
  
  // Handle row click to view vessel details
  const handleRowClick = (vessel) => {
    setSelectedVesselDetails(vessel);
    setVesselDetailsOpen(true);
  };
  
  // Get status color based on vessel status
  const getStatusColor = (status) => {
    if (!status) return '#f4f4f4';
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('at sea') || statusLower.includes('transit')) {
      return '#3498DB'; // Blue for at sea
    } else if (statusLower.includes('port') || statusLower.includes('berth')) {
      return '#2ECC71'; // Green for at port
    } else if (statusLower.includes('anchor')) {
      return '#F1C40F'; // Yellow for at anchor
    } else {
      return '#f4f4f4'; // Default
    }
  };
  
  // Table columns configuration - uses existing Table components
  const columns = [
    {
      field: 'vessel_name',
      label: 'Vessel',
      width: '180px',
      sortable: true
    },
    {
      field: 'imo_no',
      label: 'IMO',
      width: '100px',
      sortable: true
    },
    {
      field: 'eta',
      label: 'ETA',
      width: '120px',
      sortable: true,
      render: (value) => {
        if (!value) return '-';
        const date = new Date(value);
        const today = new Date();
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return (
          <div className="flex flex-col">
            <span>{date.toLocaleDateString()}</span>
            {diffDays > 0 && diffDays < 8 && (
              <span className="month-badge">{diffDays} {diffDays === 1 ? 'day' : 'days'} left</span>
            )}
          </div>
        );
      }
    },
    {
      field: 'event_type',
      label: 'Status',
      width: '130px',
      sortable: true,
      render: (value) => (
        <StatusIndicator 
          status={value || '-'}
          color={getStatusColor(value)}
        />
      )
    },
    {
      field: 'notificationSubmitted',
      label: '5-Day Notification',
      width: '160px',
      sortable: true,
      render: (value, rowData) => (
        <div className="flex items-center justify-between">
          {value ? (
            <TableBadge variant="success" className="transition-all hover:shadow-md">Submitted</TableBadge>
          ) : (
            <TableBadge variant="warning" className="transition-all hover:shadow-md">Pending</TableBadge>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 ml-2 hover:bg-blue-900/30 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenForm(rowData, 'notification');
            }}
            title={value ? "Update notification" : "Create notification"}
          >
            {value ? <Calendar size={16} /> : <Plus size={16} />}
          </Button>
        </div>
      )
    },
    {
      field: 'checklistCompleted',
      label: 'Checklist',
      width: '160px',
      sortable: true,
      render: (value, rowData) => (
        <div className="flex items-center justify-between">
          {value ? (
            <div className="flex items-center gap-2">
              <TableBadge 
                variant={rowData.checklistConcerns ? "danger" : "success"}
                className="transition-all hover:shadow-md"
              >
                {rowData.checklistConcerns ? "Concerns" : "Completed"}
              </TableBadge>
              {rowData.checklistConcerns && (
                <AlertTriangle size={16} className="text-red-500 animate-pulse" />
              )}
            </div>
          ) : (
            <TableBadge variant="warning" className="transition-all hover:shadow-md">Pending</TableBadge>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 ml-2 hover:bg-blue-900/30 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenForm(rowData, 'checklist');
            }}
            title={value ? "Update checklist" : "Create checklist"}
          >
            {value ? <CheckSquare size={16} /> : <Plus size={16} />}
          </Button>
        </div>
      )
    }
  ];
  
  // Actions for the table
  const actions = {
    label: 'Actions',
    width: '80px',
    content: (vessel) => (
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 flex items-center justify-center hover:bg-blue-900/30 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          handleRowClick(vessel);
        }}
        title="View vessel details"
      >
        <Eye size={16} />
      </Button>
    )
  };
  
  // Render expanded content for rows
  const renderExpandedContent = (vessel) => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 animate-fadeIn">
        {vessel.notificationSubmitted && (
          <ExpandedItem 
            label={
              <div className="flex items-center gap-1">
                <Calendar size={14} className="text-blue-400" />
                <span>5-Day Notification</span>
              </div>
            }
            value={`Submitted on ${new Date(vessel.notificationDate).toLocaleString()}`}
            className="hover:border-blue-600/50 transition-colors"
          >
            {vessel.notificationData && (
              <div className="mt-2 text-sm space-y-1">
                <p><span className="text-blue-400">ETA Confirmed:</span> {vessel.notificationData.etaConfirmed ? 'Yes' : 'No'}</p>
                <p><span className="text-blue-400">Cargo Ready:</span> {vessel.notificationData.cargoReady ? 'Yes' : 'No'}</p>
                <p><span className="text-blue-400">Comments:</span> {vessel.notificationData.comments || 'None'}</p>
              </div>
            )}
          </ExpandedItem>
        )}
        
        {vessel.checklistCompleted && (
          <ExpandedItem 
            label={
              <div className="flex items-center gap-1">
                <CheckSquare size={14} className="text-blue-400" />
                <span>Checklist</span>
              </div>
            }
            value={`Completed on ${new Date(vessel.checklistDate).toLocaleString()}`}
            className={vessel.checklistConcerns ? "hover:border-red-600/50" : "hover:border-blue-600/50"}
          >
            {vessel.checklistData && (
              <div className="mt-2 text-sm space-y-1">
                <p>
                  <span className="text-blue-400">Documentation:</span> 
                  <span className={vessel.checklistData.documentation ? "text-green-400 ml-1" : "text-red-400 ml-1"}>
                    {vessel.checklistData.documentation ? 'Complete' : 'Incomplete'}
                  </span>
                </p>
                <p>
                  <span className="text-blue-400">Safety:</span>
                  <span className={vessel.checklistData.safety ? "text-green-400 ml-1" : "text-red-400 ml-1"}>
                    {vessel.checklistData.safety ? 'Verified' : 'Not Verified'}
                  </span>
                </p>
                <p>
                  <span className="text-blue-400">Cargo:</span>
                  <span className={vessel.checklistData.cargo ? "text-green-400 ml-1" : "text-red-400 ml-1"}>
                    {vessel.checklistData.cargo ? 'Requirements Met' : 'Requirements Not Met'}
                  </span>
                </p>
                <p>
                  <span className="text-blue-400">Crew:</span>
                  <span className={vessel.checklistData.crew ? "text-green-400 ml-1" : "text-red-400 ml-1"}>
                    {vessel.checklistData.crew ? 'Verified' : 'Not Verified'}
                  </span>
                </p>
                {vessel.checklistConcerns && (
                  <p className="text-red-500 mt-2 flex items-start gap-1 bg-red-900/20 p-2 rounded-md border border-red-900/50">
                    <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{vessel.checklistConcerns}</span>
                  </p>
                )}
              </div>
            )}
          </ExpandedItem>
        )}
      </div>
    );
  };
  
  // Import form components
  const NotificationForm = React.lazy(() => import('../reporting/forms/NotificationForm'));
  const ChecklistForm = React.lazy(() => import('../reporting/forms/ChecklistForm'));
  
  // Vessel details component
  const VesselDetailsView = () => {
    if (!selectedVesselDetails) return null;
    
    return (
      <div className="space-y-4">
        {/* Vessel header with status */}
        <div className="bg-gray-900/40 p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors shadow-md">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="bg-blue-900/50 p-3 rounded-full shadow-inner">
                <Ship size={24} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedVesselDetails.vessel_name}</h3>
                <p className="text-sm text-gray-400">IMO: {selectedVesselDetails.imo_no}</p>
              </div>
            </div>
            <StatusIndicator 
              status={selectedVesselDetails.event_type || '-'}
              color={getStatusColor(selectedVesselDetails.event_type)}
              className="inline-flex justify-end shadow-sm"
            />
          </div>
        </div>
        
        {/* Use ExpandedItem for details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ExpandedItem
            label={
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                ETA
              </div>
            }
            value={
              selectedVesselDetails.eta ? 
              new Date(selectedVesselDetails.eta).toLocaleString() : 
              '-'
            }
            className="hover:border-blue-600/30 transition-colors"
          />
          
          <ExpandedItem
            label={
              <div className="flex items-center gap-1">
                <Info size={14} />
                Report Status
              </div>
            }
            value={
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span>5-Day Notification:</span>
                  <TableBadge variant={selectedVesselDetails.notificationSubmitted ? "success" : "warning"}>
                    {selectedVesselDetails.notificationSubmitted ? "Submitted" : "Pending"}
                  </TableBadge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Checklist:</span>
                  <TableBadge variant={!selectedVesselDetails.checklistCompleted ? "warning" : 
                               selectedVesselDetails.checklistConcerns ? "danger" : "success"}>
                    {!selectedVesselDetails.checklistCompleted ? "Pending" : 
                     selectedVesselDetails.checklistConcerns ? "Concerns" : "Completed"}
                  </TableBadge>
                </div>
              </div>
            }
            className="hover:border-blue-600/30 transition-colors"
          />
        </div>
        
        {/* Notification details section */}
        {selectedVesselDetails.notificationSubmitted && (
          <ExpandedItem
            label={
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-blue-400" />
                <span>5-Day Notification Details</span>
              </div>
            }
            value={`Submitted on ${new Date(selectedVesselDetails.notificationDate).toLocaleString()}`}
            className="hover:border-blue-600/30 transition-colors"
          >
            {selectedVesselDetails.notificationData && (
              <div className="mt-3 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 p-3 rounded-md border border-gray-800 shadow-sm hover:shadow-md transition-all">
                    <p className="text-blue-400 text-xs mb-1">ETA Confirmed</p>
                    <p className="font-medium">
                      {selectedVesselDetails.notificationData.etaConfirmed ? 
                        <span className="text-green-400">Yes</span> : 
                        <span className="text-red-400">No</span>
                      }
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-md border border-gray-800 shadow-sm hover:shadow-md transition-all">
                    <p className="text-blue-400 text-xs mb-1">Cargo Ready</p>
                    <p className="font-medium">
                      {selectedVesselDetails.notificationData.cargoReady ? 
                        <span className="text-green-400">Yes</span> : 
                        <span className="text-red-400">No</span>
                      }
                    </p>
                  </div>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-md border border-gray-800 shadow-sm hover:shadow-md transition-all">
                  <p className="text-blue-400 text-xs mb-1">Comments</p>
                  <p className="mt-1 text-sm">
                    {selectedVesselDetails.notificationData.comments || 'No comments provided'}
                  </p>
                </div>
              </div>
            )}
          </ExpandedItem>
        )}
        
        {/* Checklist details section */}
        {selectedVesselDetails.checklistCompleted && (
          <ExpandedItem
            label={
              <div className="flex items-center gap-2">
                <CheckSquare size={16} className="text-blue-400" />
                <span>Checklist Details</span>
              </div>
            }
            value={`Completed on ${new Date(selectedVesselDetails.checklistDate).toLocaleString()}`}
            className={selectedVesselDetails.checklistConcerns ? "hover:border-red-600/30" : "hover:border-blue-600/30"}
          >
            {selectedVesselDetails.checklistData && (
              <div className="mt-3 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 p-3 rounded-md border border-gray-800 shadow-sm hover:shadow-md transition-all">
                    <p className="text-blue-400 text-xs mb-1">Documentation</p>
                    <p className="font-medium">
                      {selectedVesselDetails.checklistData.documentation ? 
                        <span className="text-green-400">Complete</span> : 
                        <span className="text-red-400">Incomplete</span>
                      }
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-md border border-gray-800 shadow-sm hover:shadow-md transition-all">
                    <p className="text-blue-400 text-xs mb-1">Safety</p>
                    <p className="font-medium">
                      {selectedVesselDetails.checklistData.safety ? 
                        <span className="text-green-400">Verified</span> : 
                        <span className="text-red-400">Not Verified</span>
                      }
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-md border border-gray-800 shadow-sm hover:shadow-md transition-all">
                    <p className="text-blue-400 text-xs mb-1">Cargo</p>
                    <p className="font-medium">
                      {selectedVesselDetails.checklistData.cargo ? 
                        <span className="text-green-400">Requirements Met</span> : 
                        <span className="text-red-400">Requirements Not Met</span>
                      }
                    </p>
                  </div>
                  <div className="bg-gray-900/50 p-3 rounded-md border border-gray-800 shadow-sm hover:shadow-md transition-all">
                    <p className="text-blue-400 text-xs mb-1">Crew</p>
                    <p className="font-medium">
                      {selectedVesselDetails.checklistData.crew ? 
                        <span className="text-green-400">Verified</span> : 
                        <span className="text-red-400">Not Verified</span>
                      }
                    </p>
                  </div>
                </div>
                
                {selectedVesselDetails.checklistConcerns && (
                  <div className="bg-red-900/20 p-3 rounded-md border border-red-900/50 shadow-sm animate-pulse">
                    <p className="text-red-400 text-xs font-medium mb-1 flex items-center gap-1">
                      <AlertTriangle size={14} />
                      Concerns
                    </p>
                    <p className="mt-1 text-sm text-red-100">
                      {selectedVesselDetails.checklistConcerns}
                    </p>
                  </div>
                )}
              </div>
            )}
          </ExpandedItem>
        )}
        
        <div className="flex justify-between w-full mt-6">
          <div className="flex flex-wrap gap-2">
            {!selectedVesselDetails.notificationSubmitted && (
              <Button
                variant="outline"
                onClick={() => {
                  setVesselDetailsOpen(false);
                  handleOpenForm(selectedVesselDetails, 'notification');
                }}
                className="flex items-center gap-2 hover:bg-blue-900/30 hover:border-blue-500 transition-all"
              >
                <Calendar size={16} />
                Create Notification
              </Button>
            )}
            
            {!selectedVesselDetails.checklistCompleted && (
              <Button
                variant="outline"
                onClick={() => {
                  setVesselDetailsOpen(false);
                  handleOpenForm(selectedVesselDetails, 'checklist');
                }}
                className="flex items-center gap-2 hover:bg-blue-900/30 hover:border-blue-500 transition-all"
              >
                <CheckSquare size={16} />
                Create Checklist
              </Button>
            )}
          </div>
          <Button 
            variant="ghost" 
            onClick={() => setVesselDetailsOpen(false)}
            className="hover:bg-gray-800 transition-colors"
          >
            Close
          </Button>
        </div>
      </div>
    );
  };
  
  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-12 animate-fadeIn">
      <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-800 rounded-full mb-4 shadow-inner">
        <Info size={28} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">No vessels found</h3>
      <p className="text-gray-400 max-w-md mx-auto">
        There are no vessels matching the current filter criteria. Try changing your filters or add a new vessel.
      </p>
    </div>
  );
  
  // Loading state component
  const LoadingState = () => (
    <div className="text-center py-16 animate-pulse">
      <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-800 rounded-full mb-4">
        <Loader2 size={28} className="text-blue-400 animate-spin" />
      </div>
      <h3 className="text-lg font-medium mb-2">Loading vessels...</h3>
      <p className="text-gray-400 max-w-md mx-auto">
        Please wait while we fetch the vessel data.
      </p>
    </div>
  );
  
  return (
    <div className="w-full">
      {isLoading ? (
        <LoadingState />
      ) : vessels.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="w-full">
          <Table
            data={vessels}
            columns={columns}
            expandedContent={renderExpandedContent}
            actions={actions}
            uniqueIdField="imo_no"
            defaultSortKey="eta"
            onRowClick={handleRowClick}
            className="vessel-table"
          />
        </div>
      )}
      
      {/* Form Dialog */}
      {isFormOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setIsFormOpen(false)}
        >
          <div 
            ref={formDialogRef}
            className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-200 animate-zoomIn"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                {activeFormType === 'notification' ? (
                  <>
                    <Calendar size={18} className="text-blue-400" />
                    5-Day Notification
                  </>
                ) : (
                  <>
                    <CheckSquare size={18} className="text-blue-400" />
                    Checklist
                  </>
                )}
                {activeVessel && (
                  <span className="text-sm text-gray-400 ml-1">
                    - {activeVessel.vessel_name}
                  </span>
                )}
              </h2>
              <button
                className="text-gray-400 hover:text-white focus:outline-none hover:bg-gray-800 p-1 rounded-full transition-colors"
                onClick={() => setIsFormOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              {activeVessel && (
                <React.Suspense fallback={
                  <div className="p-4 animate-pulse space-y-4">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-10 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                    <div className="h-20 bg-gray-700 rounded"></div>
                    <div className="flex justify-end gap-2">
                      <div className="h-9 bg-gray-700 rounded w-20"></div>
                      <div className="h-9 bg-blue-700 rounded w-20"></div>
                    </div>
                  </div>
                }>
                  {activeFormType === 'notification' ? (
                    <NotificationForm 
                      vessel={activeVessel}
                      onSubmit={handleSubmitForm}
                      onCancel={() => setIsFormOpen(false)}
                    />
                  ) : (
                    <ChecklistForm 
                      vessel={activeVessel}
                      onSubmit={handleSubmitForm}
                      onCancel={() => setIsFormOpen(false)}
                    />
                  )}
                </React.Suspense>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Vessel Details Dialog */}
      {vesselDetailsOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setVesselDetailsOpen(false)}
        >
          <div 
            ref={detailsDialogRef}
            className="bg-gray-900 border border-gray-700 rounded-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-200 animate-zoomIn"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Ship size={18} className="text-blue-400" />
                Vessel Details
                {selectedVesselDetails && (
                  <span className="text-sm text-gray-400 ml-1">
                    - {selectedVesselDetails.vessel_name}
                  </span>
                )}
              </h2>
              <button
                className="text-gray-400 hover:text-white focus:outline-none hover:bg-gray-800 p-1 rounded-full transition-colors"
                onClick={() => setVesselDetailsOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <VesselDetailsView />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add these animations to your CSS
// @keyframes fadeIn {
//   from { opacity: 0; }
//   to { opacity: 1; }
// }

// @keyframes zoomIn {
//   from { opacity: 0; transform: scale(0.95); }
//   to { opacity: 1; transform: scale(1); }
// }

// .animate-fadeIn {
//   animation: fadeIn 0.3s ease-out forwards;
// }

// .animate-zoomIn {
//   animation: zoomIn 0.2s ease-out forwards;
// }

export default ReportingDashboard;