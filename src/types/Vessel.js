// src/types/vessel.js

export const VesselStatus = {
  COMPLETE: 'complete',
  INCOMPLETE: 'incomplete',
  PENDING: 'pending',
};

export const EventType = {
  AT_SEA: 'At Sea',
  AT_BERTH: 'At Berth',
  AT_ANCHOR: 'At Anchor',
};

export const VesselType = {
  BULK_CARRIER: 'Bulk Carrier',
  CONTAINER: 'Container',
  TANKER: 'Tanker',
  LPG_CARRIER: 'LPG Carrier',
};

// Sample vessel structure
export const vesselStructure = {
  id: 'number',
  name: 'string',
  type: 'VesselType',
  port: 'string',
  eta: 'string', // ISO date string
  etb: 'string', // ISO date string
  etd: 'string', // ISO date string
  checklistStatus: 'VesselStatus',
  notificationStatus: 'VesselStatus',
  riskScore: 'number',
  openDefects: 'number',
  lastAMSA: 'string', // ISO date string
  lastPSC: 'string', // ISO date string
  departurePort: 'string',
  departureCountry: 'string',
  eventType: 'EventType',
  owner: 'string',
  instructions: 'string',
};
