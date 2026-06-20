import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const CACHE_KEY = 'e_commerce_products_cache';
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cart and Wishlist states (Wishlist initialized from localStorage)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('e_commerce_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem('e_commerce_wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState(''); // '', 'price-low-high', 'price-high-low', 'rating-high-low'

  // Modal open states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Auth & Profile states
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('e_commerce_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedUsers = localStorage.getItem('e_commerce_registered_users');
    if (savedUsers) return JSON.parse(savedUsers);
    
    // Default mock user Tim
    const defaultUsers = [
      {
        name: 'Tim',
        email: 'tim@example.com',
        password: '123456',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        phone: '(+263) 77 123 4567',
        address: '69 Selous Ave, Harare, Zimbabwe',
        joined: 'June 2026',
        tier: 'Platinum Member'
      }
    ];
    localStorage.setItem('e_commerce_registered_users', JSON.stringify(defaultUsers));
    return defaultUsers;
  });

  // Order history state (linked to current user email)
  const [orders, setOrders] = useState([]);

  // Support Tickets State
  const [tickets, setTickets] = useState(() => {
    const savedTickets = localStorage.getItem('e_commerce_tickets');
    if (savedTickets) return JSON.parse(savedTickets);
    
    return [
      {
        id: 'TCK-829401',
        subject: 'Sizing query regarding Mens Casual Slim Fit',
        msg: 'Hello, I ordered a Medium but received a Large size. Can I exchange it?',
        priority: 'High',
        status: 'Pending',
        reply: '',
        date: 'June 19, 2026',
        user: 'tim@example.com',
        orderId: 'ORD-549102'
      }
    ];
  });

  // Suppliers Application State
  const [suppliers, setSuppliers] = useState(() => {
    const savedSuppliers = localStorage.getItem('e_commerce_suppliers');
    if (savedSuppliers) return JSON.parse(savedSuppliers);

    return [
      {
        id: 'SPL-103',
        company: 'ZimTech Gadgets',
        classification: 'Manufacturer',
        phone: '(+263) 77 987 6543',
        status: 'Pending',
        date: 'June 18, 2026'
      }
    ];
  });

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('e_commerce_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('e_commerce_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync user and fetch user's orders
  useEffect(() => {
    if (user) {
      localStorage.setItem('e_commerce_user', JSON.stringify(user));
      const savedOrders = localStorage.getItem(`e_commerce_orders_${user.email}`);
      setOrders(savedOrders ? JSON.parse(savedOrders) : []);
    } else {
      localStorage.removeItem('e_commerce_user');
      setOrders([]);
    }
  }, [user]);

  // Sync tickets to localStorage
  useEffect(() => {
    localStorage.setItem('e_commerce_tickets', JSON.stringify(tickets));
  }, [tickets]);

  // Sync suppliers to localStorage
  useEffect(() => {
    localStorage.setItem('e_commerce_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  // Fetch products with caching optimization
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Check cache first
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const isFresh = Date.now() - timestamp < CACHE_EXPIRY_MS;
          if (isFresh && Array.isArray(data) && data.length > 0) {
            setProducts(data);
            setLoading(false);
            return;
          }
        }

        // Fetch new data
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();

        // Enrich with random inventory stock (between 4 and 25)
        const enrichedData = data.map(p => ({
          ...p,
          stock: p.stock !== undefined ? p.stock : Math.floor(Math.random() * 21) + 4
        }));

        // Update state and cache
        setProducts(enrichedData);
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: enrichedData,
            timestamp: Date.now(),
          })
        );
        setError(null);
      } catch (err) {
        setError(err.message);
        // Fallback to cache if offline
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data } = JSON.parse(cachedData);
          if (Array.isArray(data)) setProducts(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update Cache whenever product price/stock changes in state
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: products,
          timestamp: Date.now(),
        })
      );
    }
  }, [products]);

  // Auth Functions
  const login = (email, password) => {
    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      return { success: true };
    }
    return { success: false, message: 'Invalid email or password.' };
  };

  const register = (name, email, password) => {
    const exists = registeredUsers.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (exists) {
      return { success: false, message: 'Email is already registered.' };
    }
    const newUser = {
      name,
      email,
      password,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      phone: '',
      address: '',
      joined: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      tier: 'Standard Member'
    };
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('e_commerce_registered_users', JSON.stringify(updatedUsers));
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedDetails) => {
    if (!user) return { success: false, message: 'Not logged in.' };
    const updatedUser = { ...user, ...updatedDetails };
    setUser(updatedUser);
    
    // Update in registeredUsers database
    const updatedUsers = registeredUsers.map(u => 
      u.email.toLowerCase() === user.email.toLowerCase() ? updatedUser : u
    );
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('e_commerce_registered_users', JSON.stringify(updatedUsers));
    return { success: true };
  };

  // Cart Functions
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, change) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + change;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Order Functions
  const placeOrder = (shippingDetails, paymentDetails) => {
    if (!user) return { success: false, message: 'Must be logged in to checkout.' };
    if (cart.length === 0) return { success: false, message: 'Cart is empty.' };

    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      items: [...cart],
      total: cartTotal,
      shipping: shippingDetails,
      payment: {
        method: paymentDetails.method || 'Credit Card',
        cardNumber: paymentDetails.cardNumber ? '•••• ' + paymentDetails.cardNumber.slice(-4) : '•••• 4242'
      },
      status: 'Processing'
    };

    // Deduct stock for placed items
    setProducts(prev => 
      prev.map(p => {
        const cartItem = cart.find(c => c.id === p.id);
        if (cartItem) {
          const newStock = Math.max(0, p.stock - cartItem.quantity);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem(`e_commerce_orders_${user.email}`, JSON.stringify(updatedOrders));
    clearCart();
    return { success: true, order: newOrder };
  };

  // Wishlist Functions
  const toggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const isAlreadyIn = prevWishlist.some((item) => item.id === product.id);
      if (isAlreadyIn) {
        return prevWishlist.filter((item) => item.id !== product.id);
      } else {
        return [...prevWishlist, product];
      }
    });
  };

  // Ops / Admin helpers
  const addTicket = (subject, msg, priority, orderId = '') => {
    const newTicket = {
      id: 'TCK-' + Math.floor(100000 + Math.random() * 900000),
      subject,
      msg,
      priority,
      status: 'Pending',
      reply: '',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      user: user ? user.email : 'guest@example.com',
      orderId
    };
    setTickets(prev => [newTicket, ...prev]);
    return newTicket;
  };

  const addSupplier = (company, classification, phone) => {
    const newSupplier = {
      id: 'SPL-' + Math.floor(100 + Math.random() * 900),
      company,
      classification,
      phone,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
    setSuppliers(prev => [newSupplier, ...prev]);
    return newSupplier;
  };

  const updateProductStock = (productId, amount) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stock: parseInt(amount) } : p))
    );
  };

  const updateProductPrice = (productId, price) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, price: parseFloat(price) } : p))
    );
  };

  const replyToTicket = (ticketId, replyText) => {
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, reply: replyText, status: 'Resolved' } : t))
    );
  };

  const updateSupplierStatus = (supplierId, newStatus) => {
    setSuppliers(prev =>
      prev.map(s => (s.id === supplierId ? { ...s, status: newStatus } : s))
    );
  };

  // Extract unique categories dynamically from fetched products
  const categories = ['All', ...new Set(products.map((p) => p.category))];

  // Cart totals
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        cart,
        wishlist,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        cartCount,
        cartTotal,
        
        // Auth states
        user,
        orders,
        login,
        register,
        logout,
        updateProfile,
        placeOrder,

        // Ops/Admin states & helpers
        tickets,
        suppliers,
        addTicket,
        addSupplier,
        updateProductStock,
        updateProductPrice,
        replyToTicket,
        updateSupplierStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
