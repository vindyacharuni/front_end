const CART_KEY = 'cart_v1';

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load cart:', e);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-change'));
  } catch (e) {
    console.error('Failed to save cart:', e);
  }
}

function getCart() {
  return loadCart();
}

function clearCart() {
  saveCart([]);
  return [];
}

function findIndex(cart, id) {
  return cart.findIndex((i) => i.id === id || i._id === id);
}

function addItem(item, quantity = 1) {
  const cart = loadCart();
  const idx = findIndex(cart, item.id ?? item._id);

  if (idx > -1) {
    cart[idx].quantity = (cart[idx].quantity || 0) + quantity;
  } else {
    cart.push({ ...item, quantity });
  }

  saveCart(cart);
  return cart;
}

function removeItem(id) {
  const cart = loadCart().filter((i) => (i.id ?? i._id) !== id);
  saveCart(cart);
  return cart;
}

function updateQuantity(id, quantity) {
  if (quantity <= 0) return removeItem(id);

  const cart = loadCart();
  const idx = findIndex(cart, id);
  if (idx > -1) {
    cart[idx].quantity = quantity;
    saveCart(cart);
  }
  return cart;
}

function getItemCount() {
  const cart = loadCart();
  return cart.reduce((acc, it) => acc + (it.quantity || 0), 0);
}

function getTotal() {
  const cart = loadCart();
  return cart.reduce((sum, it) => {
    const price = typeof it.price === 'string' ? parseFloat(it.price) || 0 : it.price || 0;
    return sum + price * (it.quantity || 0);
  }, 0);
}

export {
  addItem,
  removeItem,
  updateQuantity,
  getCart,
  clearCart,
  getItemCount,
  getTotal,
  saveCart,
  loadCart,
};

export default {
  addItem,
  removeItem,
  updateQuantity,
  getCart,
  clearCart,
  getItemCount,
  getTotal,
};
