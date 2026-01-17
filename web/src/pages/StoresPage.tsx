import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguageStore } from '../store/language';

// Fix for default marker icons in Leaflet with Vite
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const preferredIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Sample store data - would come from API
const sampleStores = [
  {
    id: '1',
    name: 'سوبر ماركت الريادة',
    address: 'شارع الجمهورية، طرابلس',
    city: 'طرابلس',
    lat: 32.8872,
    lng: 13.1913,
    hasAlternatives: true,
    alternativesCount: 15,
  },
  {
    id: '2',
    name: 'متجر الأمل',
    address: 'منطقة السراج، طرابلس',
    city: 'طرابلس',
    lat: 32.8752,
    lng: 13.1763,
    hasAlternatives: true,
    alternativesCount: 8,
  },
  {
    id: '3',
    name: 'سوبر ماركت النجمة',
    address: 'شارع عمر المختار، بنغازي',
    city: 'بنغازي',
    lat: 32.1194,
    lng: 20.0868,
    hasAlternatives: true,
    alternativesCount: 12,
  },
  {
    id: '4',
    name: 'متجر السلام',
    address: 'منطقة الحدائق، بنغازي',
    city: 'بنغازي',
    lat: 32.1094,
    lng: 20.0768,
    hasAlternatives: false,
    alternativesCount: 0,
  },
  {
    id: '5',
    name: 'سوبر ماركت الوحدة',
    address: 'وسط المدينة، مصراتة',
    city: 'مصراتة',
    lat: 32.3754,
    lng: 15.0925,
    hasAlternatives: true,
    alternativesCount: 6,
  },
];

const cities = ['الكل', 'طرابلس', 'بنغازي', 'مصراتة'];

// Component to fit map to bounds
function FitBounds({ stores }: { stores: typeof sampleStores }) {
  const map = useMap();

  useMemo(() => {
    if (stores.length > 0) {
      const bounds = new LatLngBounds(
        stores.map((s) => [s.lat, s.lng] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [stores, map]);

  return null;
}

export function StoresPage() {
  useLanguageStore(); // Keep store subscription for future use
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedCity, setSelectedCity] = useState('الكل');
  const [showOnlyWithAlternatives, setShowOnlyWithAlternatives] = useState(false);

  const filteredStores = useMemo(() => {
    return sampleStores.filter((store) => {
      if (selectedCity !== 'الكل' && store.city !== selectedCity) return false;
      if (showOnlyWithAlternatives && !store.hasAlternatives) return false;
      return true;
    });
  }, [selectedCity, showOnlyWithAlternatives]);

  // Libya center coordinates
  const libyaCenter: [number, number] = [32.4, 17.0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-dark-100 mb-2">
          <span className="text-gradient">المتاجر</span> في ليبيا
        </h1>
        <p className="text-dark-400">
          اعثر على المتاجر التي توفر البدائل المحلية
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* City Filter */}
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm text-dark-400 mb-2">المدينة</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="input"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle for alternatives only */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyWithAlternatives}
                onChange={(e) => setShowOnlyWithAlternatives(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-dark-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:absolute after:top-0.5 after:start-[2px] after:bg-dark-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
            </label>
            <span className="text-sm text-dark-300">فقط المتاجر مع بدائل</span>
          </div>

          {/* View Toggle */}
          <div className="flex bg-dark-700 rounded-xl p-1">
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'map'
                  ? 'bg-brand-600 text-white'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-brand-600 text-white'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-sm text-dark-400">
        عرض {filteredStores.length} متجر
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="glass-card overflow-hidden rounded-2xl" style={{ height: '500px' }}>
          <MapContainer
            center={libyaCenter}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            className="z-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds stores={filteredStores} />
            {filteredStores.map((store) => (
              <Marker
                key={store.id}
                position={[store.lat, store.lng]}
                icon={store.hasAlternatives ? preferredIcon : defaultIcon}
              >
                <Popup>
                  <div className="text-right min-w-[200px]" dir="rtl">
                    <h3 className="font-bold text-gray-900 mb-1">{store.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{store.address}</p>
                    {store.hasAlternatives && (
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm inline-block">
                        {store.alternativesCount} بديل متوفر
                      </div>
                    )}
                    <div className="mt-3">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        فتح في خرائط جوجل ←
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredStores.map((store) => (
            <div key={store.id} className="glass-card-hover p-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  store.hasAlternatives ? 'bg-emerald-500/20' : 'bg-dark-600'
                }`}>
                  <svg
                    className={`w-6 h-6 ${store.hasAlternatives ? 'text-emerald-400' : 'text-dark-400'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-dark-100">{store.name}</h3>
                  <p className="text-sm text-dark-400 mt-1">{store.address}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="tag-neutral">{store.city}</span>
                    {store.hasAlternatives && (
                      <span className="tag bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {store.alternativesCount} بديل
                      </span>
                    )}
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm py-2"
                >
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  الاتجاهات
                </a>
              </div>
            </div>
          ))}

          {filteredStores.length === 0 && (
            <div className="glass-card p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-bold text-dark-100 mb-2">لا توجد متاجر</h3>
              <p className="text-dark-400 text-sm">
                جرب تغيير المرشحات للعثور على متاجر
              </p>
            </div>
          )}
        </div>
      )}

      {/* Add Store CTA */}
      <div className="mt-8 glass-card p-6 text-center">
        <h3 className="font-bold text-dark-100 mb-2">هل تعرف متجراً يوفر بدائل؟</h3>
        <p className="text-dark-400 text-sm mb-4">
          ساعد المجتمع بإضافة متاجر جديدة
        </p>
        <button className="btn-outline">
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          إضافة متجر
        </button>
      </div>
    </div>
  );
}

