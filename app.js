'use strict';

const express = require('express');
const app = express();
const path = require('path');

const connect = require('./DBconnection');
app.set('view engine','ejs');

const authController = require('./controllers/authController');
const menuController = require('./controllers/menuController');
const reviewController = require('./controllers/reviewController');
const orderController = require('./controllers/orderController');

const viewsPath = path.join(__dirname, 'views');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => {
  res.sendFile(`${viewsPath}/signinup.html`);
});

app.get('/check', authController.checkLogin);
app.post('/signup', authController.signup);

app.use('/viewMenu', menuController);

app.get('/home', (req, res) => {
    const username = req.query.username;

    res.render('home',{username});
  });

app.get('/makeReview', reviewController.showReviewForm);

app.post('/makeReview', reviewController.makeReview);

app.get('/userReviews', reviewController.userReviews);

app.delete('/deleteReview/:reviewId', reviewController.deleteReview);

app.get('/editReview', reviewController.showEditReviewForm);

app.post('/updateReview', reviewController.updateReview);

app.get('/order', orderController.order);

app.get('/makeOrder', orderController.showOrderForm);
app.post('/makeOrder', orderController.makeOrder);

app.get('/userOrders', orderController.userOrders);

app.delete('/deleteOrder/:orderId', orderController.deleteOrder);

app.get('/editOrder', orderController.showEditOrderForm);

app.post('/updateOrder', orderController.updateOrder);


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
