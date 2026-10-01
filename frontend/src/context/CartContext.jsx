import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const CartContext = createContext(null);

/**
 * يحاول استخراج صورة المنتج مهما كان اسم الحقل
 * القادم من الـ API.
 */
const getProductImages = (product) => {
  if (!product) return [];

  const images = [];

  // images: ["url1", "url2"]
  if (Array.isArray(product.images)) {
    product.images.forEach((img) => {
      if (typeof img === 'string' && img.trim()) {
        images.push(img.trim());
        return;
      }

      if (img && typeof img === 'object') {
        const url =
          img.url ||
          img.image_url ||
          img.imageUrl ||
          img.src ||
          img.path;

        if (typeof url === 'string' && url.trim()) {
          images.push(url.trim());
        }
      }
    });
  }

  // images: { url: "..." }
  if (
    product.images &&
    !Array.isArray(product.images) &&
    typeof product.images === 'object'
  ) {
    const url =
      product.images.url ||
      product.images.image_url ||
      product.images.imageUrl ||
      product.images.src ||
      product.images.path;

    if (typeof url === 'string' && url.trim()) {
      images.push(url.trim());
    }
  }

  // الحقول الفردية
  const singleImageFields = [
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

  for (const field of singleImageFields) {
    if (
      typeof product[field] === 'string' &&
      product[field].trim()
    ) {
      images.push(product[field].trim());
    }
  }

  // حذف التكرار
  return [...new Set(images)];
};

const getProductImage = (product) => {
  const images = getProductImages(product);

  return images.length > 0 ? images[0] : null;
};

export const CartProvider = ({ children }) => {
  const [cartOpen, setCartOpen] = useState(false);

  /**
   * تحميل السلة من localStorage
   */
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('san3a_cart');

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      if (!Array.isArray(parsedCart)) {
        return [];
      }

      // تنظيف البيانات القديمة
      return parsedCart.map((item) => {
        const images = getProductImages(item);

        return {
          ...item,
          id: item.id,
          title: item.title || item.name || 'Product',
          price: Number(item.price) || 0,
          image:
            images[0] ||
            item.image ||
            null,
          images,
          quantity: Number(item.quantity) || 1,
        };
      });
    } catch (error) {
      console.error(
        'Failed to load cart:',
        error
      );

      return [];
    }
  });

  /**
   * حفظ السلة
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        'san3a_cart',
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error(
        'Failed to save cart:',
        error
      );
    }
  }, [cartItems]);

  /**
   * إضافة منتج للسلة
   */
  const addToCart = (product) => {
    if (!product) {
      console.error(
        'Cannot add empty product to cart'
      );
      return;
    }

    const images = getProductImages(product);

    const image =
      images[0] ||
      getProductImage(product);

    const normalizedProduct = {
      ...product,

      id: product.id,

      title:
        product.title ||
        product.name ||
        'Product',

      price:
        Number(product.price) ||
        Number(product.price_usd) ||
        0,

      image: image || null,

      images,

      quantity:
        Number(product.quantity) > 0
          ? Number(product.quantity)
          : 1,
    };

    console.log(
      '=============================='
    );

    console.log(
      'PRODUCT ADDED TO CART:',
      normalizedProduct
    );

    console.log(
      'PRODUCT IMAGE:',
      normalizedProduct.image
    );

    console.log(
      'PRODUCT IMAGES:',
      normalizedProduct.images
    );

    console.log(
      '=============================='
    );

    setCartItems((prevItems) => {
      const existingItem =
        prevItems.find(
          (item) =>
            String(item.id) ===
            String(normalizedProduct.id)
        );

      if (existingItem) {
        return prevItems.map((item) => {
          if (
            String(item.id) !==
            String(normalizedProduct.id)
          ) {
            return item;
          }

          const oldImages =
            getProductImages(item);

          const finalImages =
            normalizedProduct.images.length > 0
              ? normalizedProduct.images
              : oldImages;

          return {
            ...item,

            title:
              normalizedProduct.title ||
              item.title,

            price:
              normalizedProduct.price ||
              item.price,

            image:
              normalizedProduct.image ||
              item.image ||
              finalImages[0] ||
              null,

            images: finalImages,

            quantity:
              Number(item.quantity || 0) +
              Number(normalizedProduct.quantity || 1),
          };
        });
      }

      return [
        ...prevItems,
        normalizedProduct,
      ];
    });

    setCartOpen(true);
  };

  /**
   * حذف منتج
   */
  const removeFromCart = (id) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          String(item.id) !== String(id)
      )
    );
  };

  /**
   * تعديل الكمية
   */
  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (
            String(item.id) !== String(id)
          ) {
            return item;
          }

          const newQuantity =
            Number(item.quantity || 0) +
            Number(delta || 0);

          if (newQuantity <= 0) {
            return null;
          }

          return {
            ...item,
            quantity: newQuantity,
          };
        })
        .filter(Boolean)
    );
  };

  /**
   * تفريغ السلة
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * السعر الكلي
   */
  const totalPrice = cartItems.reduce(
    (sum, item) => {
      return (
        sum +
        Number(item.price || 0) *
          Number(item.quantity || 0)
      );
    },
    0
  );

  /**
   * عدد المنتجات
   */
  const totalItems = cartItems.reduce(
    (sum, item) => {
      return (
        sum +
        Number(item.quantity || 0)
      );
    },
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartOpen,
        setCartOpen,

        cartItems,

        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider'
    );
  }

  return context;
};