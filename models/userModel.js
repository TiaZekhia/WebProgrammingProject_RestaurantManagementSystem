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

  getUserIdByUsername: (username, callback) => {
    connect.connection.query('SELECT uid FROM users WHERE username = ?', [username], (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        const id = results.length > 0 ? results[0].uid : null;
        callback(null, id);
      }
    });
  },
  getUsernameByUserId: (uid, callback) => {
    connect.connection.query('SELECT username FROM users WHERE uid = ?', [uid], (error, results) => {
        if (error) {
            callback(error, null);
        } else {
            const uname = results.length > 0 ? results[0].username : null;
            callback(null, uname);
        }
    });
},

};


module.exports = userModel;
