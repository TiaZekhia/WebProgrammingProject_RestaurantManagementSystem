const connect = require('../DBconnection');
const menuModel = require('../models/menuModel');

const reviewModel = {
  saveReview: async (user_id, item_id, comment, callback) => {
    try {
      const result = await connect.connection.query(
        'INSERT INTO review (user_id, item_id, comment) VALUES (?, ?, ?)',
        [user_id, item_id, comment]
      );
      callback(null, result);
    } catch (error) {
      callback(error);
    }
  },

  getReviewsByUserId: (user_id, callback) => {
    connect.connection.query(
      'SELECT * FROM review WHERE user_id = ?',
      [user_id],
      async (error, results) => {
        if (error) {
          callback(error, null);
        } else {
          const reviews = [];

          for (const review of results) {
            const { review_id, user_id, item_id, comment } = review;

            const item = await menuModel.getItemById(item_id);
            const item_name = item.item_name;
            reviews.push({ review_id, user_id, item_id, item_name, comment });
          }

          callback(null, reviews);
        }
      }
    );
  },
  deleteReview: async (review_id) => {
    try {
      await connect.connection.query('DELETE FROM review WHERE review_id = ?',
        [review_id]);
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  },
  getReviewById: async (review_id, callback) => {
    connect.connection.query(
      'SELECT * FROM review WHERE review_id = ?',
      [review_id],
      (error, results) => {
        if (error) {
          callback(error, null);
        } else {
          const reviewDetails = results.length > 0 ? results[0] : null;
          callback(null, reviewDetails);
        }
      }
    );
  },

  updateReview: (review_id, updatedItemId, updatedComment, callback) => {
    connect.connection.query(
      'UPDATE review SET item_id=?, comment = ? WHERE review_id = ?',
      [updatedItemId, updatedComment, review_id],
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


module.exports = reviewModel;
