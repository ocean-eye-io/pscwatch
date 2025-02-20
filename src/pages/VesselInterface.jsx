// src/pages/VesselInterface.jsx
import React, { useState } from 'react';
import { 
  BarChart2, 
  AlertCircle, 
  FileCheck, 
  ClipboardList,
  Clock 
} from 'lucide-react';
import VesselTable from '../components/manager/VesselTable/VesselTable';

const VesselInterface = () => {
  const [mainSection, setMainSection] = useState('psc');
  const [pscTab, setPscTab] = useState('dashboard');

  // Sample vessel data (using the same structure as manager dashboard)
  const vesselData = [{
    id: 1,
    name: 'SDTR ERICA',
    vesselType: 'Bulk Carrier',
    doc: 'SMBL',
    arrivingPort: 'GLADSTONE',
    eta: '19-Feb-25 02:00:00',
    etb: '',
    etd: '',
    lastAMSA: '13-Jan-24',
    lastPSC: '06-Oct-23',
    daysToGo: 0.1,
    arrivalCountry: 'AUSTRALIA',
    fromPort: 'GOVE',
    departureCountry: 'AU',
    lastReportDate: '17-Feb-25 03:57:36',
    eventType: 'At Sea',
    departureDate: '12-Feb-25 04:02:18',
    owner: 'SDTR MARINE PTE LTD',
    imoNo: '9877872',
    checklistStatus: 'complete',
    notificationStatus: 'sent',
    riskScore: 75,
    openDefects: 3,
    instructions: ''
  }];

  const handleOpenInstructions = (vessel) => {
    // Implement instructions handler
    console.log('Opening instructions for vessel:', vessel);
  };

  // Main navigation button component
  const MainNavButton = ({ active, onClick, icon: Icon, label }) => (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: 'transparent',
        border: 'none',
        color: active ? '#3BADE5' : 'rgba(244, 244, 244, 0.6)',
        borderBottom: `2px solid ${active ? '#3BADE5' : 'transparent'}`,
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500'
      }}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  // Sub navigation button component
  const SubNavButton = ({ active, onClick, icon: Icon, label }) => (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: active ? '#3BADE5' : 'transparent',
        border: 'none',
        color: '#f4f4f4',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div style={{ padding: '20px', color: '#f4f4f4' }}>
      {/* Vessel Info */}
      <div style={{ marginBottom: '20px' }}>
        <span style={{ color: 'rgba(244, 244, 244, 0.6)' }}>Vessel:</span>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>SDTR ERICA</h1>
        <div style={{ color: 'rgba(244, 244, 244, 0.6)' }}>
          Bulk Carrier • Next Port: GLADSTONE
        </div>
        <div style={{ 
          background: '#132337', 
          padding: '8px 16px', 
          borderRadius: '4px',
          display: 'inline-block',
          marginTop: '12px'
        }}>
          5 Days to Arrival
        </div>
      </div>

      {/* Main Section Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        borderBottom: '1px solid rgba(244, 244, 244, 0.1)',
        paddingBottom: '8px'
      }}>
        <MainNavButton 
          active={mainSection === 'psc'} 
          onClick={() => setMainSection('psc')}
          icon={BarChart2}
          label="PSC Dashboard"
        />
        <MainNavButton 
          active={mainSection === 'defects'} 
          onClick={() => setMainSection('defects')}
          icon={AlertCircle}
          label="Defects Dashboard"
        />
      </div>

      {mainSection === 'psc' ? (
        <div>
          {/* PSC Dashboard Sub-Navigation */}
          <div style={{ 
            display: 'flex', 
            gap: '8px', 
            marginBottom: '24px',
            background: '#132337',
            padding: '4px',
            borderRadius: '4px',
            width: 'fit-content'
          }}>
            <SubNavButton 
              active={pscTab === 'dashboard'} 
              onClick={() => setPscTab('dashboard')}
              icon={BarChart2}
              label="Dashboard"
            />
            <SubNavButton 
              active={pscTab === 'notice'} 
              onClick={() => setPscTab('notice')}
              icon={FileCheck}
              label="5-Day Notice"
            />
            <SubNavButton 
              active={pscTab === 'checklist'} 
              onClick={() => setPscTab('checklist')}
              icon={ClipboardList}
              label="Checklist"
            />
          </div>

          {/* PSC Dashboard Content */}
          {pscTab === 'dashboard' && (
            <>
              {/* KPIs */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '16px',
                marginBottom: '24px'
              }}>
                <StatCard title="PSC Score" value="85" subtitle="Current Risk Score" />
                <StatCard title="Days Since Last PSC" value="45" subtitle="Last Inspection" />
                <StatCard title="Days to Arrival" value="5" subtitle="Until Port Arrival" />
              </div>

              {/* Vessel Table */}
              <VesselTable
                vessels={vesselData}
                onOpenInstructions={handleOpenInstructions}
                columns={[
                  { key: 'name', label: 'Vessel' },
                  { key: 'vesselType', label: 'Vessel Type' },
                  { key: 'doc', label: 'DOC' },
                  { key: 'arrivingPort', label: 'Arriving Port' },
                  { key: 'eta', label: 'ETA' },
                  { key: 'lastAMSA', label: 'Last AMSA' },
                  { key: 'lastPSC', label: 'Last PSC' },
                  { key: 'checklistStatus', label: 'Checklist Status' },
                  { key: 'notificationStatus', label: 'Notice Status' },
                  { key: 'riskScore', label: 'Risk Score' }
                ]}
              />
            </>
          )}

          {pscTab === 'notice' && (
            <div style={{ 
              background: '#132337',
              padding: '24px',
              borderRadius: '8px',
              border: '1px solid rgba(244, 244, 244, 0.1)'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                5-Day Notice Form
              </h2>
              <p style={{ color: 'rgba(244, 244, 244, 0.6)' }}>
                5-Day Notice form content will be implemented here
              </p>
            </div>
          )}

          {pscTab === 'checklist' && (
            <div style={{ 
              background: '#132337',
              padding: '24px',
              borderRadius: '8px',
              border: '1px solid rgba(244, 244, 244, 0.1)'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
                Pre-arrival Checklist
              </h2>
              <p style={{ color: 'rgba(244, 244, 244, 0.6)' }}>
                Pre-arrival checklist content will be implemented here
              </p>
            </div>
          )}
        </div>
      ) : (
        // Defects Dashboard Placeholder
        <div style={{ 
          background: '#132337',
          padding: '24px',
          borderRadius: '8px',
          border: '1px solid rgba(244, 244, 244, 0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
            Defects Dashboard
          </h2>
          <p style={{ color: 'rgba(244, 244, 244, 0.6)' }}>
            Defects management interface will be implemented here
          </p>
        </div>
      )}
    </div>
  );
};

// StatCard component
const StatCard = ({ title, value, subtitle }) => (
  <div style={{ 
    background: '#132337',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid rgba(244, 244, 244, 0.1)'
  }}>
    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px', color: '#f4f4f4' }}>
      {value}
    </div>
    <div style={{ color: 'rgba(244, 244, 244, 0.6)', marginBottom: '8px' }}>
      {title}
    </div>
    <div style={{ 
      fontSize: '12px', 
      color: 'rgba(244, 244, 244, 0.4)',
      paddingTop: '12px',
      borderTop: '1px solid rgba(244, 244, 244, 0.1)'
    }}>
      {subtitle}
    </div>
  </div>
);

export default VesselInterface;