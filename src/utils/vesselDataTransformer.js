// src/utils/vesselDataTransformer.js
import { transformDatabaseToUI } from '../config/fieldMappings';

/**
 * Transforms database vessel records to UI-ready format
 * @param {Array} data - Raw database records
 * @returns {Array} Transformed data ready for UI display
 */
export const transformVesselData = (data) => {
  if (!Array.isArray(data)) return [];
  
  return data.map(vessel => transformDatabaseToUI(vessel));
};

/**
 * Get unique values from a specific field across all vessel records
 * Used for populating filter options
 */
export const getUniqueFieldValues = (vessels, fieldName) => {
  if (!Array.isArray(vessels)) return [];
  
  return [...new Set(vessels
    .map(vessel => vessel[fieldName])
    .filter(Boolean)
  )].sort();
};

/**
 * Calculate chart data from vessel records
 */
export const calculateChartData = (vessels) => {
  // Port statistics
  const portCounts = vessels.reduce((acc, vessel) => {
    if (vessel.arrival_port) {
      acc[vessel.arrival_port] = (acc[vessel.arrival_port] || 0) + 1;
    }
    return acc;
  }, {});
  
  const arrivalsByPort = Object.entries(portCounts)
    .map(([port, vessels]) => ({ port, vessels }))
    .sort((a, b) => b.vessels - a.vessels);
  
  // Timeline data
  const threeDaysCount = vessels.filter(v => v.daysToGo <= 3).length;
  const tenDaysCount = vessels.filter(v => v.daysToGo > 3 && v.daysToGo <= 10).length;
  
  const arrivalTimeline = [
    { range: '<3 Days', vessels: threeDaysCount, color: '#E74C3C' },
    { range: '<10 Days', vessels: tenDaysCount, color: '#F1C40F' }
  ];
  
  return {
    arrivalsByPort,
    arrivalTimeline
  };
};