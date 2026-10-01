import React, {
  useState,
  useEffect,
} from 'react';

import {
  useParams,
  Link,
} from 'react-router-dom';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  Clock,
  ChevronRight,
  ChevronLeft,
  Minus,
  Plus,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';

import { useTranslation } from 'react-i18next';

import { useCart } from '../context/CartContext';

import { apiFetch } from '../services/api';


/* =====================================================
   IMAGE HELPERS
===================================================== */

const extractImages = (data) => {
  if (!data) {
    return [];
  }

  const result = [];

  /*
   * images: [
   *   "https://...",
   *   "https://..."
   * ]
   */
  if (Array.isArray(data.images)) {
    data.images.forEach((image) => {
      if (
        typeof image === 'string' &&
        image.trim()
      ) {
        result.push(image.trim());

        return;
      }

      if (
        image &&
        typeof image === 'object'
      ) {
        const url =
          image.url ||
          image.image_url ||
          image.imageUrl ||
          image.src ||
          image.path;

        if (
          typeof url === 'string' &&
          url.trim()
        ) {
          result.push(url.trim());
        }
      }
    });
  }

  /*
   * images: {
   *   url: "https://..."
   * }
   */
  if (
    data.images &&
    !Array.isArray(data.images) &&
    typeof data.images === 'object'
  ) {
    const url =
      data.images.url ||
      data.images.image_url ||
      data.images.imageUrl ||
      data.images.src ||
      data.images.path;

    if (
      typeof url === 'string' &&
      url.trim()
    ) {
      result.push(url.trim());
    }
  }

  /*
   * الحقول المحتملة للصورة
   */
  const fields = [
    'image',
    'image_url',
    'imageUrl',
    'photo',
    'photo_url',
    'photoUrl',
    'thumbnail',
    'thumbnail_url',
    'thumbnailUrl',
  ];

  fields.forEach((field) => {
    if (
      typeof data[field] === 'string' &&
      data[field].trim()
    ) {
      result.push(
        data[field].trim()
      );
    }
  });

  return [
    ...new Set(result),
  ];
};


/* =====================================================
   FALLBACK IMAGE
===================================================== */

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80';


/* =====================================================
   COMPONENT
===================================================== */

