// controllers/reviewController.js

const reviewModel = require('../models/reviewModel');
const userModel = require('../models/userModel');
const menuModel = require('../models/menuModel');

const showReviewForm = async (req, res) => {
  try {
    // Fetch item names to populate the dropdown
    const itemNames = await menuModel.getAllItemNames();

    const username = req.query.username;

    res.render('reviewForm', { itemNames, username });  
  } catch (error) {
    res.status(500).send('Internal Server Error'+ error.message);
  }
};

const makeReview = async (req, res) => {
  const username = req.body.username;
  const item_name = req.body.item_name;
  const comment = req.body.comment;

  userModel.getUserIdByUsername(username, async (error, user_id) => {
      if (error) {
          console.error('Error:', error);
          res.status(500).send('Internal Server Error');
          return;
      }

      if (user_id !== null) {
          console.log('User ID:', user_id);

          try {
              // Get item_id based on item_name
              menuModel.getItemIdByItemName(item_name, async (itemError, item_id) => {
                  if (itemError) {
                      console.error('Error getting item ID:', itemError);
                      res.status(500).send('Internal Server Error');
                      return;
                  }

                  try {
                      // Call saveReview function
                      await reviewModel.saveReview(user_id, item_id, comment, (saveError, saveResult) => {
                          if (saveError) {
                              console.error('Error saving review:', saveError);
                              res.status(500).send('Internal Server Error');
                          } else {
                              console.log('Review saved successfully:', saveResult);
                              // Redirect to userReviews page
                              res.redirect('/userReviews?username=' + encodeURIComponent(username));
                          }
                      });
                  } catch (saveError) {
                      console.error('Error saving review:', saveError);
                      res.status(500).send('Internal Server Error');
                  }
              });
          } catch (error) {
              console.error('Error getting item ID:', error);
              res.status(500).send('Internal Server Error');
          }
      } else {
          console.error('User not found.');
          res.status(404).send('User not found.');
      }
  });
};



/*const getUserReviews = async (username) => {
  try {
    // Get user_id based on username
    const user_id = await new Promise((resolve, reject) => {
      userModel.getUserIdByUsername(username, (error, userId) => {
        if (error) {
          reject(error);
        } else {
          resolve(userId);
        }
      });
    });

    if (user_id !== null) {
      // Get all reviews from this user
      const reviews = await reviewModel.getReviewsByUserId(user_id);
      console.log(reviews);
      return reviews;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};


const userReviews = async (req, res) => {
  try {
    const username = req.query.username;
    if (username) {
      const reviews = await reviewController.getUserReviews(username);
      res.render('userReviews', { username: username, reviews: reviews });
    } else {
      res.status(400).send('Missing username parameter');
    }
 } catch (error) {
    res.status(500).send('Internal Server Error');
 }
};*/



const reviewController = {
    showReviewForm,
    makeReview,
    /*getUserReviews,
    userReviews,*/
  };
  
module.exports = reviewController;

