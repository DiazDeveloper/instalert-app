export interface RiskZone {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  riskLevel: 'high' | 'medium' | 'low';
  description: string;
  incidentType: string;
  frequency: string;
  activeAlerts: number;
  lastReport: string;
}
