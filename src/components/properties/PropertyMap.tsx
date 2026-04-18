import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { formatNaira } from '@/lib/utils'
import type { Property } from '@/lib/types'

// Fix default Leaflet marker icons (broken in Vite)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const verifiedIcon = new L.DivIcon({
  html: `<div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#16a34a,#15803d);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:13px;">🛡️</div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

const pendingIcon = new L.DivIcon({
  html: `<div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#b45309,#92400e);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:13px;">🏠</div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

function FitBounds({ properties }: { properties: Property[] }) {
  const map = useMap()
  useEffect(() => {
    if (!properties.length) return
    const bounds = L.latLngBounds(properties.map(p => [p.lat, p.lng]))
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [properties.length])
  return null
}

interface PropertyMapProps {
  properties: Property[]
}

export function PropertyMap({ properties }: PropertyMapProps) {
  const centre: [number, number] = [7.9, 5.2]

  return (
    <MapContainer
      center={centre}
      zoom={6}
      className="w-full h-full min-h-[400px] rounded-xl overflow-hidden"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds properties={properties} />
      {properties.map(p => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={p.shield_verified ? verifiedIcon : pendingIcon}
        >
          <Popup maxWidth={260}>
            <div className="text-sm space-y-1" style={{ fontFamily: 'system-ui, sans-serif' }}>
              {p.photos[0] && (
                <img src={p.photos[0]} alt={p.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '6px' }} />
              )}
              <p style={{ fontWeight: 700, margin: 0 }}>{p.title}</p>
              <p style={{ color: '#16a34a', fontWeight: 700, margin: '2px 0' }}>{formatNaira(p.price)}</p>
              <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>{p.address}</p>
              {p.shield_verified && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#dcfce7', color: '#15803d', fontSize: '11px', padding: '2px 8px', borderRadius: '99px', marginTop: '4px' }}>
                  🛡️ Shield Verified
                </span>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
