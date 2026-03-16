import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get current date and date for 30 days ago
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // Get all orders
    const orders = await orderModel.find({});
    
    // Calculate total sales
    const totalSales = orders.reduce((sum, order) => sum + order.amount, 0);
    
    // Calculate sales by payment method
    const mtnSales = orders
      .filter(o => o.paymentMethod === 'MTN_MOMO' || o.paymentMethod === 'mtn')
      .reduce((sum, o) => sum + o.amount, 0);
      
    const stripeSales = orders
      .filter(o => o.paymentMethod === 'Stripe' || o.paymentMethod === 'stripe')
      .reduce((sum, o) => sum + o.amount, 0);
      
    const codSales = orders
      .filter(o => o.paymentMethod === 'COD' || o.paymentMethod === 'cod')
      .reduce((sum, o) => sum + o.amount, 0);

    // Get recent orders (last 5)
    const recentOrders = await orderModel
      .find({})
      .sort({ date: -1 })
      .limit(5)
      .select('amount paymentMethod status date address');

    // Get total counts
    const totalProducts = await productModel.countDocuments();
    const totalUsers = await userModel.countDocuments();
    const totalOrders = orders.length;

    // Get orders by status
    const pendingOrders = orders.filter(o => o.status === 'Order Placed' || o.status === 'Pending').length;
    const processingOrders = orders.filter(o => o.status === 'Processing').length;
    const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

    // Get sales for last 7 days (for chart)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      
      const daySales = orders
        .filter(o => {
          const orderDate = new Date(o.date);
          return orderDate >= date && orderDate < nextDate;
        })
        .reduce((sum, o) => sum + o.amount, 0);
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sales: daySales
      });
    }

    res.json({
      success: true,
      totalSales,
      totalOrders,
      totalProducts,
      totalUsers,
      mtnSales,
      stripeSales,
      codSales,
      recentOrders,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      salesTrend: last7Days
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { getDashboardStats };