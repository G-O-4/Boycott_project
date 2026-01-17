import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
const storeIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Store {
  id: string;
  name: string;
  nameAr?: string;
  address?: string;
  city: string;
  area?: string;
  lat: number;
  lng: number;
  priceMin?: number;
  priceMax?: number;
  currency?: string;
  lastConfirmed?: string;
}

interface StoreMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  stores: Store[];
}

export function StoreMapModal({ isOpen, onClose, productName, stores }: StoreMapModalProps) {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedCity, setSelectedCity] = useState('الكل');

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(stores.map(s => s.city))];
    return ['الكل', ...uniqueCities];
  }, [stores]);

  const filteredStores = useMemo(() => {
    if (selectedCity === 'الكل') return stores;
    return stores.filter(s => s.city === selectedCity);
  }, [stores, selectedCity]);

  // Libya center
  const defaultCenter: [number, number] = [32.4, 17.0];

  const mapBounds = useMemo(() => {
    if (filteredStores.length === 0) return null;
    return new LatLngBounds(
      filteredStores.map(s => [s.lat, s.lng] as [number, number])
    );
  }, [filteredStores]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-dark-900 w-full sm:w-[90%] sm:max-w-3xl sm:rounded-2xl overflow-hidden max-h-[90vh] flex flex-col rounded-t-2xl">
        {/* Header */}
        <div className="p-4 border-b border-dark-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-dark-100">أين أجد هذا المنتج؟</h2>
            <p className="text-sm text-dark-400">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-dark-700 text-dark-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-dark-700 flex items-center gap-4">
          {/* City filter */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="input py-2 text-sm flex-1"
          >
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          {/* View toggle */}
          <div className="flex bg-dark-700 rounded-xl p-1">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                viewMode === 'map'
                  ? 'bg-brand-600 text-white'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              خريطة
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                viewMode === 'list'
                  ? 'bg-brand-600 text-white'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              قائمة
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="px-4 py-2 text-sm text-dark-500">
          {filteredStores.length} متجر يوفر هذا المنتج
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {filteredStores.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-bold text-dark-100 mb-2">لا توجد متاجر</h3>
              <p className="text-dark-400 text-sm">
                لم نجد متاجر توفر هذا المنتج حالياً
              </p>
            </div>
          ) : viewMode === 'map' ? (
            <div style={{ height: '400px' }}>
              <MapContainer
                center={defaultCenter}
                zoom={6}
                bounds={mapBounds || undefined}
                boundsOptions={{ padding: [50, 50] }}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredStores.map((store) => (
                  <Marker
                    key={store.id}
                    position={[store.lat, store.lng]}
                    icon={storeIcon}
                  >
                    <Popup>
                      <div className="text-right min-w-[180px]" dir="rtl">
                        <h3 className="font-bold text-gray-900 mb-1">{store.nameAr || store.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{store.address || store.area}</p>
                        {store.priceMin && store.priceMax && (
                          <p className="text-sm text-emerald-600 font-medium mb-2">
                            {store.priceMin} - {store.priceMax} {store.currency || 'د.ل'}
                          </p>
                        )}
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          فتح في خرائط جوجل ←
                        </a>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[400px] p-4 space-y-3">
              {filteredStores.map((store) => (
                <div key={store.id} className="glass-card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-dark-100">{store.nameAr || store.name}</h3>
                      <p className="text-sm text-dark-400 mt-1">{store.address || store.area}, {store.city}</p>
                      {store.priceMin && store.priceMax && (
                        <p className="text-sm text-emerald-400 font-medium mt-2">
                          {store.priceMin} - {store.priceMax} {store.currency || 'د.ل'}
                        </p>
                      )}
                      {store.lastConfirmed && (
                        <p className="text-xs text-dark-500 mt-1">
                          آخر تأكيد: {new Date(store.lastConfirmed).toLocaleDateString('ar-LY')}
                        </p>
                      )}
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary text-sm py-2"
                    >
                      اتجاهات
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-dark-700">
          <button onClick={onClose} className="w-full btn-secondary">
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

