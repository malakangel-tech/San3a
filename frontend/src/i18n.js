import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      furniture: "Furniture", custom: "Custom", vendors: "Vendors", login: "Sign in", register: "Sign up",
      hero_tag: "Crafted for Your Space", hero_title: "Design Your Space.<br/>Made for You.", hero_desc: "Acquire furniture designed with love and taste.",
      btn_explore: "Explore Furniture", btn_custom: "Customize Your Furniture", category: "Category", living: "Living Room", bedroom: "Bedroom", dining: "Dining Room",
      marketplace: "Trending Collection", quick_view: "Quick View", add_to_cart: "Add to Cart", save: "Save", customize: "Customize", customizable: "Customizable",
      top_vendors: "Elite Craftsmen", view_profile: "View Profile", specialty_classic: "Classic", specialty_modern: "Modern",
      footer_desc: "The premier destination for luxury custom furniture.", links: "Quick Links", support: "Support", contact: "Contact Us",
      vendors_hero_title: "Our Elite Craftsmen", vendors_hero_desc: "Discover the masterful hands behind our bespoke furniture.",
      search_vendor: "Search craftsmen...", filter_all: "All Specialties", filter_classic: "Classic", filter_modern: "Modern", verified: "Verified", projects: "Projects", experience: "Years Exp.", location: "Location", filters: "Filters", sort_by: "Sort by", highest_rated: "Highest Rated",
      welcome_back: "Welcome Back", login_desc: "Enter your credentials.", email: "Email", password: "Password", forgot_password: "Forgot Password?", sign_in_btn: "Sign In", no_account: "Don't have an account?", create_account: "Create one",
      about_vendor: "About Craftsman", portfolio: "Portfolio", hire_me: "Request Custom Design", contact_vendor: "Message", reviews: "Reviews", back_to_vendors: "Back to Vendors", vendor_not_found: "Craftsman not found.",
      // نصوص تفاصيل المنتج
      product_not_found: "Product not found.", colors: "Available Colors", dimensions: "Dimensions", material: "Material", 
      quantity: "Quantity", buy_now: "Buy Now", description: "Description", related_products: "Related Products",
      free_shipping: "Free shipping on orders over $1000", support_247: "24/7 Premium Customer Support", guarantee: "5-Year Craftsmanship Guarantee"
    }
  },
  ar: {
    translation: {
      furniture: "الأثاث", custom: "تفصيل خاص", vendors: "النجارين", login: "تسجيل الدخول", register: "حساب جديد",
      hero_tag: "صُنِعَ لِمساحتك", hero_title: "صمم مساحتك.<br/>صُنعت لأجلك.", hero_desc: "اقتنِ أثاثاً مصمماً بحب وذوق.",
      btn_explore: "استكشف الأثاث", btn_custom: "فصّل أثاثك", category: "الأقسام", living: "غرفة المعيشة", bedroom: "غرفة النوم", dining: "غرفة الطعام",
      marketplace: "التشكيلة الرائجة", quick_view: "نظرة سريعة", add_to_cart: "أضف للسلة", save: "حفظ", customize: "تخصيص", customizable: "قابل للتخصيص",
      top_vendors: "نخبة النجارين", view_profile: "عرض الملف", specialty_classic: "كلاسيكي", specialty_modern: "حديث",
      footer_desc: "الوجهة الأولى لتفصيل واقتناء الأثاث الفاخر.", links: "روابط سريعة", support: "الدعم والمساعدة", contact: "تواصل معنا",
      vendors_hero_title: "نخبة الحرفيين", vendors_hero_desc: "اكتشف الأيادي الماهرة التي تصنع أثاثك.",
      search_vendor: "ابحث عن الحرفيين...", filter_all: "كل التخصصات", filter_classic: "كلاسيكي", filter_modern: "حديث", verified: "موثوق", projects: "مشروع", experience: "سنوات خبرة", location: "الموقع", filters: "التصفية المتقدمة", sort_by: "ترتيب حسب", highest_rated: "الأعلى تقييماً",
      welcome_back: "مرحباً بعودتك", login_desc: "أدخل بياناتك للوصول.", email: "البريد الإلكتروني", password: "كلمة المرور", forgot_password: "هل نسيت كلمة المرور؟", sign_in_btn: "تسجيل الدخول", no_account: "ليس لديك حساب؟", create_account: "أنشئ حساباً جديداً",
      about_vendor: "نبذة عن الحرفي", portfolio: "معرض الأعمال", hire_me: "طلب تفصيل خاص", contact_vendor: "مراسلة", reviews: "تقييمات", back_to_vendors: "العودة لقائمة النجارين", vendor_not_found: "لم يتم العثور على الحرفي.",
      // نصوص تفاصيل المنتج
      product_not_found: "المنتج غير موجود.", colors: "الألوان المتاحة", dimensions: "الأبعاد", material: "الخامة", 
      quantity: "الكمية", buy_now: "اشترِ الآن", description: "الوصف والتفاصيل", related_products: "منتجات قد تعجبك",
      free_shipping: "شحن مجاني للطلبات فوق 1000$", support_247: "دعم فني متميز على مدار الساعة", guarantee: "ضمان جودة الصناعة لمدة 5 سنوات"
    }
  }
};

i18n.use(LanguageDetector).use(initReactI18next).init({ resources, fallbackLng: 'ar', interpolation: { escapeValue: false } });
export default i18n;
