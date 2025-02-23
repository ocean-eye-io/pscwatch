// src/services/vesselService.js
import { query } from '../utils/db';

export const getVesselData = async () => {
    try {
        const result = await query(`
            SELECT DISTINCT ON (imo_no)
                imo_no,
                vessel_name as name,
                owner,
                event_type as "eventType",
                toport as "arrivingPort",
                fromport as "fromPort",
                tocountry as "arrivalCountry",
                fromcountry as "departureCountry",
                eta,
                etb,
                etd,
                atd as "departureDate",
                report_date as "lastReportDate"
            FROM vessel_tracking
            ORDER BY imo_no, report_date DESC
        `);
        
        return result.rows.map(vessel => ({
            ...vessel,
            id: vessel.imo_no,
            vesselType: 'Bulk Carrier', // Default value since not in tracking table
            checklistStatus: 'pending',
            notificationStatus: 'pending',
            riskScore: calculateRiskScore(vessel),
            openDefects: 0,
            daysToGo: calculateDaysToGo(vessel.eta)
        }));
    } catch (error) {
        console.error('Error fetching vessel data:', error);
        throw error;
    }
};

const calculateRiskScore = (vessel) => {
    // Implement your risk score logic
    return Math.floor(Math.random() * 100);
};

const calculateDaysToGo = (eta) => {
    if (!eta) return null;
    const days = (new Date(eta) - new Date()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.round(days * 10) / 10);
};