const userModel = require('../models/userModel');

const authController = {
  checkLogin: (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    userModel.checkLogin(username, password, (err, result) => {
      if (err) {
        res.send('<h1>Internal Server Error</h1>');
      } else {
        if (result.length === 1) {
          res.redirect(`/home?username=${(username)}`);
        } else {
          res.send('Login failed');
        }
      }
    });
  },

  signup: (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    userModel.signup(username, password, email, (err, result) => {
      if (err) {
        res.send('<h1>Internal Server Error</h1>');
      } else {
        res.redirect(`/home?username=${(username)}`);
      }
    });
  },
};

module.exports = authController;
