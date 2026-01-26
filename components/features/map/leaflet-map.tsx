'use client';

import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useUIStore } from '@/lib/store/ui-store';
import { useEffect, useRef } from 'react';
import type { Map as LeafletMapInstance } from 'leaflet';
import { cn } from '@/lib/utils';
// Fix Leaflet marker icons
import L from 'leaflet';
import { useLocations } from '@/lib/hooks/use-locations';

const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
});

// Component to handle map resize
function MapController() {
    const { sidebarOpen } = useUIStore();
    const map = useMap();

    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 300);
        return () => clearTimeout(timer);
    }, [sidebarOpen, map]);

    return null;
}

// Prepare icons (simple version for now)
const DefaultIcon = L.icon({
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});


// Da Nang geographic bounds
const DA_NANG_BOUNDS: L.LatLngBoundsExpression = [
    [15.8500, 107.8000], // South West
    [16.2500, 108.4500]  // North East
];

export default function LeafletMap() {
    const mapRef = useRef<LeafletMapInstance | null>(null);
    const { locations } = useLocations();

    return (
        <div className={cn('w-full h-full transition-all duration-300 relative')}>
            <MapContainer
                center={[16.0544, 108.2022]} // Da Nang coordinates
                zoom={13}
                minZoom={11}
                maxBounds={DA_NANG_BOUNDS}
                maxBoundsViscosity={1.0}
                className="w-full h-full z-0"
                zoomControl={false}
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ZoomControl position="bottomright" />
                <MapController />

                {locations.map((location) => (
                    <Marker
                        key={location.id}
                        position={[location.latitude, location.longitude]}
                        icon={DefaultIcon}
                    >
                        <Popup className="min-w-[200px]">
                            <div className="p-1">
                                <h4 className="font-bold text-sm mb-1">{location.name_vi}</h4>
                                <p className="text-xs text-gray-500 mb-2 truncate">{location.address_vi}</p>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium border border-primary/20 capitalize">
                                    {location.category}
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
