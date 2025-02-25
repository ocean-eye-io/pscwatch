// src/config/fieldMappings.js

/**
 * Field mappings for vessel data
 * Maps database fields to UI display properties
 */
export const VESSEL_FIELDS = {
    // Table view columns
    TABLE: {
      expandToggle: {
        isAction: true,
        label: '',
        priority: 0,
        fixedLeft: true,
        width: '40px'
      },
      vessel_name: {
        dbField: 'vessel_name',
        label: 'Vessel',
        priority: 1,
        minWidth: '120px'
      },
      imo_no: {
        dbField: 'imo_no',
        label: 'IMO No',
        priority: 2,
        minWidth: '100px'
      },
      arrival_port: {
        dbField: 'arrival_port',
        label: 'Arriving Port',
        priority: 3,
        minWidth: '120px'
      },
      eta: {
        dbField: 'eta',
        label: 'ETA',
        priority: 4,
        minWidth: '150px'
      },
      etb: {
        dbField: 'etb',
        label: 'ETB',
        priority: 5,
        minWidth: '150px'
      },
      etd: {
        dbField: 'etd',
        label: 'ETD',
        priority: 6,
        minWidth: '150px'
      },
      event_type: {
        dbField: 'event_type',
        label: 'Status',
        priority: 7,
        minWidth: '120px'
      },
      distance_to_go: {
        dbField: 'distance_to_go',
        label: 'Distance to Go',
        priority: 8,
        minWidth: '120px'
      },
      // Calculated fields
      daysToGo: {
        dbField: 'daysToGo', // This will be a calculated field, not in DB
        label: 'Days to Go',
        priority: 9,
        minWidth: '100px'
      },
      riskScore: {
        dbField: 'riskScore', // This will be a calculated field, not in DB
        label: 'Risk Score',
        priority: 10,
        minWidth: '100px'
      },
      actions: {
        isAction: true,
        label: 'Actions',
        priority: 99,
        fixedRight: true,
        width: '120px'
      }
    },
    
    // Expanded row details
    EXPANDED: {
      owner: {
        dbField: 'owner',
        label: 'Owner',
        priority: 1
      },
      fromport: {
        dbField: 'fromport',
        label: 'From Port',
        priority: 2
      },
      fromcountry: {
        dbField: 'fromcountry',
        label: 'From Country',
        priority: 3
      },
      arrival_country: {
        dbField: 'arrival_country',
        label: 'Arrival Country',
        priority: 4
      },
      report_date: {
        dbField: 'report_date',
        label: 'Last Report Date',
        priority: 5
      },
      atd: {
        dbField: 'atd', 
        label: 'Actual Departure',
        priority: 6
      },
      departure_port: {
        dbField: 'departure_port',
        label: 'Departure Port', 
        priority: 7
      },
      departure_country: {
        dbField: 'departure_country',
        label: 'Departure Country',
        priority: 8
      },
      departure_date: {
        dbField: 'departure_date',
        label: 'Departure Date',
        priority: 9
      },
      position: {
        // Composite field from LAT and LON
        dbField: 'position',
        label: 'Position (Lat/Lon)',
        priority: 10
      },
      speed: {
        dbField: 'SPEED',
        label: 'Speed',
        priority: 11
      },
      heading: {
        dbField: 'HEADING',
        label: 'Heading',
        priority: 12
      },
      course: {
        dbField: 'COURSE',
        label: 'Course',
        priority: 13
      },
      source: {
        dbField: 'source',
        label: 'Data Source',
        priority: 14
      },
      dwh_load_date: {
        dbField: 'dwh_load_date',
        label: 'Last Updated',
        priority: 15
      }
    }
  };
  
  // Additional field mappings for filtering options
  export const FILTER_FIELDS = {
    arrival_port: {
      dbField: 'arrival_port',
      label: 'Port',
      type: 'select'
    },
    event_type: {
      dbField: 'event_type',
      label: 'Status',
      type: 'select'
    },
    arrival_country: {
      dbField: 'arrival_country',
      label: 'Country',
      type: 'select'
    }
  };
  
  // Field mappings for the instructions panel
  export const INSTRUCTIONS_FIELDS = {
    vessel_name: {
      dbField: 'vessel_name',
      label: 'Vessel',
      readonly: true
    },
    imo_no: {
      dbField: 'imo_no',
      label: 'IMO No',
      readonly: true
    },
    arrival_port: {
      dbField: 'arrival_port',
      label: 'Arriving Port',
      readonly: true
    },
    eta: {
      dbField: 'eta',
      label: 'ETA',
      readonly: true
    },
    instructions: {
      dbField: 'instructions',
      label: 'Instructions',
      type: 'textarea',
      rows: 5,
      placeholder: 'Add instructions for the vessel...'
    }
  };
  
  // Mapping for data transformation
  export const DB_TO_UI_MAPPING = {
    // These map DB field names to UI field names where they differ
    vessel_name: 'name',
    arrival_port: 'arrivingPort',
    arrival_country: 'arrivalCountry',
    fromport: 'fromPort',
    fromcountry: 'fromCountry',
    departure_port: 'departurePort',
    departure_country: 'departureCountry',
    departure_date: 'departureDate',
    report_date: 'lastReportDate',
    imo_no: 'imoNo',
    distance_to_go: 'distanceToGo',
    dwh_load_date: 'lastUpdated'
  };
  
  // Utility functions for data transformation
  export const transformDatabaseToUI = (dbRecord) => {
    const uiRecord = { ...dbRecord };
    
    // Create calculated fields
    if (dbRecord.eta) {
      const etaDate = new Date(dbRecord.eta);
      const now = new Date();
      const diffTime = etaDate - now;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      uiRecord.daysToGo = Math.max(0, parseFloat(diffDays.toFixed(1)));
    }
    
    // Create a position field from LAT and LON
    if (dbRecord.LAT !== undefined && dbRecord.LON !== undefined) {
      uiRecord.position = `${dbRecord.LAT.toFixed(4)}, ${dbRecord.LON.toFixed(4)}`;
    }
    
    // Risk score is a placeholder that would be calculated based on business logic
    uiRecord.riskScore = Math.floor(Math.random() * 100); // Example placeholder
    
    // Format dates for display
    const dateFields = ['eta', 'etb', 'etd', 'atd', 'report_date', 'departure_date', 'dwh_load_date'];
    dateFields.forEach(field => {
      if (dbRecord[field]) {
        try {
          uiRecord[field] = new Date(dbRecord[field]).toLocaleString();
        } catch (e) {
          // Keep original if date parsing fails
        }
      }
    });
    
    return uiRecord;
  };