import React, { useState, useEffect, useRef } from 'react';
import { Modal, Box } from '@mui/material';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import L from 'leaflet';

const center = [20.5937, 78.9629]; // India center

function LocationSelector({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPickerMap({ open, onClose, setFormData }) {
  const [latLng, setLatLng] = useState(null);
  const mapRef = useRef(null);

  const handleSelect = (lat, lng) => {
    setLatLng({ lat, lng });
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    onClose();
  };

  // Fix for map sizing when modal opens
  useEffect(() => {
    if (open && mapRef.current) {
      // Delay a bit to let modal open and layout settle
      const timeout = setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80vw',
          height: '80vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
        }}
      >
        <MapContainer
          center={center}
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <LocationSelector onSelect={handleSelect} />
          {latLng && (
            <Marker
              position={[latLng.lat, latLng.lng]}
              icon={L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            />
          )}
        </MapContainer>
      </Box>
    </Modal>
  );
}
