// Comprehensive Scrubber Telemetry & pH Monitoring Data

export const ALERTS_RULES = {
  HEALTHY_MIN_PH: 9.0,
  WARNING_MIN_PH: 8.5,
};

export const evaluateStatus = (ph) => {
  if (ph >= ALERTS_RULES.HEALTHY_MIN_PH) return 'Healthy';
  if (ph >= ALERTS_RULES.WARNING_MIN_PH) return 'Warning';
  return 'Critical';
};

export const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'healthy':
      return { text: '#2E7D32', bg: 'rgba(46, 125, 50, 0.12)', border: 'rgba(46, 125, 50, 0.35)' };
    case 'warning':
      return { text: '#d97706', bg: 'rgba(217, 119, 6, 0.12)', border: 'rgba(217, 119, 6, 0.35)' };
    case 'critical':
      return { text: '#dc2626', bg: 'rgba(220, 38, 38, 0.12)', border: 'rgba(220, 38, 38, 0.35)' };
    default:
      return { text: '#455A64', bg: 'rgba(69, 90, 100, 0.12)', border: 'rgba(69, 90, 100, 0.35)' };
  }
};

export const POSSIBLE_CAUSES = [
  'Low alkali dosing',
  'Alkali dosing pump failure',
  'Sensor calibration issue',
  'High acidic gas concentration',
  'Recirculation pump malfunction'
];

export const RECOMMENDED_ACTIONS = [
  'Inspect alkali dosing pump',
  'Increase alkali dosing',
  'Verify pH sensor calibration',
  'Inspect scrubber circulation system',
  'Schedule preventive maintenance',
  'Continue monitoring if warning persists'
];

