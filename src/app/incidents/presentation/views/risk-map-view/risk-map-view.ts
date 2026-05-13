import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

import { RiskZone } from '../../../domain/risk-zone.entity';
import { RiskZoneService } from '../../../infrastructure/risk-zone.service';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-risk-map-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './risk-map-view.html',
  styleUrl: './risk-map-view.css',
})
export class RiskMapView implements OnInit {
  /**
   * Stores all available risk zones displayed on the map.
   */
  riskZones: RiskZone[] = [];

  /**
   * Stores the currently selected risk filter.
   */
  selectedRiskLevel: 'all' | 'high' | 'medium' | 'low' = 'all';

  /**
   * Stores the search text entered by the user.
   */
  searchTerm: string = '';

  /**
   * Mock address suggestions used by the search bar.
   */
  searchSuggestions = [
    {
      name: 'Av. Balta 200',
      district: 'Moquegua Centro',
      distance: '0.3 km',
      riskLevel: 'high',
      latitude: -12.0464,
      longitude: -77.0428,
    },
    {
      name: 'Av. Balta 450',
      district: 'Cerca Mercado',
      distance: '0.7 km',
      riskLevel: 'medium',
      latitude: -12.052,
      longitude: -77.035,
    },
    {
      name: 'Jr. Balta 100',
      district: 'Zona Residencial',
      distance: '1.2 km',
      riskLevel: 'low',
      latitude: -12.058,
      longitude: -77.025,
    },
  ];

  /**
   * Leaflet map instance.
   */
  private map!: L.Map;

  /**
   * Stores the current markers displayed on the map.
   */
  private currentMarkers: L.CircleMarker[] = [];

  /**
   * Simulates the current user location on the map.
   */
  private userLocation = {
    latitude: -12.0464,
    longitude: -77.0428,
  };

  constructor(private riskZoneService: RiskZoneService) {}

  ngOnInit(): void {
    /**
     * Loads risk zones from the service.
     */
    this.riskZones = this.riskZoneService.getRiskZones();

    /**
     * Initializes the interactive map.
     */
    this.initializeMap();
    this.renderRiskMarkers();
    this.renderUserLocation();
  }

  /**
   * Creates and configures the Leaflet map.
   */
  private initializeMap(): void {
    this.map = L.map('map').setView([-12.0464, -77.0428], 12);

    /**
     * OpenStreetMap tile layer.
     */
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
  }

  /**
   * Draws risk zone markers on the map using colors by risk level.
   */
  private renderRiskMarkers(): void {
    /**
     * Removes previous markers before rendering new ones.
     */
    this.currentMarkers.forEach((marker) => {
      this.map.removeLayer(marker);
    });

    this.currentMarkers = [];

    this.riskZones.forEach((zone) => {
      const markerColor = this.getRiskColor(zone.riskLevel);

      const marker = L.circleMarker([zone.latitude, zone.longitude], {
        radius: 12,
        color: markerColor,
        fillColor: markerColor,
        fillOpacity: 0.75,
      });

      marker.addTo(this.map);

      this.currentMarkers.push(marker);

      marker.bindPopup(
        `
    <div class="risk-popup">
      <h3>${zone.name}</h3>
      <p><strong>Risk level:</strong> ${zone.riskLevel.toUpperCase()}</p>
      <p><strong>Description:</strong> ${zone.description}</p>
      <p><strong>Incident type:</strong> ${zone.incidentType}</p>
      <p><strong>Frequency:</strong> ${zone.frequency}</p>
      <p><strong>Active alerts:</strong> ${zone.activeAlerts}</p>
      <p><strong>Last report:</strong> ${zone.lastReport}</p>
    </div>
  `,
        {
          className: 'dark-popup',
        },
      );
    });
  }

  /**
   * Draws the current user location marker on the map.
   */
  private renderUserLocation(): void {
    L.circleMarker([this.userLocation.latitude, this.userLocation.longitude], {
      radius: 10,
      color: '#2196f3',
      fillColor: '#2196f3',
      fillOpacity: 0.9,
    })
      .addTo(this.map)
      .bindPopup(
        `
     <div class="risk-popup">
       <h3>Tu ubicación</h3>
       <p><strong>Estado:</strong> Zona monitoreada</p>
       <p><strong>Ubicación:</strong> Tiempo real activo</p>
     </div>
     `,
        {
          className: 'dark-popup',
        },
      );
  }

  /**
   * Filters risk zones according to selected level.
   */
  filterZones(riskLevel: 'all' | 'high' | 'medium' | 'low'): void {
    this.selectedRiskLevel = riskLevel;

    if (riskLevel === 'all') {
      this.riskZones = this.riskZoneService.getRiskZones();
    } else {
      this.riskZones = this.riskZoneService
        .getRiskZones()
        .filter((zone) => zone.riskLevel === riskLevel);
    }

    this.renderRiskMarkers();
    this.renderUserLocation();
  }

