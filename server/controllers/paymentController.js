const axios = require('axios');
const crypto = require('crypto');
const Order = require('../models/Order');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');

// @desc    Verify payment via reference
// @route   GET /api/payment/verify/:reference
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );
    
    const { data } = response.data;
    
    if (data.status === 'success') {
      // Update order status if not already paid
      const order = await Order.findOne({ paymentReference: reference });
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.status = 'Confirmed';
        await order.save();
        
        // Trigger receipt email
        await sendReceiptEmail(order);
      }

      res.json({
        success: true,
        message: 'Payment verified',
        data: {
          reference: data.reference,
          amount: data.amount / 100,
          status: data.status,
          paidAt: data.paid_at
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message
    });
  }
};

// @desc    Paystack Webhook
// @route   POST /api/payment/webhook
// @access  Public
const handleWebhook = async (req, res) => {
  try {
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');
    
    if (hash == req.headers['x-paystack-signature']) {
      const event = req.body;
      
      if (event.event === 'charge.success') {
        const { reference } = event.data;
        const order = await Order.findOne({ paymentReference: reference }).populate('user').populate('items.flower');
        
        if (order && order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          order.status = 'Confirmed';
          await order.save();
          
          // Send receipt email
          await sendReceiptEmail(order);
        }
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook error:', error);
    res.sendStatus(500);
  }
};

const sendReceiptEmail = async (order) => {
  try {
    const user = await User.findById(order.user);
    const orderDate = new Date(order.createdAt).toLocaleString();
    
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.flower.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₦${item.flower.price.toLocaleString()}</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #fdfaf7; color: #2D4F1E;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2D4F1E; margin: 0; font-size: 28px;">Kevin's <span style="color: #D4A373;">Blooms</span></h1>
          <p style="color: #D4A373; font-style: italic; margin: 5px 0;">Thank you for your order!</p>
        </div>

        <div style="background-color: white; padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #fdfaf7; padding-bottom: 15px; margin-bottom: 20px;">
            <div>
              <p style="margin: 0; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Order ID</p>
              <p style="margin: 5px 0 0; font-weight: bold;">#${order._id.toString().slice(-8).toUpperCase()}</p>
            </div>
            <div style="text-align: right;">
              <p style="margin: 0; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Date</p>
              <p style="margin: 5px 0 0; font-weight: bold;">${orderDate}</p>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="text-align: left; font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px;">
                <th style="padding: 10px; border-bottom: 2px solid #fdfaf7;">Flower</th>
                <th style="padding: 10px; border-bottom: 2px solid #fdfaf7; text-align: center;">Qty</th>
                <th style="padding: 10px; border-bottom: 2px solid #fdfaf7; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="border-top: 2px solid #fdfaf7; padding-top: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="color: #666;">Delivery Fee:</span>
              <span style="font-weight: bold;">₦${order.deliveryFee.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 20px; color: #2D4F1E; margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
              <span style="font-weight: bold;">Total:</span>
              <span style="font-weight: bold; color: #D4A373;">₦${order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div style="margin-top: 30px; padding: 20px; background-color: white; border-radius: 20px; font-size: 14px;">
          <h4 style="margin: 0 0 10px; color: #D4A373; text-transform: uppercase; letter-spacing: 1px; font-size: 12px;">Delivery To</h4>
          <p style="margin: 5px 0;"><strong>${order.recipientName}</strong></p>
          <p style="margin: 5px 0; color: #666;">${order.deliveryAddress}, ${order.city}</p>
          <p style="margin: 5px 0; color: #666;">${order.recipientPhone}</p>
          ${order.giftMessage ? `
            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee;">
              <h4 style="margin: 0 0 5px; color: #D4A373; text-transform: uppercase; letter-spacing: 1px; font-size: 12px;">Gift Message</h4>
              <p style="margin: 5px 0; font-style: italic; color: #444;">"${order.giftMessage}"</p>
            </div>
          ` : ''}
        </div>

        <div style="text-align: center; margin-top: 40px; color: #999; font-size: 12px;">
          <p>If you have any questions, please contact our support at umunnakweemeka95@gmail.com</p>
          <p>© 2026 Kevin's Blooms. All rights reserved.</p>
        </div>
      </div>
    `;

    await sendEmail({
      email: user.email,
      subject: `Receipt for Order #${order._id.toString().slice(-8).toUpperCase()} - Kevin's Blooms`,
      html
    });
  } catch (error) {
    console.error('Error sending receipt email:', error);
  }
};

module.exports = { verifyPayment, handleWebhook };
