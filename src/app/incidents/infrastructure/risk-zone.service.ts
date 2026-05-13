import { Injectable } from '@angular/core';
import { RiskZone } from '../domain/risk-zone.entity';

@Injectable({
  providedIn: 'root',
})
export class RiskZoneService {
  /**
   * Mock data used to simulate risk zones on the map.
   */
  private riskZones: RiskZone[] = [
    {
      id: 1,
      name: 'San Martin de Porres',
      riskLevel: 'high',
      latitude: -12.001,
      longitude: -77.05,
      description: 'High robbery frequency during night hours.',
      incidentType: 'Robbery',
      frequency: 'Daily',
      activeAlerts: 12,
      lastReport: '2 hours ago',
    },
    {
      id: 2,
      name: 'Cercado de Lima',
      riskLevel: 'medium',
      latitude: -12.046,
      longitude: -77.03,
      description: 'Moderate suspicious activity reported.',
      incidentType: 'Suspicious activity',
      frequency: 'Weekly',
      activeAlerts: 5,
      lastReport: 'Today',
    },
    {
      id: 3,
      name: 'La Victoria',
      riskLevel: 'high',
      latitude: -12.067,
      longitude: -77.02,
      description: 'Low incident rate in the area.',
      incidentType: 'Low incidents',
      frequency: 'Monthly',
      activeAlerts: 1,
      lastReport: 'Yesterday',
    },
    {
      id: 4,
      name: 'Los Olivos',
      riskLevel: 'high',
      latitude: -11.991,
      longitude: -77.075,
      description: 'Frequent robbery reports.',
      incidentType: 'Armed robbery',
      frequency: 'Weekly',
      activeAlerts: 6,
      lastReport: '2 hours ago',
    },
    {
      id: 5,
      name: 'Jesús María',
      riskLevel: 'low',
      latitude: -12.073,
      longitude: -77.05,
      description: 'Moderate suspicious activity.',
      incidentType: 'Suspicious activity',
      frequency: 'Monthly',
      activeAlerts: 3,
      lastReport: 'Today',
    },
    {
      id: 6,
      name: 'San Isidro',
      riskLevel: 'low',
      latitude: -12.097,
      longitude: -77.036,
      description: 'Low crime rate.',
      incidentType: 'Minor incidents',
      frequency: 'Monthly',
      activeAlerts: 1,
      lastReport: 'Yesterday',
    },
    {
      id: 7,
      name: 'Comas',
      riskLevel: 'high',
      latitude: -11.932,
      longitude: -77.053,
      description: 'High number of robbery incidents.',
      incidentType: 'Armed assault',
      frequency: 'Daily',
      activeAlerts: 8,
      lastReport: '1 hour ago',
    },
    {
      id: 8,
      name: 'Magdalena del Mar',
      riskLevel: 'medium',
      latitude: -12.091,
      longitude: -77.072,
      description: 'Moderate theft activity in the area.',
      incidentType: 'Street theft',
      frequency: 'Weekly',
      activeAlerts: 4,
      lastReport: 'Today',
    },
    {
      id: 9,
      name: 'Barranco',
      riskLevel: 'low',
      latitude: -12.146,
      longitude: -77.02,
      description: 'Safe area with isolated incidents.',
      incidentType: 'Minor incidents',
      frequency: 'Monthly',
      activeAlerts: 1,
      lastReport: '3 days ago',
    },
  ];
  /**
   * Returns all risk zones.
   */
  getRiskZones(): RiskZone[] {
    return this.riskZones;
  }
}
