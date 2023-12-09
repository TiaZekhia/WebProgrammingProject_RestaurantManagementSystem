const userModel = require('../models/userModel');
const orderModel = require('../models/orderModel');
const menuModel = require('../models/menuModel');

const orderController = {
  showOrderForm: async (req, res) => {
    try {
      const username = req.query.username;
      const menuItems = await menuModel.getMenuItems();
      res.render('makeOrder', { username, menuItems });
    } catch (error) {
      res.status(500).send("<h1>Internal Server Error</h1>");
    }
  },

  order: async (req, res) => {
    const username = req.query.username;
    res.render('orderPage', { username });
  },

  makeOrder: async (req, res) => {
    const username = req.body.username;
    const item_id = req.body.item_id;
    const quantity = req.body.quantity;

    try {
      userModel.getUserIdByUsername(username, async (error, user_id) => {
        if (error) {
          console.error('Error:', error);
          res.status(500).send('Internal Server Error');
          return;
        }

        if (user_id !== null) {
          try {
            const item = await menuModel.getItemById(item_id);
            const subtotal = item.item_price * quantity;

            await orderModel.saveOrder(user_id, item_id, quantity, subtotal);
            res.redirect('/userOrders?username=' + encodeURIComponent(username));
          } catch (error) {
            res.status(500).send('Internal Server Error');
          }
        } else {
          res.status(404).send('User not found.');
        }
      });
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  },

  userOrders: async (req, res) => {
    const username = req.query.username;

    try {
      userModel.getUserIdByUsername(username, async (error, user_id) => {
        if (error) {
          console.error('Error:', error);
          res.status(500).send('Internal Server Error');
          return;
        }

        if (user_id !== null) {
          try {
            orderModel.getUserOrders(user_id, (ordersError, orders) => {
              if (ordersError) {
                console.error('Error:', ordersError);
                res.status(500).send('Internal Server Error');
                return;
              }
              res.render('userOrders', { username, orders });
            });
          } catch (error) {
            res.status(500).send('Internal Server Error');
          }
        } else {
          res.status(404).send('User not found.');
        }
      });
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  },
  deleteOrder: async (req, res) => {
    try {
      const orderId = req.params.orderId;

      await orderModel.deleteOrderById(orderId);

      res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  showEditOrderForm: async (req, res) => {
    try {
      const order_id = req.query.order_id;
      const menuItems = await menuModel.getMenuItems();
      orderModel.getOrderById(order_id, (error, orderDetails) => {
        if (error) {
          console.error('Error:', error);
          res.status(500).send('Internal Server Error');
        } else {
          if (orderDetails) {
            res.render('editOrder', { orderDetails, menuItems });
          } else {
            res.status(404).send('Order not found.');
          }
        }
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  updateOrder: async (req, res) => {
    try {
      const order_id = req.body.order_id;
      const item_id = req.body.item_id;
      const quantity = req.body.quantity;
      const user_id = req.body.user_id;

      try {
        const username = await new Promise((resolve, reject) => {
          userModel.getUsernameByUserId(user_id, (error, uname) => {
            if (error) {
              reject(error);
            } else {
              resolve(uname);
            }
          });
        });

        const item = await menuModel.getItemById(item_id);
        const subtotal = item.item_price * quantity;

        orderModel.updateOrder(order_id, item_id, quantity, subtotal, (updateError, updateResults) => {
          if (updateError) {
            console.error('Error updating order:', updateError);
            res.status(500).send('Internal Server Error2');
          } else {
            res.redirect('/userOrders?username=' + encodeURIComponent(username));
          }
        });
      } catch (saveError) {
        res.status(500).send('Internal Server Error3');
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error5');
    }
  },


};

module.exports = orderController;
