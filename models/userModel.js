const connect = require('../DBconnection');

const userModel = {
  checkLogin: (username, password, callback) => {
    connect.connection.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password],
      callback
    );
  },

  signup: (username, password, email, callback) => {
    connect.connection.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, password, email],
      callback
    );
  },
};

module.exports = userModel;
