
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Tag,
  ImageOff,
} from 'lucide-react';

import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const {
    cartOpen,
    setCartOpen,
    cartItems,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
  } = useCart();

  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [applied, setApplied] = useState(false);

  const applyPromo = () => {
    if (promoCode.trim().toLowerCase() === 'san3a10') {
      setDiscount(0.1);
      setApplied(true);
    } else {
      setDiscount(0);
      setApplied(false);

      alert(
        isAr
          ? 'كود الخصم غير صحيح (جرب San3a10)'
          : 'Invalid promo code (Try San3a10)'
      );
    }
  };

  const finalTotal = Math.round(
    totalPrice * (1 - discount)
  );

  const getImage = (item) => {
    if (!item) return null;

    if (
      typeof item.image === 'string' &&
      item.image.trim()
    ) {
      return item.image;
    }

    if (
      typeof item.image_url === 'string' &&
      item.image_url.trim()
    ) {
      return item.image_url;
    }

    if (
      typeof item.imageUrl === 'string' &&
      item.imageUrl.trim()
    ) {
      return item.imageUrl;
    }

    if (Array.isArray(item.images)) {
      const first = item.images[0];

      if (typeof first === 'string') {
        return first;
      }

      if (first?.url) {
        return first.url;
      }

      if (first?.image_url) {
        return first.image_url;
      }
    }

    return null;
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
          />

          <motion.div
            initial={{
              x: isAr ? '-100%' : '100%',
            }}
            animate={{ x: 0 }}
            exit={{
              x: isAr ? '-100%' : '100%',
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 200,
            }}
            className={`fixed top-0 ${
              isAr ? 'left-0' : 'right-0'
            } w-full max-w-md h-full bg-white dark:bg-[#1E1E1E] shadow-2xl z-50 flex flex-col`}
          >

            {/* HEADER */}
            <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-dark dark:text-white font-bold text-xl">
                <ShoppingBag className="w-6 h-6 text-brand-gold" />

                {t('cart_title')} ({totalItems})
              </div>

              <button
                onClick={() => setCartOpen(false)}
                className="p-2 text-gray-400 hover:text-brand-dark dark:hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* PRODUCTS */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">

              {cartItems.length > 0 ? (

                cartItems.map((item) => {

                  const image = getImage(item);

                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 items-center bg-gray-50 dark:bg-[#121212] p-4 rounded-xl border border-gray-100 dark:border-white/10"
                    >

                      {/* IMAGE */}
                      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white dark:bg-[#1E1E1E] flex items-center justify-center">

                        {image ? (
                          <img
                            src={image}
                            alt={item.title || 'Product'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                'none';

                              const fallback =
                                e.currentTarget.parentElement?.querySelector(
                                  '.image-fallback'
                                );

                              if (fallback) {
                                fallback.style.display =
                                  'flex';
                              }
                            }}
                          />
                        ) : null}

                        <div
                          className={`image-fallback ${
                            image ? 'hidden' : 'flex'
                          } w-full h-full items-center justify-center text-gray-300`}
                        >
                          <ImageOff className="w-8 h-8" />
                        </div>

                      </div>

                      {/* DETAILS */}
                      <div className="flex-grow min-w-0">

                        <h4 className="font-bold text-brand-dark dark:text-white text-sm mb-1 truncate">
                          {item.title}
                        </h4>

                        <p className="text-brand-gold font-bold text-sm mb-3">
                          $
                          {(
                            Number(item.price || 0) *
                            Number(item.quantity || 1)
                          ).toFixed(2)}
                        </p>

                        <div className="flex items-center justify-between">

                          {/* QUANTITY */}
                          <div className="flex items-center border border-gray-200 dark:border-white/10 rounded bg-white dark:bg-[#1E1E1E]">

                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  -1
                                )
                              }
                              className="p-1 px-2 text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            <span className="px-2 text-xs font-bold text-gray-700 dark:text-white">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  1
                                )
                              }
                              className="p-1 px-2 text-gray-500 dark:text-gray-400 hover:text-brand-dark dark:hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>

                          </div>

                          {/* DELETE */}
                          <button
                            onClick={() =>
                              removeFromCart(item.id)
                            }
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                      </div>
                    </div>
                  );
                })

              ) : (

                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
                  <ShoppingBag className="w-16 h-16 stroke-1 text-gray-300" />

                  <p className="text-base">
                    {t('cart_empty')}
                  </p>
                </div>

              )}

            </div>

            {/* FOOTER */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#121212] space-y-4">

                {/* PROMO */}
                <div className="flex gap-2">

                  <div className="relative flex-grow">

                    <Tag
                      className={`absolute top-3 ${
                        isAr
                          ? 'right-3'
                          : 'left-3'
                      } w-4 h-4 text-gray-400`}
                    />

                    <input
                      type="text"
                      placeholder={
                        isAr
                          ? 'كود الخصم (جرب San3a10)'
                          : 'Promo code (Try San3a10)'
                      }
                      value={promoCode}
                      onChange={(e) =>
                        setPromoCode(e.target.value)
                      }
                      className={`w-full bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-lg py-2.5 ${
                        isAr
                          ? 'pr-9 pl-3'
                          : 'pl-9 pr-3'
                      } text-xs outline-none focus:border-brand-gold`}
                    />

                  </div>

                  <button
                    onClick={applyPromo}
                    className="bg-brand-dark text-white px-4 rounded-lg text-xs font-bold hover:bg-brand-gold transition-colors"
                  >
                    {isAr ? 'تطبيق' : 'Apply'}
                  </button>

                </div>

                {applied && (
                  <p className="text-xs text-green-600 font-semibold">
                    {isAr
                      ? '✨ تم تطبيق خصم 10% بنجاح!'
                      : '✨ 10% discount applied successfully!'}
                  </p>
                )}

                {/* TOTAL */}
                <div className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300 pt-2 border-t border-gray-200 dark:border-white/10">

                  <div className="flex justify-between">
                    <span>{t('subtotal')}:</span>

                    <span className="font-bold">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {applied && (
                    <div className="flex justify-between text-green-600">
                      <span>
                        {isAr
                          ? 'الخصم:'
                          : 'Discount:'}
                      </span>

                      <span>
                        -$
                        {Math.round(
                          totalPrice * discount
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-lg font-bold text-brand-dark dark:text-white pt-2 border-t border-gray-200 dark:border-white/10">

                    <span>
                      {isAr
                        ? 'الإجمالي الكلي:'
                        : 'Total:'}
                    </span>

                    <span
                      className="text-brand-gold"
                      style={{
                        fontFamily:
                          "'Playfair Display', serif",
                      }}
                    >
                      ${finalTotal}
                    </span>

                  </div>

                </div>

                {/* CHECKOUT */}
                <motion.button
                  onClick={() => {
                    setCartOpen(false);
                    navigate('/checkout');
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-brand-dark text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-gold transition-colors shadow-lg uppercase tracking-wider text-sm cursor-pointer"
                >
                  {t('checkout')}

                  {isAr ? (
                    <ArrowLeft className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </motion.button>

              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