const ProductDetails = () => {
  const { id } = useParams();

  const {
    t,
    i18n,
  } = useTranslation();

  const isAr =
    i18n.language === 'ar';

  const {
    addToCart,
  } = useCart();

  const [
    quantity,
    setQuantity,
  ] = useState(1);

  const [
    selectedColor,
    setSelectedColor,
  ] = useState(0);

  const [
    mainImage,
    setMainImage,
  ] = useState(0);

  const [
    isLiked,
    setIsLiked,
  ] = useState(false);

  const [
    product,
    setProduct,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState('');

  const [
    reviewsList,
    setReviewsList,
  ] = useState([
    {
      name: 'فاطمة علي',
      rating: 5,
      date: '2026-08-10',
      comment:
        'التصميم فخم جداً وخشب الزان متين ومريح في الاستخدام الحقيقي.',
      photo:
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
    },

    {
      name: 'محمد حسن',
      rating: 4,
      date: '2026-07-22',
      comment:
        'التوصيل كان في الموعد، واللون مطابق تماماً للصور.',
      photo:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80',
    },
  ]);

  const [
    newComment,
    setNewComment,
  ] = useState('');

  const [
    newRating,
    setNewRating,
  ] = useState(5);

  const [
    showReviewModal,
    setShowReviewModal,
  ] = useState(false);


  /* =====================================================
     FETCH PRODUCT
  ===================================================== */

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');

      try {
        const data =
          await apiFetch(
            `/products/${id}`
          );

        console.log(
          'PRODUCT API DATA:',
          data
        );

        const lang =
          i18n.language || 'en';

        const images =
          extractImages(data);

        console.log(
          'EXTRACTED PRODUCT IMAGES:',
          images
        );

        const finalImages =
          images.length > 0
            ? images
            : [FALLBACK_IMAGE];

        const title =
          data.title?.[lang] ||
          data.title?.en ||
          data.title ||
          'Product';

        const description =
          data.description?.[lang] ||
          data.description?.en ||
          data.description ||
          '';

        const material =
          data.material?.[lang] ||
          data.material?.en ||
          data.material ||
          '';

        const colors =
          Array.isArray(data.colors) &&
          data.colors.length > 0
            ? data.colors
            : [
                {
                  name: 'Default',
                  code: '#000000',
                },
              ];

        const normalizedProduct = {
          id: data.id,

          title,

          price:
            Number(data.price) || 0,

          rating:
            Number(data.rating) || 0,

          reviewsCount:
            Number(
              data.reviews_count
            ) || 0,

          desc: description,

          dimensions:
            data.dimensions || '',

          material,

          images: finalImages,

          colors,

          isCustomizable:
            Boolean(
              data.is_customizable
            ),
        };

        console.log(
          'NORMALIZED PRODUCT:',
          normalizedProduct
        );

        setProduct(
          normalizedProduct
        );

        setMainImage(0);

      } catch (err) {
        console.error(
          'Failed to fetch product:',
          err
        );

        setError(
          err?.message ||
          'Failed to load product'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();

  }, [
    id,
    i18n.language,
  ]);


  /* =====================================================
     ADD TO CART
  ===================================================== */

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    const image =
      product.images?.[0] ||
      FALLBACK_IMAGE;

    console.log(
      'ADDING PRODUCT TO CART:',
      {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity,
        image,
        images: product.images,
      }
    );

    addToCart({
      id: product.id,

      title:
        product.title,

      price:
        product.price,

      quantity:
        quantity,

      image:

        image,

      images:
        product.images,
    });
  };


  /* =====================================================
     ADD REVIEW
  ===================================================== */

  const handleAddReview = (e) => {
    e.preventDefault();

    if (
      !newComment.trim()
    ) {
      return;
    }

    const review = {
      name: 'ملاك مهدي',

      rating:
        newRating,

      date:
        new Date()
          .toISOString()
          .split('T')[0],

      comment:
        newComment,

      photo:
        product?.images?.[0] ||
        FALLBACK_IMAGE,
    };

    setReviewsList(
      (prev) => [
        review,
        ...prev,
      ]
    );

    setNewComment('');

    setNewRating(5);

    setShowReviewModal(false);
  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FDFCFB] dark:bg-[#121212] items-center justify-center">

        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold" />

      </div>
    );
  }


  /* =====================================================
     ERROR
  ===================================================== */

  if (
    error ||
    !product
  ) {
    return (
      <div className="flex flex-col min-h-screen bg-[#FDFCFB] dark:bg-[#121212] items-center justify-center">

        <div className="text-red-500">
          {error ||
            'Product not found'}
        </div>

      </div>
    );
  }


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCFB] dark:bg-[#121212] transition-colors duration-300">

      {/* =================================================
          BREADCRUMB
      ================================================= */}

      <div className="pt-8 px-6 md:px-16 max-w-7xl mx-auto w-full text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">

        <Link
          to="/"
          className="hover:text-brand-gold transition-colors"
        >
          {t('furniture')}
        </Link>

        {isAr ? (
          <ChevronLeft className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}

        <span className="text-brand-dark dark:text-white font-medium">
          {product.title}
        </span>

      </div>


      {/* =================================================
          PRODUCT
      ================================================= */}

      <section className="py-8 px-6 md:px-16 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-12 lg:gap-20">

        {/* IMAGES */}

        <div className="w-full lg:w-1/2 flex flex-col gap-4">

          {/* MAIN IMAGE */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="w-full h-[400px] md:h-[550px] bg-white dark:bg-[#1E1E1E] rounded-2xl p-8 flex items-center justify-center border border-gray-100 dark:border-white/10 shadow-sm relative group overflow-hidden"
          >

            <img
              src={
                product.images[
                  mainImage
                ] ||
                FALLBACK_IMAGE
              }
              alt={
                product.title
              }
              className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                if (
                  e.currentTarget.src !==
                  FALLBACK_IMAGE
                ) {
                  e.currentTarget.src =
                    FALLBACK_IMAGE;
                }
              }}
            />

          </motion.div>


          {/* THUMBNAILS */}

          <div className="flex gap-4 flex-wrap">

            {product.images.map(
              (img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() =>
                    setMainImage(idx)
                  }
                  className={`w-24 h-24 bg-white dark:bg-[#1E1E1E] rounded-xl p-2 cursor-pointer border-2 transition-colors ${
                    mainImage === idx
                      ? 'border-brand-gold'
                      : 'border-transparent hover:border-gray-200 dark:border-white/10 dark:hover:border-white/20'
                  }`}
                >

                  <img
                    src={img}
                    alt={`${product.title} ${idx + 1}`}
                    className="w-full h-full object-cover rounded-md"
                    onError={(
                      e
                    ) => {
                      e.currentTarget.src =
                        FALLBACK_IMAGE;
                    }}
                  />

                </button>
              )
            )}

          </div>

        </div>


        {/* PRODUCT INFO */}

        <div className="w-full lg:w-1/2 flex flex-col pt-4">

          <motion.h1
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className={`text-3xl md:text-4xl font-bold text-brand-dark dark:text-white mb-2 ${
              isAr
                ? ''
                : 'font-serif'
            }`}
          >
            {product.title}
          </motion.h1>


          {/* RATING */}

          <div className="flex items-center gap-4 mb-6">

            <div className="flex text-brand-gold">

              {[...Array(5)].map(
                (_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i <
                      product.rating
                        ? 'fill-current'
                        : 'text-gray-200 dark:text-gray-700'
                    }`}
                  />
                )
              )}

            </div>

            <span className="text-sm text-gray-500 dark:text-gray-400 underline">
              {product.reviewsCount}{' '}
              {t('reviews')}
            </span>

          </div>


          {/* PRICE */}

          <div
            className="text-3xl font-bold text-brand-dark dark:text-white mb-8"
            style={{
              fontFamily:
                "'Playfair Display', serif",
            }}
          >
            $
            {Number(
              product.price
            ).toFixed(2)}
          </div>


          {/* COLORS */}

          <div className="mb-8">

            <h3 className="text-sm font-semibold text-brand-dark dark:text-white mb-3 uppercase tracking-wider">
              {t('colors')}
            </h3>

            <div className="flex gap-3">

              {product.colors.map(
                (color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setSelectedColor(
                        idx
                      )
                    }
                    className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center transition-all ${
                      selectedColor ===
                      idx
                        ? 'ring-2 ring-offset-2 ring-brand-dark dark:ring-white scale-110'
                        : 'ring-1 ring-gray-200 dark:ring-white/20 hover:scale-110'
                    }`}
                    style={{
                      backgroundColor:
                        color.code ||
                        '#000000',
                    }}
                    title={
                      color.name ||
                      ''
                    }
                  />
                )
              )}

            </div>

          </div>


          {/* QUANTITY + CART */}

          <div className="flex flex-col sm:flex-row gap-4 mb-10 border-b border-gray-100 dark:border-white/10 pb-10">

            <div className="flex items-center justify-between border border-gray-300 dark:border-white/20 rounded-md w-full sm:w-32 px-4 py-3 bg-white dark:bg-[#1E1E1E]">

              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    Math.max(
                      1,
                      quantity - 1
                    )
                  )
                }
                className="text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="font-bold text-brand-dark dark:text-white">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() =>
                  setQuantity(
                    quantity + 1
                  )
                }
                className="text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </button>

            </div>


            <motion.button
              type="button"
              onClick={
                handleAddToCart
              }
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="flex-grow bg-brand-dark dark:bg-brand-gold text-white font-bold py-3 rounded-md flex items-center justify-center gap-2 hover:bg-brand-gold dark:hover:bg-brand-gold/80 transition-colors shadow-lg cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />

              {t('add_to_cart')}

            </motion.button>


            <motion.button
              type="button"
              onClick={() =>
                setIsLiked(
                  !isLiked
                )
              }
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.9,
              }}
              className={`w-full sm:w-14 flex items-center justify-center border rounded-md transition-colors bg-white dark:bg-[#1E1E1E] ${
                isLiked
                  ? 'border-red-500 text-red-500'
                  : 'border-gray-300 dark:border-white/20 text-gray-500 dark:text-gray-400 hover:text-red-500'
              }`}
            >

              <Heart
                className={`w-5 h-5 ${
                  isLiked
                    ? 'fill-red-500 text-red-500'
                    : ''
                }`}
              />

            </motion.button>

          </div>


          {/* DESCRIPTION */}

          <div className="space-y-6">

            <div>

              <h3 className="text-sm font-semibold text-brand-dark dark:text-white mb-2 uppercase tracking-wider">
                {t('description')}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {product.desc}
              </p>

            </div>


            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-white/10">

              <div>

                <h3 className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">
                  {t('dimensions')}
                </h3>

                <p className="text-sm font-bold text-brand-dark dark:text-white">
                  {product.dimensions}
                </p>

              </div>

              <div>

                <h3 className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wider">
                  {t('material')}
                </h3>

                <p className="text-sm font-bold text-brand-dark dark:text-white">
                  {product.material}
                </p>

              </div>

            </div>

          </div>


          {/* FEATURES */}

          <div className="mt-10 bg-gray-50 dark:bg-[#1E1E1E] p-6 rounded-xl space-y-4 border border-gray-100 dark:border-white/10">

            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
              <Truck className="w-5 h-5 text-brand-gold" />
              {t('free_shipping')}
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
              <ShieldCheck className="w-5 h-5 text-brand-gold" />
              {t('guarantee')}
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
              <Clock className="w-5 h-5 text-brand-gold" />
              {t('support_247')}
            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          REVIEWS
      ================================================= */}

      <section className="py-16 px-6 md:px-16 max-w-7xl mx-auto w-full border-t border-gray-100 dark:border-white/10 mt-12">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">

          <div>

            <h3 className="text-2xl font-bold text-brand-dark dark:text-white mb-1">
              آراء العملاء الموثوقة
            </h3>

            <p className="text-gray-500 dark:text-gray-400 text-xs">
              صور حقيقية وتقييمات من عملاء اقتنوا القطعة
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setShowReviewModal(
                true
              )
            }
            className="bg-brand-gold text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-gold/80 transition-colors shadow-md flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />

            أضف تقييمك

          </button>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {reviewsList.map(
            (rev, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 flex gap-6 items-start"
              >

                <img
                  src={
                    rev.photo ||
                    FALLBACK_IMAGE
                  }
                  alt="Customer"
                  className="w-24 h-24 object-cover rounded-xl bg-gray-100 flex-shrink-0"
                  onError={(
                    e
                  ) => {
                    e.currentTarget.src =
                      FALLBACK_IMAGE;
                  }}
                />

                <div className="space-y-2 flex-grow">

                  <div className="flex justify-between items-center">

                    <h4 className="font-bold text-brand-dark dark:text-white text-sm">
                      {rev.name}
                    </h4>

                    <span className="text-xs text-gray-400">
                      {rev.date}
                    </span>

                  </div>

                  <div className="flex text-brand-gold">

                    {[...Array(5)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i <
                            rev.rating
                              ? 'fill-current'
                              : 'text-gray-200 dark:text-gray-700'
                          }`}
                        />
                      )
                    )}

                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-xs leading-relaxed">
                    {rev.comment}
                  </p>

                  <span className="inline-flex items-center gap-1 text-[10px] text-green-600 font-semibold bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded">

                    <CheckCircle className="w-3 h-3" />

                    مشتري موثق

                  </span>

                </div>

              </div>
            )
          )}

        </div>

      </section>


      {/* =================================================
          REVIEW MODAL
      ================================================= */}

      <AnimatePresence>

        {showReviewModal && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6 backdrop-blur-sm">

            <motion.div
              initial={{
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.9,
                opacity: 0,
              }}
              className="bg-white dark:bg-[#1E1E1E] w-full max-w-lg rounded-2xl p-8 relative shadow-2xl border border-gray-100 dark:border-white/10"
            >

              <h3 className="text-xl font-bold text-brand-dark dark:text-white mb-6">
                شاركنا رأيك في المنتج
              </h3>


              <form
                onSubmit={
                  handleAddReview
                }
                className="space-y-4"
              >

                <div>

                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    التقييم بالنجوم
                  </label>

                  <select
                    value={
                      newRating
                    }
                    onChange={(e) =>
                      setNewRating(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg p-3 text-sm outline-none dark:text-white"
                  >

                    <option value={5}>
                      ⭐⭐⭐⭐⭐ (5/5 ممتاز)
                    </option>

                    <option value={4}>
                      ⭐⭐⭐⭐ (4/5 جيد جداً)
                    </option>

                    <option value={3}>
                      ⭐⭐⭐ (3/5 متوسط)
                    </option>

                  </select>

                </div>


                <div>

                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    تعليقك الكريم
                  </label>

                  <textarea
                    rows="3"
                    required
                    value={
                      newComment
                    }
                    onChange={(e) =>
                      setNewComment(
                        e.target.value
                      )
                    }
                    placeholder="اكتب تجربتك مع جودة القطعة والتوصيل..."
                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-lg p-3 text-sm outline-none resize-none dark:text-white"
                  />

                </div>


                <div className="flex gap-4 pt-4">

                  <button
                    type="submit"
                    className="flex-grow bg-brand-dark dark:bg-brand-gold text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-brand-gold"
                  >
                    إرسال التقييم
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setShowReviewModal(
                        false
                      )
                    }
                    className="px-5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-gray-500 dark:text-gray-400"
                  >
                    إلغاء
                  </button>

                </div>

              </form>

            </motion.div>

          </div>
        )}

      </AnimatePresence>


      <div className="pb-24" />

    </div>
  );
};

export default ProductDetails;