  /**
   * Returns true when a specific risk filter is active.
   */
  isFiltered(): boolean {
    return this.selectedRiskLevel !== 'all';
  }

  /**
   * Returns the selected risk level as readable text.
   */
  getSelectedRiskLabel(): string {
    switch (this.selectedRiskLevel) {
      case 'high':
        return 'ALTO';
      case 'medium':
        return 'MEDIO';
      case 'low':
        return 'BAJO';
      default:
        return 'TODOS';
    }
  }

  /**
   * Searches a zone by name and centers the map.
   */
  searchZone(): void {
    const foundZone = this.riskZoneService
      .getRiskZones()
      .find((zone) => zone.name.toLowerCase().includes(this.searchTerm.toLowerCase()));

    if (foundZone) {
      this.map.setView([foundZone.latitude, foundZone.longitude], 14);

      L.popup()
        .setLatLng([foundZone.latitude, foundZone.longitude])
        .setContent(
          `
        <strong>${foundZone.name}</strong><br>
        Risk level: ${foundZone.riskLevel}
      `,
        )
        .openOn(this.map);
    }
  }

  /**
   * Selects a suggestion and centers the map.
   */
  selectSuggestion(suggestion: any): void {
    this.searchTerm = suggestion.name;

    this.map.setView([suggestion.latitude, suggestion.longitude], 15);

    L.popup({
      className: 'dark-popup',
    })
      .setLatLng([suggestion.latitude, suggestion.longitude])
      .setContent(
        `
      <div class="risk-popup">
        <h3>${suggestion.name}</h3>
        <p><strong>Zona:</strong> ${suggestion.district}</p>
        <p><strong>Distancia:</strong> ${suggestion.distance}</p>
        <p><strong>Nivel:</strong> ${suggestion.riskLevel.toUpperCase()}</p>
      </div>
    `,
      )
      .openOn(this.map);

    this.searchTerm = '';
  }

  /**
   * Centers the map on a selected risk zone and opens its detail popup.
   */
  focusZone(zone: RiskZone): void {
    this.map.setView([zone.latitude, zone.longitude], 15);

    L.popup({
      className: 'dark-popup',
    })
      .setLatLng([zone.latitude, zone.longitude])
      .setContent(
        `
      <div class="risk-popup">
        <h3>${zone.name}</h3>
        <p><strong>Risk level:</strong> ${zone.riskLevel.toUpperCase()}</p>
        <p><strong>Description:</strong> ${zone.description}</p>
        <p><strong>Incident type:</strong> ${zone.incidentType}</p>
        <p><strong>Frequency:</strong> ${zone.frequency}</p>
        <p><strong>Active alerts:</strong> ${zone.activeAlerts}</p>
        <p><strong>Last report:</strong> ${zone.lastReport}</p>
      </div>
    `,
      )
      .openOn(this.map);
  }

  /**
   * Counts zones by risk level.
   */
  getZonesByLevel(level: 'high' | 'medium' | 'low'): number {
    return this.riskZoneService.getRiskZones().filter((zone) => zone.riskLevel === level).length;
  }

  /**
   * Calculates total active alerts from all risk zones.
   */
  getTotalActiveAlerts(): number {
    return this.riskZoneService
      .getRiskZones()
      .reduce((total, zone) => total + zone.activeAlerts, 0);
  }

  /**
   * Returns the most relevant active zones for the summary panel.
   */
  getFeaturedZones(): RiskZone[] {
    if (this.selectedRiskLevel === 'all') {
      return this.riskZoneService.getRiskZones();
    }

    return this.riskZoneService
      .getRiskZones()
      .filter((zone) => zone.riskLevel === this.selectedRiskLevel);
  }

  /**
   * Counts all registered risk zones.
   */
  getTotalRiskZones(): number {
    return this.riskZoneService.getRiskZones().length;
  }

  /**
   * Counts zones that require attention.
   */
  getAlertZones(): number {
    return this.riskZoneService
      .getRiskZones()
      .filter((zone) => zone.riskLevel === 'high' || zone.riskLevel === 'medium').length;
  }

  /**
   * Calculates the percentage of high and medium risk zones.
   */
  getRiskIndex(): number {
    const zones = this.riskZoneService.getRiskZones();

    if (zones.length === 0) {
      return 0;
    }

    const riskyZones = zones.filter(
      (zone) => zone.riskLevel === 'high' || zone.riskLevel === 'medium',
    ).length;

    return Math.round((riskyZones / zones.length) * 100);
  }

  /**
   * Returns the visual color assigned to each risk level.
   */
  private getRiskColor(riskLevel: RiskZone['riskLevel']): string {
    switch (riskLevel) {
      case 'high':
        return '#ff2d2d';
      case 'medium':
        return '#ffc107';
      case 'low':
        return '#00c853';
      default:
        return '#9e9e9e';
    }
  }
}
