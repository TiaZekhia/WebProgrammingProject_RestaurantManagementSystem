const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '127.0.0.1',  
  user: 'root',       
  password: '',       
  database: 'restaurant',  
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

module.exports = {connection};
