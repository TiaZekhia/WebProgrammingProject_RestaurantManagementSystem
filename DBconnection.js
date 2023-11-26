const mysql = require('mysql');

// Create a connection to your local MySQL database
const connection = mysql.createConnection({
  host: '127.0.0.1',  
  user: 'root',       
  password: '',       
  database: 'restaurant',  
});

// Establish the MySQL connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

module.exports = {connection};
