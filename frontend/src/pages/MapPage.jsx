import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import { MapPin, Hammer, Store, Star, Search, PlusCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [locations, setLocations] = useState([
    { id: 1, name: 'ورشة أحمد للحرف اليدوية', type: 'craftsman', lat: 30.5085, lng: 47.7835, specialty: 'أثاث كلاسيكي وخشب زان', rating: 4.9, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', address: 'البصرة، الجزائر' },
    { id: 2, name: 'معرض الألق للأثاث الراقي', type: 'showroom', lat: 30.5150, lng: 47.8100, specialty: 'غرف نوم وصالونات مودرن', rating: 4.8, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80', address: 'البصرة، الطويسة' },
    { id: 3, name: 'ورشة إبراهيم للخشب العصري', type: 'craftsman', lat: 33.3152, lng: 44.3661, specialty: 'تصاميم هندسية وديكورات', rating: 4.7, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', address: 'بغداد، الكرادة' },
    { id: 4, name: 'معرض دمشق الدولي للأثاث', type: 'showroom', lat: 33.5138, lng: 36.2765, specialty: 'أثاث دمشقي محفور بالصدف', rating: 4.9, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80', address: 'دمشق، العمارة' },
    { id: 5, name: 'ورشة النور للنجارة الحديثة', type: 'craftsman', lat: 36.1900, lng: 44.0090, specialty: 'مطابخ وتصاميم خشبية متكاملة', rating: 4.6, image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=200&q=80', address: 'أربيل، شارع عمان' }
  ]);

  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState('craftsman');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem = {
      id: locations.length + 1,
      name: newName,
      type: newType,
      lat: 30.5000 + (Math.random() * 0.03),
      lng: 47.7500 + (Math.random() * 0.03),
      specialty: newSpecialty || 'Custom Furniture',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
      address: newAddress || 'Basra, Iraq'
    };

    setLocations([newItem, ...locations]);
    setNewName('');
    setNewSpecialty('');
    setNewAddress('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    loc.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] dark:bg-[#121212] transition-colors duration-300">
      
      {/* هيدر الصفحة */}
      <section className="bg-brand-dark text-white py-16 px-6 text-center relative">
        <div className="max-w-3xl mx-auto space-y-3">
          <h1 className={`text-3xl md:text-4xl font-bold ${isAr ? '' : 'font-serif'}`}>{t('map_title')}</h1>
          <p className="text-gray-300 text-sm md:text-base font-light">{t('map_subtitle')}</p>
        </div>
      </section>

      {/* شريط البحث وبطاقة الشرح */}
      <div className="max-w-7xl mx-auto w-full px-6 md:px-16 -mt-6 relative z-30 space-y-4">
        
        <div className="bg-white dark:bg-[#1E1E1E] p-3 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-brand-gold ms-2" />
          <input 
            type="text" 
            placeholder={t('search_map_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-brand-dark dark:text-white outline-none"
          />
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-dark dark:text-white">
              <span className="w-3 h-3 rounded-full bg-brand-gold inline-block"></span>
              <Hammer className="w-4 h-4 text-brand-gold" /> {t('map_legend_craftsman')}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-dark dark:text-white">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>
              <Store className="w-4 h-4 text-blue-500" /> {t('map_legend_showroom')}
            </div>
          </div>
          <span className="text-xs text-gray-400">{t('results_count')}: {filteredLocations.length}</span>
        </div>
      </div>

      {/* الخريطة */}
      <section className="py-8 px-6 md:px-16 max-w-7xl mx-auto w-full flex flex-col">
        <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-white/10 relative z-10">
          <MapContainer center={[30.5085, 47.7835]} zoom={11} scrollWheelZoom={true} style={{ width: '100%', height: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredLocations.map((loc) => (
              <Marker 
                key={loc.id} 
                position={[loc.lat, loc.lng]}
                eventHandlers={{
                  click: () => setSelectedLocation(loc),
                }}
              >
                <Popup>
                  <div className="p-2 text-right">
                    <h4 className="font-bold text-brand-dark text-sm">{loc.name}</h4>
                    <p className="text-xs text-gray-500">{loc.specialty}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {selectedLocation && (
          <div className="mt-6 bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl shadow-xl border border-brand-gold/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src={selectedLocation.image} alt={selectedLocation.name} className="w-20 h-20 object-cover rounded-xl" />
              <div>
                <span className="text-[10px] bg-brand-gold/10 text-brand-gold font-bold px-2 py-0.5 rounded uppercase">
                  {selectedLocation.type === 'craftsman' ? (isAr ? 'ورشة حرفي' : 'Craftsman Workshop') : (isAr ? 'معرض أثاث' : 'Furniture Showroom')}
                </span>
                <h3 className="font-bold text-brand-dark dark:text-white text-lg mt-1">{selectedLocation.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{selectedLocation.address} • {selectedLocation.specialty}</p>
                <div className="flex items-center gap-1 text-brand-gold text-xs mt-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> {selectedLocation.rating} / 5
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Link to="/vendors" className="flex-grow md:flex-grow-0 bg-brand-dark dark:bg-brand-gold text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center hover:bg-brand-gold transition-colors">
                {t('visit_profile')}
              </Link>
              <button onClick={() => setSelectedLocation(null)} className="px-4 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-400 hover:text-white">{t('close')}</button>
            </div>
          </div>
        )}
      </section>

      {/* نموذج تثبيت ورشة جديدة */}
      <section className="py-12 px-6 md:px-16 max-w-4xl mx-auto w-full border-t border-gray-100 dark:border-white/10 mb-16">
        <div className="bg-white dark:bg-[#1E1E1E] p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 space-y-6">
          <div className="flex items-center gap-3">
            <PlusCircle className="w-6 h-6 text-brand-gold" />
            <h3 className={`text-xl font-bold text-brand-dark dark:text-white ${isAr ? '' : 'font-serif'}`}>{t('are_you_artisan')}</h3>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {t('artisan_subtitle')}
          </p>

          {successMsg && (
            <div className="bg-green-50 dark:bg-green-950/30 text-green-600 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4"/> {t('success_pin')}
            </div>
          )}

          <form onSubmit={handleAddLocation} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">{t('shop_name')}</label>
                <input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} placeholder={t('shop_name_placeholder')} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm outline-none dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">{t('activity_type')}</label>
                <select value={newType} onChange={(e) => setNewType(e.target.value)} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm outline-none dark:text-white">
                  <option value="craftsman">{isAr ? 'ورشة نجار معتمد' : 'Verified Craftsman Workshop'}</option>
                  <option value="showroom">{isAr ? 'معرض أثاث فاخر' : 'Luxury Furniture Showroom'}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">{t('specialty')}</label>
                <input type="text" value={newSpecialty} onChange={(e) => setNewSpecialty(e.target.value)} placeholder={t('specialty_placeholder')} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm outline-none dark:text-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">{t('address_field')}</label>
                <input type="text" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder={t('address_placeholder')} className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-sm outline-none dark:text-white" />
              </div>
            </div>

            <button type="submit" className="w-full bg-brand-dark dark:bg-brand-gold text-white font-bold py-3.5 rounded-xl hover:bg-brand-gold transition-colors shadow-lg uppercase tracking-wider text-xs">
              {t('pin_button')}
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default MapPage;
