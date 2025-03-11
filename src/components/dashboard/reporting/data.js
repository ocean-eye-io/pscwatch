// src/components/dashboard/reporting/data.js
export const sampleVessels = [
    {
      imo_no: "9876543",
      vessel_name: "Pacific Explorer",
      eta: "2025-03-15T10:30:00",
      event_type: "At Sea - Transit",
      notificationSubmitted: false,
      checklistCompleted: false
    },
    {
      imo_no: "9876544",
      vessel_name: "Atlantic Voyager",
      eta: "2025-03-12T08:15:00",
      event_type: "At Port",
      notificationSubmitted: true,
      notificationDate: "2025-03-07T14:22:00",
      notificationData: {
        etaConfirmed: true,
        cargoReady: true,
        comments: "Requesting priority berth"
      },
      checklistCompleted: true,
      checklistDate: "2025-03-08T09:45:00",
      checklistData: {
        documentation: true,
        safety: true,
        cargo: true,
        crew: true,
        hasConcerns: false
      }
    },
    {
      imo_no: "9876545",
      vessel_name: "Nordic Star",
      eta: "2025-03-20T15:45:00",
      event_type: "At Anchor",
      notificationSubmitted: true,
      notificationDate: "2025-03-08T11:30:00",
      notificationData: {
        etaConfirmed: true,
        cargoReady: false,
        comments: "Awaiting cargo documentation"
      },
      checklistCompleted: true,
      checklistDate: "2025-03-09T10:15:00",
      checklistData: {
        documentation: false,
        safety: true,
        cargo: false,
        crew: true,
        hasConcerns: true,
        concerns: "Missing cargo manifest and hazardous materials declaration"
      },
      checklistConcerns: "Missing cargo manifest and hazardous materials declaration"
    }
  ];