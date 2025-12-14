"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// --- ÍCONE DO AVIÃO (SVG) ---
const planeIcon = L.divIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" stroke="black" stroke-width="0.5" style="filter: drop-shadow(3px 5px 2px rgba(0,0,0,0.4)); transform: rotate(45deg); width: 100%; height: 100%;">
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
    </svg>
  `,
  className: "", // Remove classes padrão para não cortar o SVG
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function MapUpdater({ lat, lon }: { lat: number, lon: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lon) map.flyTo([lat, lon], map.getZoom());
  }, [lat, lon, map]);
  return null;
}

export default function FlightMap({ lat, lon }: { lat: number, lon: number }) {
  // Se não houver coordenadas, centra no Atlântico para não mostrar terra errada
  const position: [number, number] = [lat || 38.0, lon || -15.0];

  return (
    <MapContainer 
      center={position} 
      zoom={5} 
      scrollWheelZoom={true} 
      className="h-full w-full rounded-3xl z-0"
      style={{ background: "#0f172a" }}
    >
      <TileLayer
        attribution='&copy; CARTO'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      
      <MapUpdater lat={position[0]} lon={position[1]} />

      {/* Só mostra o avião se tivermos coordenadas reais */}
      {lat && lon && (
        <Marker position={position} icon={planeIcon}>
            <Popup>
            <div className="text-center text-black">
                <p className="font-bold text-sm">✈️ Voo Ativo</p>
            </div>
            </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}