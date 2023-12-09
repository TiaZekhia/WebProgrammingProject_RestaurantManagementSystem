const connect = require('../DBconnection');
const menuModel = require('../models/menuModel');

const orderModel = {
  saveOrder: async (user_id, item_id, quantity, total_price) => {
    try {
      const result = await connect.connection.query(
        'INSERT INTO orders (user_id, item_id, quantity,total_price) VALUES (?, ?, ?, ?)',
        [user_id, item_id, quantity, total_price]
      );

    } catch (error) {
      throw error;
    }
  },

  getUserOrders: (user_id, callback) => {
    connect.connection.query(
      'SELECT order_id, item_id, quantity FROM orders WHERE user_id = ?',
      [user_id],
      async (error, results) => {
        if (error) {
          callback(error, null);
        } else {
          const orders = [];

          for (const order of results) {
            const { order_id, item_id, quantity } = order;
            try {
              const item = await menuModel.getItemById(item_id);
              const item_name = item ? item.item_name : null;
              orders.push({ order_id, item_name, quantity });
            } catch (fetchError) {
              callback(fetchError, null);
              return;
            }
          }

          callback(null, orders);
        }
      }
    );
  },
  deleteOrderById: async (orderId) => {
    try {
      await connect.connection.query('DELETE FROM orders WHERE order_id = ?', [orderId]);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
  getOrderById: (order_id, callback) => {
    connect.connection.query(
      'SELECT * FROM orders WHERE order_id = ?',
      [order_id],
      (error, results) => {
        if (error) {
          callback(error, null);
        } else {
          const orderDetails = results.length > 0 ? results[0] : null;
          callback(null, orderDetails);
        }
      }
    );
  },

  updateOrder: (order_id, updatedItemID, updatedQuantity, updatedTotalPrice, callback) => {
    connect.connection.query(
      'UPDATE orders SET item_id = ?, quantity=?, total_price=? WHERE order_id = ?',
      [updatedItemID, updatedQuantity, updatedTotalPrice, order_id],
      (error, results) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, results);
        }
      }
    );
  },


};

module.exports = orderModel;
