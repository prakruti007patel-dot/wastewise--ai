import { useEffect, useRef } from 'react';
import type { CollectionPoint, Vehicle } from '../../types';

// Fallback map panel shown when Leaflet fails to load
const FallbackMap = ({ message }: { message?: string }) => (
  <div className="w-full h-full min-h-64 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
    <div className="text-center">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-200 flex items-center justify-center">
        <span className="text-2xl">🗺️</span>
      </div>
      <p className="text-sm font-medium text-gray-600">{message || 'Map view unavailable'}</p>
      <p className="text-xs text-gray-400 mt-1">OpenStreetMap tiles — check network</p>
    </div>
  </div>
);

interface MapProps {
  center?: [number, number];
  zoom?: number;
  vehicles?: Vehicle[];
  collectionPoints?: CollectionPoint[];
  className?: string;
  height?: string;
  showRoute?: boolean;
}

// We dynamically import leaflet to handle SSR/build issues gracefully
export const LeafletMap = ({ center = [23.033, 72.585], zoom = 12, vehicles = [], collectionPoints = [], className = '', height = '400px' }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    let isMounted = true;
    let L: typeof import('leaflet');

    const initMap = async () => {
      try {
        L = await import('leaflet');
        // Fix default icon URLs
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        if (!mapRef.current || !isMounted) return;
        if (mapInstanceRef.current) return;

        const map = L.map(mapRef.current, { center, zoom, zoomControl: true });
        mapInstanceRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        // Add vehicle markers
        vehicles.forEach(v => {
          const statusColor = v.status === 'full' ? '#ef4444' : v.status === 'maintenance' ? '#f97316' : '#22c55e';
          const icon = L.divIcon({
            html: `<div style="background:${statusColor};color:white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)">🚛</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            className: '',
          });
          L.marker(v.currentLocation, { icon })
            .addTo(map)
            .bindPopup(`<b>${v.id}</b><br/>Driver: ${v.driverName}<br/>Load: ${v.currentLoad}/${v.capacity}t<br/>Progress: ${v.routeProgress}%`);
        });

        // Add collection point markers
        collectionPoints.slice(0, 20).forEach(cp => {
          const color = cp.status === 'collected' ? '#22c55e' : cp.status === 'overflow' ? '#ef4444' : '#3b82f6';
          const icon = L.divIcon({
            html: `<div style="background:${color};border-radius:50%;width:12px;height:12px;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3)"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6],
            className: '',
          });
          L.marker(cp.coordinates, { icon })
            .addTo(map)
            .bindPopup(`<b>${cp.name}</b><br/>${cp.address}<br/>Status: ${cp.status}<br/>Est. waste: ${cp.wasteEstimateKg}kg`);
        });

      } catch (err) {
        console.warn('Map initialization failed:', err);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstanceRef.current as any).remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`relative rounded-xl overflow-hidden border border-gray-200 ${className}`} style={{ height }}>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

// Simple static map placeholder for quick views
export const StaticMapPreview = ({ className = '' }: { className?: string }) => (
  <div className={`relative rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-blue-50 border border-gray-200 ${className}`}>
    <div className="absolute inset-0 opacity-10">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="0.5"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
    <div className="relative flex items-center justify-center h-full p-8">
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-500">Gujarat Municipal Corporation</p>
        <p className="text-xs text-gray-400 mt-1">Demo Area — Fictional Locations</p>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-500 inline-block" />Vehicle On Route</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" />Vehicle Full</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />Collection Point</span>
        </div>
      </div>
    </div>
  </div>
);
