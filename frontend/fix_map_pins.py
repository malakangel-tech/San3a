import os

path = "src/pages/Map.jsx"

full_map_code = """import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useTranslation } from 'react-i18next';
import { MapPin, Plus, Store, Wrench, Search, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const defaultShops = [
  { id: 1, name: 'ورشة الفن العريق', type: 'craftsman', lat: 30.5081, lng: 47.7835, city: 'البصرة - الجبيلة', specialty: 'غرف نوم خشبي فاخر' },
  { id: 2, name: 'معرض الأثاث الملكي', type: 'company', lat: 30.5150, lng: 47.8100, city: 'البصرة - العشار', specialty: 'طاولات ومطابخ حديثة' }
];

const MapPage = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [shops, setShops] = useState(defaultShops);
  const [searchQuery, setSearchQuery] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopType, setShopType] = useState('craftsman');
  const [specialty, setSpecialty] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCoords, setSelectedCoords] = useState({ lat: 30.5081, lng: 47.7835 });
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    try {
      const savedShops = JSON.parse(localStorage.getItem('mapShops') || '[]');
      if (savedShops.length > 0) {
        setShops([...defaultShops, ...savedShops]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleAddShop = (e) => {
    e.preventDefault();
    if (!shopName || !address) return;

    // توليد موقع عشوائي محلي قريب من المركز للتبسيط والتثبيت
    const newLat = 30.5000 + (Math.random() * 0.03);
    const newLng = 47.7800 + (Math.random() * 0.04);

    const newShop = {
      id: Date.now(),
      name: shopName,
      type: shopType,
      lat: newLat,
      lng: newLng,
      city: address,
      specialty: specialty || (shopType === 'craftsman' ? 'نجارة عامة' : 'معرض أثاث')
    };

    const updatedShops = [newShop, ...shops];
    setShops(updatedShops);

    const localSaved = JSON.parse(localStorage.getItem('mapShops') || '[]');
    localStorage.setItem('mapShops', JSON.stringify([newShop, ...localSaved]));

    setShopName('');
    setSpecialty('');
    setAddress('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  const filteredShops = shops.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-[#121212] transition-colors duration-300 py-6 px-4 md:px-12 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-brand-dark text-white p-6 md:p-8 rounded-2xl shadow-lg text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">{isAr ? 'خريطة ورش الحرفيين والمعارض' : 'Craftsmen & Showrooms Map'}</h1>
        <p className="text-xs text-gray-300 max-w-xl mx-auto">{isAr ? 'تصفح خريطة العالم واكتشف أقرب النجارين ومعارض الأثاث الفاخر في مدينتك.' : 'Discover carpenters and furniture showrooms near you.'}</p>
      </div>

      {/* Search Filter Bar */}
      <div className="max-w-md mx-auto relative">
        <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={isAr ? 'ابحث عن اسم النجار، الورشة، أو المدينة...' : 'Search by name, workshop, or city...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-xl p-3 pr-10 text-xs outline-none dark:text-white shadow-sm"
        />
      </div>

      {/* Interactive Map View */}
      <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-md h-[400px] relative z-0">
        <MapContainer center={[30.5081, 47.7835]} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredShops.map((shop) => (
            <Marker key={shop.id} position={[shop.lat, shop.lng]}>
              <Popup>
                <div className="p-1 text-right dir-rtl space-y-1">
                  <h4 className="font-bold text-sm text-brand-dark">{shop.name}</h4>
                  <p className="text-[11px] text-brand-gold font-semibold">{shop.specialty}</p>
                  <p className="text-[10px] text-gray-500">{shop.city}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Form to Pin Location */}
      <div className="max-w-2xl mx-auto bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 space-y-4">
        <div className="text-center space-y-1">
          <h3 className="font-bold text-brand-dark dark:text-white text-base flex items-center justify-center gap-2">
            <Plus className="w-5 h-5 text-brand-gold" />
            {isAr ? 'هل أنت نجار أو صاحب محل؟ ثبت موقعك على الخريطة' : 'Pin Your Workshop on Map'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{isAr ? 'أدخل بيانات ورشتك أو معرضك لكي تظهر للزبائن مباشرة على الخريطة التفاعلية.' : 'Enter details to display your shop.'}</p>
        </div>

        {successMsg && (
          <div className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 p-3 rounded-xl text-xs font-bold text-center">
            {isAr ? '🎉 تم تثبيت موقع ورشتك بنجاح ونشره على الخريطة!' : 'Location pinned successfully on the map!'}
          </div>
        )}

        <form onSubmit={handleAddShop} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'اسم الورشة أو المحل' : 'Shop Name'}</label>
            <input
              type="text"
              required
              placeholder={isAr ? 'مثال: ورشة البصرة المبتكرة' : 'e.g. Basra Workshop'}
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'نوع النشاط' : 'Type'}</label>
            <select
              value={shopType}
              onChange={(e) => setShopType(e.target.value)}
              className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white"
            >
              <option value="craftsman">{isAr ? 'ورشة نجار مستقل' : 'Independent Craftsman'}</option>
              <option value="company">{isAr ? 'معرض أثاث / شركة' : 'Furniture Showroom'}</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'التخصص / الخدمات' : 'Specialty'}</label>
            <input
              type="text"
              placeholder={isAr ? 'مثال: تفصيل غرف نوم، طاولات' : 'e.g. Bedrooms, Tables'}
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-600 dark:text-gray-300 mb-1">{isAr ? 'العنوان (المدينة والمنطقة)' : 'City / Area'}</label>
            <input
              type="text"
              required
              placeholder={isAr ? 'مثال: البصرة - الجزائر' : 'e.g. Basra - Al Jazair'}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 outline-none dark:text-white"
            />
          </div>

          <div className="md:col-span-2 pt-2">
            <button
              type="submit"
              className="w-full bg-brand-dark dark:bg-brand-gold text-white font-bold py-3.5 rounded-xl uppercase tracking-wider hover:bg-brand-gold transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>{isAr ? 'تثبيت الموقع على الخريطة' : 'Pin Location On Map'}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default MapPage;
"""

with open(path, "w", encoding="utf-8") as f:
    f.write(full_map_code)

print("✅ تم تفعيل زر تثبيت الموقع على الخريطة وحفظ العلامات بنجاح!")
