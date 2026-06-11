const Order = require('../models/Order');
const Flower = require('../models/Flower');
const { emitStockUpdate, emitOrderStatusUpdate } = require('../socket/stockSocket');
const { createLog } = require('./activityController');

// Delivery Fee Logic
const getDeliveryFee = (city) => {
  const fees = {
    'Lagos': 1500,
    'Abuja': 2000,
    'Port Harcourt': 1800,
    'Owerri': 800,
    'Enugu': 1200
  };
  return fees[city] || 2500;
};

// @desc    Place new order
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res) => {
  const {
    items, // array of { flowerId, quantity }
    recipientName,
    recipientPhone,
    deliveryAddress,
    city,
    deliveryDate,
    timeSlot,
    giftMessage,
    promoCode,
    discountAmount,
    paymentReference,
    paymentStatus
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No items in order');
  }

  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const flower = await Flower.findById(item.flowerId);
    if (!flower) {
      res.status(404);
      throw new Error(`Flower not found: ${item.flowerId}`);
    }
    if (flower.stockQuantity < item.quantity) {
      res.status(400);
      throw new Error(`Not enough stock for ${flower.name}`);
    }
    
    subtotal += flower.price * item.quantity;
    orderItems.push({
      flower: flower._id,
      quantity: item.quantity
    });
  }

  const deliveryFee = getDeliveryFee(city);
  const totalAmount = subtotal + deliveryFee - (discountAmount || 0);

  const order = new Order({
    user: req.user._id,
    items: orderItems,
    recipientName,
    recipientPhone,
    deliveryAddress,
    city,
    deliveryDate,
    timeSlot,
    giftMessage,
    deliveryFee,
    totalAmount,
    discountAmount: discountAmount || 0,
    promoCode,
    paymentReference,
    paymentStatus: paymentStatus || 'pending'
  });

  const createdOrder = await order.save();

  // Update flower stock and sold count
  for (const item of items) {
    const flower = await Flower.findById(item.flowerId);
    flower.stockQuantity -= item.quantity;
    flower.sold += item.quantity;
    
    // Automated Availability Kill-Switch
    if (flower.stockQuantity === 0) {
      flower.isAvailable = false;
    }
    
    await flower.save();
    emitStockUpdate(flower._id, flower.stockQuantity);
  }

  res.status(201).json({ success: true, data: createdOrder });
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('items.flower');
  res.json({ success: true, data: orders });
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'fullName email').populate('items.flower');
  res.json({ success: true, data: orders });
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    const oldStatus = order.status;
    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();

    // Emit socket update
    emitOrderStatusUpdate(order._id.toString(), order.status);

    // Map roles for logging based on status if actor is generic admin
    let logRole = req.user.role === 'admin' ? 'support' : req.user.role;
    let action = 'UPDATE_STATUS';
    let details = `Updated order #${order._id.slice(-6).toUpperCase()} status from ${oldStatus} to ${order.status}`;
    
    if (order.status === 'Confirmed') {
      logRole = req.user.role === 'admin' ? 'manager' : req.user.role;
      action = 'ORDER_CONFIRMED';
    } else if (order.status === 'Preparing') {
      logRole = req.user.role === 'admin' ? 'florist' : req.user.role;
      action = 'BOUQUET_PREPARATION';
      details = `Florist started preparing bouquet for order #${order._id.slice(-6).toUpperCase()}`;
    } else if (order.status === 'Ready for Delivery') {
      logRole = req.user.role === 'admin' ? 'florist' : req.user.role;
      action = 'READY_FOR_DELIVERY';
      details = `Bouquet prepared and marked ready for delivery for order #${order._id.slice(-6).toUpperCase()}`;
    } else if (order.status === 'Out for Delivery') {
      logRole = req.user.role === 'admin' ? 'driver' : req.user.role;
      action = 'OUT_FOR_DELIVERY';
      details = `Driver picked up order #${order._id.slice(-6).toUpperCase()} for delivery`;
    } else if (order.status === 'Delivered') {
      logRole = req.user.role === 'admin' ? 'driver' : req.user.role;
      action = 'ORDER_DELIVERED';
      details = `Order #${order._id.slice(-6).toUpperCase()} successfully delivered`;
    } else if (order.status === 'Cancelled') {
      logRole = req.user.role === 'admin' ? 'support' : req.user.role;
      action = 'ORDER_CANCELLED';
    }

    await createLog(
      req.user._id,
      logRole,
      action,
      'Order',
      order._id,
      details,
      { 
        oldStatus, 
        newStatus: order.status,
        recipient: order.recipientName,
        city: order.city
      }
    );

    res.json({ success: true, data: updatedOrder });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'fullName email').populate('items.flower');

  if (order) {
    // Check if user owns order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to view this order');
    }
    res.json({ success: true, data: order });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById
};