// Seed scrubbers list
export const INITIAL_SCRUBBERS = [
  {
    id: 'SCB-101',
    name: 'SCB-101',
    location: 'Unit 1 - Raw Material Scrubber',
    currentPh: 9.85,
    avgPh: 9.65,
    minPh: 9.10,
    maxPh: 10.40,
    lastUpdated: 'Just now',
    sensor: {
      id: 'SNS-PH-101',
      model: 'Endress+Hauser Orbisint CPS11D',
      location: 'Raw Material Building - Column 1',
      lastCalibrated: '2026-07-10',
      range: '0.0 - 14.0 pH',
      operatingTemp: '32 °C',
      status: 'Active'
    },
    aiObservations: 'pH levels are maintaining a stable alkaline range (9.85 pH average). No continuous drift detected in the last 72 hours.',
    maintenanceHistory: [
      { date: '2026-07-10', type: 'Calibration', desc: 'Routine 2-point pH buffer calibration (pH 7 & 10)', tech: 'Rajesh K.', status: 'Completed' },
      { date: '2026-06-15', type: 'Pump Service', desc: 'Replaced diaphragm in NaOH dosing pump', tech: 'Suresh M.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-102',
    name: 'SCB-102',
    location: 'Unit 1 - Reactor Exhaust Scrubber',
    currentPh: 9.42,
    avgPh: 9.30,
    minPh: 9.05,
    maxPh: 9.90,
    lastUpdated: '1 min ago',
    sensor: {
      id: 'SNS-PH-102',
      model: 'Mettler Toledo InPro 3253',
      location: 'Reactor Bay 2',
      lastCalibrated: '2026-07-12',
      range: '0.0 - 14.0 pH',
      operatingTemp: '29 °C',
      status: 'Active'
    },
    aiObservations: 'Normal operation observed. Minor fluctuation during batch charge at 08:30 AM quickly compensated by alkali dosing.',
    maintenanceHistory: [
      { date: '2026-07-12', type: 'Electrode Wash', desc: 'Cleaned glass membrane with 0.1M HCl solution', tech: 'Anil P.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-103',
    name: 'SCB-103',
    location: 'Unit 1 - Acid Distillation Scrubber',
    currentPh: 8.68,
    avgPh: 8.92,
    minPh: 8.45,
    maxPh: 9.50,
    lastUpdated: 'Just now',
    sensor: {
      id: 'SNS-PH-103',
      model: 'Yokogawa FU20 All-in-One',
      location: 'Acid Recovery Unit',
      lastCalibrated: '2026-07-05',
      range: '0.0 - 14.0 pH',
      operatingTemp: '36 °C',
      status: 'Active'
    },
    aiObservations: 'Rapid pH decrease detected in SCB-103 during high acidic gas influx. pH dropped from 9.20 to 8.68 in 45 minutes.',
    maintenanceHistory: [
      { date: '2026-07-05', type: 'Preventive Maintenance', desc: 'Checked strainers and auto-dosing solenoid valve', tech: 'Rajesh K.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-104',
    name: 'SCB-104',
    location: 'Unit 1 - Solvent Recovery Scrubber',
    currentPh: 10.85,
    avgPh: 10.60,
    minPh: 9.95,
    maxPh: 11.20,
    lastUpdated: '2 mins ago',
    sensor: {
      id: 'SNS-PH-104',
      model: 'Endress+Hauser Orbisint CPS11D',
      location: 'Solvent Plant B',
      lastCalibrated: '2026-07-14',
      range: '0.0 - 14.0 pH',
      operatingTemp: '27 °C',
      status: 'Active'
    },
    aiObservations: 'Robust alkaline buffer maintained at 10.85 pH. System headroom is optimal for upcoming reactor purging cycles.',
    maintenanceHistory: [
      { date: '2026-07-14', type: 'Calibration', desc: 'Standard buffer calibration performed', tech: 'Venkatesh T.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-105',
    name: 'SCB-105',
    location: 'Unit 1 - General Chemical Scrubber',
    currentPh: 10.12,
    avgPh: 10.05,
    minPh: 9.40,
    maxPh: 10.75,
    lastUpdated: '3 mins ago',
    sensor: {
      id: 'SNS-PH-105',
      model: 'Hamilton Polilyte Plus',
      location: 'GCB-1 Building',
      lastCalibrated: '2026-07-08',
      range: '0.0 - 14.0 pH',
      operatingTemp: '30 °C',
      status: 'Active'
    },
    aiObservations: 'Consistently healthy performance. pH standard deviation over 7 days is 0.18 pH.',
    maintenanceHistory: [
      { date: '2026-07-08', type: 'Inspection', desc: 'Visual inspection of pH probe reference junction', tech: 'Anil P.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-106',
    name: 'SCB-106',
    location: 'Unit 1 - EHS Vent Scrubber',
    currentPh: 9.25,
    avgPh: 9.15,
    minPh: 8.80,
    maxPh: 9.70,
    lastUpdated: 'Just now',
    sensor: {
      id: 'SNS-PH-106',
      model: 'Mettler Toledo InPro 3253',
      location: 'EHS Utility Complex',
      lastCalibrated: '2026-07-11',
      range: '0.0 - 14.0 pH',
      operatingTemp: '28 °C',
      status: 'Active'
    },
    aiObservations: 'pH baseline stable above 9.0 threshold. Auto-alkali dosing pump cycle rate is nominal.',
    maintenanceHistory: [
      { date: '2026-07-11', type: 'Sensor Cleaning', desc: 'Ultrasonic cleaning of pH sensor tip', tech: 'Suresh M.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-107',
    name: 'SCB-107',
    location: 'Unit 1 - Secondary EHS Scrubber',
    currentPh: 8.74,
    avgPh: 8.85,
    minPh: 8.52,
    maxPh: 9.18,
    lastUpdated: '1 min ago',
    sensor: {
      id: 'SNS-PH-107',
      model: 'Endress+Hauser Orbisint CPS11D',
      location: 'EHS Utility Complex B',
      lastCalibrated: '2026-07-02',
      range: '0.0 - 14.0 pH',
      operatingTemp: '31 °C',
      status: 'Active'
    },
    aiObservations: 'Warning status: pH hovering near warning limit (8.74 pH). Alkali dosing stroke rate should be increased by 10%.',
    maintenanceHistory: [
      { date: '2026-07-02', type: 'Calibration', desc: 'Zero & Span calibration', tech: 'Rajesh K.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-201',
    name: 'SCB-201',
    location: 'Unit 2 - API Synthesis Scrubber',
    currentPh: 9.55,
    avgPh: 9.60,
    minPh: 9.10,
    maxPh: 10.10,
    lastUpdated: '4 mins ago',
    sensor: {
      id: 'SNS-PH-201',
      model: 'Yokogawa FU20',
      location: 'API Block 2',
      lastCalibrated: '2026-07-09',
      range: '0.0 - 14.0 pH',
      operatingTemp: '33 °C',
      status: 'Active'
    },
    aiObservations: 'Operating in healthy state. Continuous recirculation pump pressure is normal.',
    maintenanceHistory: [
      { date: '2026-07-09', type: 'Inspection', desc: 'Flow transmitter and pH probe health verification', tech: 'Venkatesh T.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-301',
    name: 'SCB-301',
    location: 'Unit 3 - Chlorination Plant Scrubber',
    currentPh: 7.95,
    avgPh: 8.42,
    minPh: 7.65,
    maxPh: 9.80,
    lastUpdated: 'Just now',
    sensor: {
      id: 'SNS-PH-301',
      model: 'Mettler Toledo InPro 3253',
      location: 'Chlorination Tower 3',
      lastCalibrated: '2026-06-28',
      range: '0.0 - 14.0 pH',
      operatingTemp: '38 °C',
      status: 'Active'
    },
    aiObservations: 'CRITICAL ALERT: SCB-301 pH dropped below safe operating range (7.95 pH). Continuous low pH observed for the last 3 readings. Immediate inspection of alkali dosing pump is required.',
    maintenanceHistory: [
      { date: '2026-06-28', type: 'Calibration', desc: 'Buffer calibration prior to production batch', tech: 'Anil P.', status: 'Completed' },
      { date: '2026-05-18', type: 'Pump Replacement', desc: 'Replaced dosing check valves', tech: 'Suresh M.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-302',
    name: 'SCB-302',
    location: 'Unit 3 - Hydrogen Chloride Absorption Tower',
    currentPh: 8.15,
    avgPh: 8.35,
    minPh: 7.80,
    maxPh: 9.10,
    lastUpdated: 'Just now',
    sensor: {
      id: 'SNS-PH-302',
      model: 'Endress+Hauser Orbisint CPS11D',
      location: 'HCl Recovery Plant',
      lastCalibrated: '2026-07-01',
      range: '0.0 - 14.0 pH',
      operatingTemp: '37 °C',
      status: 'Active'
    },
    aiObservations: 'CRITICAL: Low pH observed (8.15 pH). Possible causes include high acidic gas concentration or alkali dosing pump failure.',
    maintenanceHistory: [
      { date: '2026-07-01', type: 'Maintenance', desc: 'Scrubber column packing inspection', tech: 'Rajesh K.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-303',
    name: 'SCB-303',
    location: 'Unit 3 - High-Efficiency Multi-Stage Scrubber',
    currentPh: 10.55,
    avgPh: 10.90,
    minPh: 10.10,
    maxPh: 11.45,
    lastUpdated: '5 mins ago',
    sensor: {
      id: 'SNS-PH-303',
      model: 'Hamilton Polilyte Plus',
      location: 'Multi-Stage Complex',
      lastCalibrated: '2026-07-15',
      range: '0.0 - 14.0 pH',
      operatingTemp: '30 °C',
      status: 'Active'
    },
    aiObservations: 'Optimal performance. pH stability index is 98.4%. Recirculation rate is within target parameters.',
    maintenanceHistory: [
      { date: '2026-07-15', type: 'Calibration', desc: 'Automatic sensor cleaning & buffer calibration', tech: 'Venkatesh T.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-304',
    name: 'SCB-304',
    location: 'Unit 3 - Organic Vapors Scrubber',
    currentPh: 9.51,
    avgPh: 9.40,
    minPh: 9.12,
    maxPh: 9.88,
    lastUpdated: '2 mins ago',
    sensor: {
      id: 'SNS-PH-304',
      model: 'Yokogawa FU20',
      location: 'OCB Plant 3',
      lastCalibrated: '2026-07-13',
      range: '0.0 - 14.0 pH',
      operatingTemp: '26 °C',
      status: 'Active'
    },
    aiObservations: 'Steady state operation. Average pH over the last 24 hours remains firmly in the healthy region.',
    maintenanceHistory: [
      { date: '2026-07-13', type: 'Routine Service', desc: 'Checked liquid distributor and pH probe', tech: 'Anil P.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-501',
    name: 'SCB-501',
    location: 'Unit 5 - General Chemical Building Scrubber 2',
    currentPh: 11.10,
    avgPh: 10.80,
    minPh: 10.20,
    maxPh: 11.60,
    lastUpdated: '3 mins ago',
    sensor: {
      id: 'SNS-PH-501',
      model: 'Endress+Hauser CPS11D',
      location: 'GCB-2 Building',
      lastCalibrated: '2026-07-16',
      range: '0.0 - 14.0 pH',
      operatingTemp: '31 °C',
      status: 'Active'
    },
    aiObservations: 'High alkalinity reserve (11.10 pH). Excellent acid neutralization capacity for peak loads.',
    maintenanceHistory: [
      { date: '2026-07-16', type: 'Calibration', desc: 'Monthly buffer calibration', tech: 'Suresh M.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-502',
    name: 'SCB-502',
    location: 'Unit 5 - General Chemical Building Scrubber 3',
    currentPh: 9.69,
    avgPh: 9.75,
    minPh: 9.20,
    maxPh: 10.30,
    lastUpdated: '4 mins ago',
    sensor: {
      id: 'SNS-PH-502',
      model: 'Mettler Toledo InPro 3253',
      location: 'GCB-3 Building',
      lastCalibrated: '2026-07-07',
      range: '0.0 - 14.0 pH',
      operatingTemp: '29 °C',
      status: 'Active'
    },
    aiObservations: 'Smooth telemetry. pH fluctuations remain within ±0.3 pH margin.',
    maintenanceHistory: [
      { date: '2026-07-07', type: 'Inspection', desc: 'Checked dosing line non-return valve', tech: 'Rajesh K.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-601',
    name: 'SCB-601',
    location: 'Unit 6 - Granulation & Drying Scrubber',
    currentPh: 8.82,
    avgPh: 8.90,
    minPh: 8.55,
    maxPh: 9.30,
    lastUpdated: 'Just now',
    sensor: {
      id: 'SNS-PH-601',
      model: 'Hamilton Polilyte Plus',
      location: 'GCB-4 Building',
      lastCalibrated: '2026-07-04',
      range: '0.0 - 14.0 pH',
      operatingTemp: '34 °C',
      status: 'Active'
    },
    aiObservations: 'Warning status: pH currently at 8.82 pH (below 9.0 target). Dosing pump auto-adjust has been triggered.',
    maintenanceHistory: [
      { date: '2026-07-04', type: 'Calibration', desc: 'Buffer calibration', tech: 'Venkatesh T.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-604',
    name: 'SCB-604',
    location: 'Unit 6 - Bromination Scrubber',
    currentPh: 7.82,
    avgPh: 8.10,
    minPh: 7.40,
    maxPh: 8.90,
    lastUpdated: 'Just now',
    sensor: {
      id: 'SNS-PH-604',
      model: 'Yokogawa FU20',
      location: 'Bromination Bay 6',
      lastCalibrated: '2026-06-25',
      range: '0.0 - 14.0 pH',
      operatingTemp: '39 °C',
      status: 'Active'
    },
    aiObservations: 'CRITICAL WARNING: SCB-604 pH dropped to 7.82 pH. Possible cause: Sensor calibration issue or alkali dosing pump failure. Recommended action: Verify pH sensor calibration immediately.',
    maintenanceHistory: [
      { date: '2026-06-25', type: 'Electrode Replacement', desc: 'Installed new glass electrode', tech: 'Anil P.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-605',
    name: 'SCB-605',
    location: 'Unit 6 - Exhaust Acid Gas Scrubber',
    currentPh: 8.65,
    avgPh: 8.78,
    minPh: 8.51,
    maxPh: 9.15,
    lastUpdated: '2 mins ago',
    sensor: {
      id: 'SNS-PH-605',
      model: 'Endress+Hauser CPS11D',
      location: 'Exhaust Complex 6',
      lastCalibrated: '2026-07-06',
      range: '0.0 - 14.0 pH',
      operatingTemp: '33 °C',
      status: 'Active'
    },
    aiObservations: 'Warning status (8.65 pH). Mild downward trend noted over the past 4 hours. Dosing adjustment recommended.',
    maintenanceHistory: [
      { date: '2026-07-06', type: 'Maintenance', desc: 'Cleaned spray nozzles and verified flow meter', tech: 'Suresh M.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-606',
    name: 'SCB-606',
    location: 'Unit 6 - Secondary Solvent Scrubber',
    currentPh: 8.95,
    avgPh: 9.10,
    minPh: 8.60,
    maxPh: 9.60,
    lastUpdated: '1 min ago',
    sensor: {
      id: 'SNS-PH-606',
      model: 'Mettler Toledo InPro 3253',
      location: 'Solvent Complex 6',
      lastCalibrated: '2026-07-09',
      range: '0.0 - 14.0 pH',
      operatingTemp: '30 °C',
      status: 'Active'
    },
    aiObservations: 'Borderline warning condition (8.95 pH). pH recovery rate is active following automated NaOH feed increment.',
    maintenanceHistory: [
      { date: '2026-07-09', type: 'Calibration', desc: '2-point pH buffer calibration', tech: 'Rajesh K.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-701',
    name: 'SCB-701',
    location: 'Unit 7 - API Intermediate Scrubber',
    currentPh: 10.80,
    avgPh: 10.80,
    minPh: 10.40,
    maxPh: 11.20,
    lastUpdated: '6 mins ago',
    sensor: {
      id: 'SNS-PH-701',
      model: 'Hamilton Polilyte Plus',
      location: 'GCB-5 Building',
      lastCalibrated: '2026-07-14',
      range: '0.0 - 14.0 pH',
      operatingTemp: '28 °C',
      status: 'Active'
    },
    aiObservations: 'Healthy status: Consistent 10.80 pH reading over current monitoring window.',
    maintenanceHistory: [
      { date: '2026-07-14', type: 'Inspection', desc: 'System seal integrity and probe check', tech: 'Venkatesh T.', status: 'Completed' }
    ]
  },
  {
    id: 'SCB-901',
    name: 'SCB-901',
    location: 'Unit 9 - Effluent Treatment Gas Scrubber',
    currentPh: 11.68,
    avgPh: 11.48,
    minPh: 11.10,
    maxPh: 11.90,
    lastUpdated: '3 mins ago',
    sensor: {
      id: 'SNS-PH-901',
      model: 'Endress+Hauser CPS11D',
      location: 'GCB-7 Building',
      lastCalibrated: '2026-07-17',
      range: '0.0 - 14.0 pH',
      operatingTemp: '31 °C',
      status: 'Active'
    },
    aiObservations: 'Excellent alkaline buffer capacity. All parameters operating well within compliance thresholds.',
    maintenanceHistory: [
      { date: '2026-07-17', type: 'Calibration', desc: 'Bi-weekly calibration completed', tech: 'Anil P.', status: 'Completed' }
    ]
  }
];

// Time-series trend generator for Daily (24h), Weekly (7d), and Monthly (30d)
export const generatePhTrendData = (scrubber, filter = 'Daily') => {
  const currentPh = scrubber.currentPh;
  const baseAvg = scrubber.avgPh || currentPh;
  const min = scrubber.minPh || currentPh - 1.2;
  const max = scrubber.maxPh || currentPh + 1.2;

  const points = filter === 'Daily' ? 24 : filter === 'Weekly' ? 7 : 30;
  const data = [];

  for (let i = points - 1; i >= 0; i--) {
    let label = '';
    let variance = (Math.sin(i * 0.8) * 0.4) + (Math.cos(i * 0.3) * 0.2);
    
    if (filter === 'Daily') {
      const hour = (new Date().getHours() - i + 24) % 24;
      label = `${hour.toString().padStart(2, '0')}:00`;
    } else if (filter === 'Weekly') {
      const d = new Date();
      d.setDate(d.getDate() - i);
      label = d.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      const d = new Date();
      d.setDate(d.getDate() - i);
      label = `${d.getMonth() + 1}/${d.getDate()}`;
    }

    // Ensure the last point matches currentPh
    let phValue = i === 0 ? currentPh : Math.max(min, Math.min(max, +(baseAvg + variance).toFixed(2)));

    data.push({
      time: label,
      ph: phValue,
      healthyThreshold: ALERTS_RULES.HEALTHY_MIN_PH,
      warningThreshold: ALERTS_RULES.WARNING_MIN_PH,
    });
  }

  return data;
};

// Initial system alerts dataset following the explicit required rules
export const INITIAL_ALERTS = [
  {
    id: 'ALT-1001',
    date: '2026-07-21',
    time: '10:45:12',
    scrubberId: 'SCB-301',
    currentPh: 7.95,
    alertLevel: 'Critical',
    description: 'SCB-301 pH dropped below safe operating range.',
    possibleCause: 'Alkali dosing pump failure',
    recommendedAction: 'Inspect alkali dosing pump',
    status: 'Open'
  },
  {
    id: 'ALT-1002',
    date: '2026-07-21',
    time: '10:32:05',
    scrubberId: 'SCB-604',
    currentPh: 7.82,
    alertLevel: 'Critical',
    description: 'Continuous low pH observed for the last 3 readings.',
    possibleCause: 'Sensor calibration issue',
    recommendedAction: 'Verify pH sensor calibration',
    status: 'Open'
  },
  {
    id: 'ALT-1003',
    date: '2026-07-21',
    time: '10:15:40',
    scrubberId: 'SCB-103',
    currentPh: 8.68,
    alertLevel: 'Warning',
    description: 'Rapid pH decrease detected in SCB-103.',
    possibleCause: 'High acidic gas concentration',
    recommendedAction: 'Increase alkali dosing',
    status: 'Open'
  },
  {
    id: 'ALT-1004',
    date: '2026-07-21',
    time: '09:50:18',
    scrubberId: 'SCB-302',
    currentPh: 8.15,
    alertLevel: 'Critical',
    description: 'SCB-302 pH dropped below safe operating range.',
    possibleCause: 'Recirculation pump malfunction',
    recommendedAction: 'Inspect scrubber circulation system',
    status: 'Open'
  },
  {
    id: 'ALT-1005',
    date: '2026-07-21',
    time: '09:12:00',
    scrubberId: 'SCB-601',
    currentPh: 8.82,
    alertLevel: 'Warning',
    description: 'Rapid pH decrease detected in SCB-601.',
    possibleCause: 'Low alkali dosing',
    recommendedAction: 'Increase alkali dosing',
    status: 'Open'
  },
  {
    id: 'ALT-1006',
    date: '2026-07-21',
    time: '08:30:22',
    scrubberId: 'SCB-605',
    currentPh: 8.65,
    alertLevel: 'Warning',
    description: 'Continuous low pH observed for the last 3 readings.',
    possibleCause: 'Low alkali dosing',
    recommendedAction: 'Continue monitoring if warning persists',
    status: 'Resolved'
  },
  {
    id: 'ALT-1007',
    date: '2026-07-20',
    time: '16:20:11',
    scrubberId: 'SCB-107',
    currentPh: 8.74,
    alertLevel: 'Warning',
    description: 'Rapid pH decrease detected in SCB-107.',
    possibleCause: 'Alkali dosing pump failure',
    recommendedAction: 'Schedule preventive maintenance',
    status: 'Resolved'
  }
];
