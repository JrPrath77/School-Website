import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import mysql from 'mysql2';
import cron from 'node-cron';

dotenv.config();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'daga_education'
});

const getAdmissionData = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM student_admissions', (err, results) => {
      if (err) {
        console.error("Error fetching admission data:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

const getContactQueryData = () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM contact_messages', (err, results) => {
      if (err) {
        console.error("Error fetching contact queries:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async () => {
  try {
    const [admissionData, contactQueryData] = await Promise.all([
      getAdmissionData(),
      getContactQueryData()
    ]);

    let admissionHTML = `
      <h2>Student Admissions</h2>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
        <tr>
          <th>ID</th>
          <th>Student Name</th>
          <th>Age</th>
          <th>Address</th>
          <th>Parent Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Previous School</th>
          <th>Submitted At</th>
        </tr>
    `;
    admissionData.forEach(entry => {
      admissionHTML += `
        <tr>
          <td>${entry.id}</td>
          <td>${entry.student_name}</td>
          <td>${entry.age}</td>
          <td>${entry.address}</td>
          <td>${entry.parent_name}</td>
          <td>${entry.email}</td>
          <td>${entry.phone}</td>
          <td>${entry.previous_school}</td>
          <td>${entry.submitted_at}</td>
        </tr>
      `;
    });
    admissionHTML += `</table>`;

    let contactHTML = `
      <h2>Contact Queries</h2>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Subject</th>
          <th>Message</th>
          <th>Submitted At</th>
        </tr>
    `;
    contactQueryData.forEach(entry => {
      contactHTML += `
        <tr>
          <td>${entry.id}</td>
          <td>${entry.name}</td>
          <td>${entry.email}</td>
          <td>${entry.phone}</td>
          <td>${entry.subject}</td>
          <td>${entry.message}</td>
          <td>${entry.submitted_at}</td>
        </tr>
      `;
    });
    contactHTML += `</table>`;

    const fullHTML = `
      <div style="font-family: Arial, sans-serif; font-size: 14px;">
        ${admissionHTML}
        <br><br>
        ${contactHTML}
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'sushantpatil4575@gmail.com',
      subject: 'Full Report: Admissions and Contact Queries',
      html: fullHTML
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
      } else {
        console.log('Email sent:', info.response);
      }
    });

  } catch (err) {
    console.error('Failed to send email:', err);
  }
};
// Calculate 1 minute from now
const delayInMilliseconds = 60 * 1000; // 1 minute

// Schedule the task after 1 minute
setTimeout(() => {
  console.log('Sending email after 1 minute...');
  sendEmail();
}, delayInMilliseconds);
// Schedule the email to be sent every Sunday at 11:59 PM
// cron.schedule('59 23 * * SUN', () => {
//   console.log('Sending weekly email report...');
//   sendEmail();
// });
