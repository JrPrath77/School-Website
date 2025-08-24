import express from 'express';

import mysql from 'mysql';

import bodyParser from 'body-parser';

import cors from 'cors';


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',       // XAMPP default is empty
  database: 'daga_education'
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to MySQL database.');
  }
});

// Contact Form API
app.post('/admit', (req, res) => {
  const { student_name, age, address, parent_name, email, phone, previous_school } = req.body;

  const query = `INSERT INTO student_admissions 
    (student_name, age, address, parent_name, email, phone, previous_school) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [student_name, age, address, parent_name, email, phone, previous_school], (err, result) => {
    if (err) {
      console.error('Admission DB error:', err);
      res.status(500).send('Database error.');
    } else {
      res.status(200).send('Student admission submitted!');
    }
  });
});

// Contact Us API
app.post('/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const query = 'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, email, phone, subject, message], (err, result) => {
    if (err) {
      console.error('Error inserting into contact_messages:', err); // ✅ better error message
      return res.status(500).send('Database error.');
    }
    res.status(200).send('Message received!');
  });
});


// Start Server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

