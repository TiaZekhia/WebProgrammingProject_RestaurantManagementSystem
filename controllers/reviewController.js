const reviewModel = require('../models/reviewModel');
const userModel = require('../models/userModel');
const menuModel = require('../models/menuModel');

const showReviewForm = async (req, res) => {
  try {
    const itemNames = await menuModel.getAllItemNames();

    const username = req.query.username;

    res.render('reviewForm', { itemNames, username });
  } catch (error) {
    res.status(500).send('Internal Server Error' + error.message);
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
        menuModel.getItemIdByItemName(item_name, async (itemError, item_id) => {
          if (itemError) {
            console.error('Error getting item ID:', itemError);
            res.status(500).send('Internal Server Error');
            return;
          }

          try {
            await reviewModel.saveReview(user_id, item_id, comment, (saveError, saveResult) => {
              if (saveError) {
                console.error('Error saving review:', saveError);
                res.status(500).send('Internal Server Error');
              } else {
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



const getUserReviews = async (username) => {
  try {
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
  const username = req.query.username;

  try {
    userModel.getUserIdByUsername(username, async (error, user_id) => {
      if (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error1');
        return;
      }

      if (user_id !== null) {
        try {
          reviewModel.getReviewsByUserId(user_id, (reviewsError, reviews) => {
            if (reviewsError) {
              console.error('Error getting reviews:', reviewsError);
              res.status(500).send('Internal Server Error2');
            } else {
              res.render('userReviews', { username, reviews });
            }
          });
        } catch (reviewsError) {
          console.error('Error getting reviews:', reviewsError);
          res.status(500).send('Internal Server Error3');
        }
      } else {
        res.status(404).send('User not found.');
      }
    });
  } catch (error) {
    res.status(500).send('Internal Server Error4');
  }
};

const deleteReview = async (req, res) => {
  try {
    const review_id = req.params.reviewId;
    await reviewModel.deleteReview(review_id);
    res.status(200).json({ message: 'Review deleted successfully' });

  } catch {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });

  }

};
const showEditReviewForm = async (req, res) => {
  try {
    const review_id = req.query.review_id;
    const menuItems = await menuModel.getMenuItems();

    reviewModel.getReviewById(review_id, (error, reviewDetails) => {
      if (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      } else {
        if (reviewDetails) {
          res.render('editReview', { reviewDetails, menuItems });
        } else {
          res.status(404).send('Review not found.');
        }
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};


const updateReview = async (req, res) => {
  try {
    const review_id = req.body.review_id;
    const item_id = req.body.item_id;
    const comment = req.body.comment;
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

      reviewModel.updateReview(review_id, item_id, comment, (updateError, updateResults) => {
        if (updateError) {
          console.error('Error updating order:', updateError);
          res.status(500).send('Internal Server Error2');
        } else {
          res.redirect('/userReviews?username=' + encodeURIComponent(username));
        }
      });
    } catch (saveError) {
      res.status(500).send('Internal Server Error3');
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};


const reviewController = {
  showReviewForm,
  makeReview,
  userReviews,
  deleteReview,
  showEditReviewForm,
  updateReview,
};

module.exports = reviewController;

