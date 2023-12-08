const connect = require('../DBconnection');

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

  /*getReviewsByUsername: async (username, callback) => {
    try {
      const results = await connect.connection.query(
        'SELECT item_id, comment FROM review ' +
        'INNER JOIN users ON review.user_id = users.uid ' +
        'WHERE users.username = ?',
        [username]
      );
      callback(null, results);
    } catch (error) {
      callback(error, null);
    }
  }*/

/*getReviewsByUserId: async (user_id) => {
  return new Promise((resolve, reject) => {
    connect.connection.query(
      'SELECT item_id, comment FROM review ' +
      'WHERE users.uid = ?',
      [user_id],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
},*/
/*
getUserReviews: async (username) => {
  try {
    // Get user_id based on username
    const user_id = await connect.connection.promise().query('SELECT uid FROM users WHERE username = ?', [username])
      .then(([rows]) => {
        if (rows.length > 0) {
          return rows[0].uid;
        } else {
          return null;
        }
      });

    if (user_id !== null) {
      // Get user reviews
      const reviews = await connect.connection.promise().query(
        'SELECT r.item_id, r.comment, m.item_name FROM review r JOIN menu m ON r.item_id = m.item_id WHERE r.user_id = ?',
        [user_id]
      ).then(([rows]) => {
        return rows;
      });

      return reviews;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
},
*/
};


module.exports = reviewModel;
