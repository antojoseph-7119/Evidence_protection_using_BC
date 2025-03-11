const express = require('express');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const multer = require('multer');
const bcrypt = require('bcrypt'); 

const app = express();
const upload = multer();
const PORT = 5000;

// ✅ Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));


const MySQLStore = require('express-mysql-session')(session);

// ✅ Define session store before using it
const sessionStore = new MySQLStore({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sample',  // Use your actual database name
  clearExpired: true,
  expiration: 86400000, // 1 day
});

// ✅ Now use `sessionStore` inside `app.use(session(...))`
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,  // ✅ Store session in MySQL
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000  // 1-day session expiry
  }
}));

// Middleware to log current session details
app.use((req, res, next) => {
  console.log("Session data:", req.session);
  next();
});



//  Retrieve Email from Session
app.get('/get-user-email', (req, res) => {
  if (req.session.user && req.session.user.email) {
    res.json({ success: true, email: req.session.user.email });
  } else {
    res.status(401).json({ success: false, message: "User not logged in" });
  }
});

// ✅ MySQL Connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sample',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

(async () => {
  try {
    const [rows] = await db.query("SELECT 1");  // Test query to check connection
    console.log('Connected to MySQL Database');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
})();

// ✅ Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'evidenceprotection5@gmail.com',
    pass: 'ejgq tetf nlbp bkgw'
  },
  logger: true,
  debug: true
});

// ✅ Fix `/send-certificate` Route
app.post('/send-certificate', upload.single('certificate'), (req, res) => {
  console.log('Received request for /send-certificate');
  console.log('Request Body:', req.body);
  console.log('Uploaded File:', req.file);

  const { email } = req.body;
  const certificateFile = req.file;

  if (!email || !certificateFile) {
    console.error('Missing required fields:', req.body, req.file);
    return res.status(400).json({ message: 'Email and certificate file are required' });
  }

  const mailOptions = {
    from: 'evidenceprotection5@gmail.com',
    to: email,
    subject: 'Your Certificate - Secure Document Delivery',
    text: `Dear User,
  
  Attached is your official certificate. Please find the details below:
  
  📜 Certificate Details:  
   File Name: certificate.pdf  
 This certificate is issued to you as proof of authentication and integrity.  
  
  🔑   Private Key for Verification:  
  Along with the certificate, we provide you with a unique private key. This key is essential for verifying the authenticity and integrity of any uploaded or shared version of this certificate.  
  
  ⚠️ Important Security Notice:
  - Keep your private key confidential and do not share it with anyone.  
  - If you lose the private key, you may not be able to verify your file authenticity.  
  - Any modification of the certificate will render the verification invalid.  
  
  If you have any questions or need assistance, feel free to contact our support team.
  
  Best regards,  
  Evidence Protection Team
  `,
    attachments: [
      { filename: 'certificate.pdf', content: certificateFile.buffer }
       // Ensure privateKey is defined
    ]
  };
  

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(500).json({ message: 'Error sending email', error: err.toString() });
    }
    res.json({ message: 'Certificate sent successfully!' });
  });
});

// ✅ Remove duplicate session setup
app.use((req, res, next) => {
  if (req.session.user && Date.now() > req.session.cookie.expires) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      return res.status(401).json({ message: 'Session expired. Please log in again.' });
    });
  } else {
    next();
  }
});

// ✅ OTP Storage
const otpStorage = {};

// ✅ Send OTP Route
// ✅ Send OTP Route with Email Existence Check
app.post('/send-otp', async (req, res) => {
  console.log('Received /send-otp request:', req.body);
  const { email } = req.body;

  if (!email) {
    console.error('Email not provided');
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // ✅ Check if the email already exists in the `users` table
    const [existingUser] = await db.query('SELECT email FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already registered. Please log in.' });
    }

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStorage[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    // ✅ Email content
    const mailOptions = {
      from: 'evidenceprotection5@gmail.com',
      to: email,
      subject: 'Your OTP for Registration - Secure Your Account',
      text: `Dear User,
      
Welcome to Evidence Protection! To complete your registration, please use the following One-Time Password (OTP):

🔐 **Your OTP Code:** ${otp}

⚠️ **Important Security Notice:**  
- This OTP is valid for 5 minutes only.  
- **Do not share** this code with anyone, even if they claim to be from our support team.  
- If you did not request this OTP, please ignore this email.  

By using this OTP, you confirm that you initiated this registration process. If you suspect any unauthorized activity, please contact our support team immediately.

Stay safe and secure,  
**Evidence Protection Team**`
    };

    // ✅ Send email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        //console.error('Error sending OTP:', err);
        return res.status(500).json({ message: '',  });
      }
      console.log('OTP sent successfully:', info.response);
      res.json({ message: 'OTP sent successfully' });
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database error', error: error.toString() });
  }
});

// ✅ Verify OTP & Register User


app.post('/verify-otp', async (req, res) => {
    const { username, password, email, otp } = req.body;

    if (!otpStorage[email] || otpStorage[email].expires < Date.now()) {
        return res.status(400).json({ message: 'OTP expired. Request a new one.' });
    }

    if (otpStorage[email].otp !== parseInt(otp)) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

        const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [username, hashedPassword, email]);

        delete otpStorage[email]; // Remove OTP after successful verification

        res.json({ message: 'Account created successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Database error', error: error.toString() });
    }
});




// ✅ Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Fetch user details from the database
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = rows[0];

        // Compare hashed password with entered password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Successful login - Store user session
        req.session.user = { email: user.email, username: user.username };
        res.json({ message: 'Login successful', user: req.session.user });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Database error', error: error.toString() });
    }
});



// ✅ Middleware to Require Login
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized: Please log in' });
  }
  next();
};

// ✅ Upload File Route
app.post('/upload', requireLogin, (req, res) => {
  const { filename } = req.body;
  const email = req.session.user.email;

  const query = 'INSERT INTO uploads (email, filename, upload_time) VALUES (?, ?, NOW())';
  db.query(query, [email, filename], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json({ message: 'File uploaded successfully' });
  });
});

// ✅ Check Session Route
app.get('/check-session', (req, res) => {
  if (req.session.user) {
    return res.json({ authenticated: true, user: req.session.user });
  } else {
    return res.json({ authenticated: false });
  }
});

// Fetches user's name dynamically 
app.get('/get-username', async (req, res) => {
  if (!req.session.user || !req.session.user.email) {
    return res.status(401).json({ success: false, message: "User not logged in" });
  }

  const email = req.session.user.email;

  try {
    const [rows] = await db.query("SELECT username FROM users WHERE email = ?", [email]);
    
    if (rows.length > 0) {
      res.json({ success: true, username: rows[0].username });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching username:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});




// Send OTP for password reset
app.post('/send-reset-otp', async (req, res) => {
  console.log('Received /send-reset-otp request:', req.body);
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // ✅ Check if the email exists in the `users` table
    const [existingUser] = await db.query('SELECT email FROM users WHERE email = ?', [email]);

    if (existingUser.length === 0) {
      return res.status(404).json({ message: 'Email not found. Please register first.' });
    }

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStorage[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    console.log("Generated OTP for password reset:", otp); // ✅ Log OTP in console

    // ✅ Email content
    const mailOptions = {
      from: 'evidenceprotection5@gmail.com',
      to: email,
      subject: 'Your OTP for Resetting Your Password',
      text: `Dear User,
      
We received a request to reset your password. Your One-Time Password (OTP) is:

🔐 OTP Code: ${otp}

⚠️ This OTP is valid for **5 minutes only**. Do not share this code with anyone for security reasons.

If you did not request this password reset, please ignore this email. However, if you suspect unauthorized access to your account, we recommend changing your password immediately.

Stay safe,  
Evidence Protection Team`
    };

    // ✅ Send OTP email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({ message: 'Error sending OTP', error: err.toString() });
      }
      res.json({ message: 'OTP sent successfully' });
    });

  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ message: 'Database error', error: error.toString() });
  }
});

//otp verify passswordreset
// ✅ Track invalid attempts per email
const invalidOtpAttempts = {};

app.post('/verify-reset-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!otpStorage[email] || !otpStorage[email].otp) {
    return res.status(400).json({ message: 'OTP not found. Request a new one.' });
  }

  if (otpStorage[email].expires < Date.now()) {
    delete otpStorage[email]; // Remove expired OTP
    return res.status(400).json({ message: 'OTP expired. Request a new one.' });
  }

  if (parseInt(otpStorage[email].otp) !== parseInt(otp)) {
    return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
  }

  // ✅ OTP is correct
  delete otpStorage[email];

  res.json({ message: 'OTP verified successfully' });
});

// Password resetxx

// ✅ Forgot Password - Set New Password Route
app.post('/set-password', async (req, res) => {
    const { email, password } = req.body;

    console.log('Received email:', email);  
    console.log('Received password:', password);  

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

        const query = 'UPDATE users SET password = ? WHERE email = ?';
        await db.query(query, [hashedPassword, email]);

        res.json({ message: 'Password updated successfully. You can now log in.' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Database error', error: error.toString() });
    }
});

// history setup uploading

app.post('/api/upload', async (req, res) => {
  try {
      const { filename, uniqueID, email } = req.body;

      // Generate timestamp in backend
      const upload_timestamp = new Date(); // ✅ Fix undefined value

      console.log("Received data:", { filename, uniqueID, upload_timestamp, email });

      if (!filename || !uniqueID || !email) {
          return res.status(400).send({ message: 'All fields are required' });
      }

      const sql = 'INSERT INTO uploaded_files (filename, uniqueID, upload_timestamp, email) VALUES (?, ?, ?, ?)';
      
      // ✅ Execute query
      const [result] = await db.query(sql, [filename, uniqueID, upload_timestamp, email]);

      console.log('✅ Data inserted successfully into uploaded_files:', result);
      res.status(200).send({ message: 'File information saved successfully' });
  } catch (err) {
      console.error('❌ Error inserting data into uploaded_files:', err);
      res.status(500).send({ message: 'Error saving file information', error: err.sqlMessage || err.message });
  }
});









// API Endpoint for Verification Results
app.post('/api/verify', async (req, res) => {
  try {
      console.log("Received data:", req.body);  // ✅ Debugging line

      const { uniqueID, filename, verificationResult, email } = req.body;
      
      if (!uniqueID || !filename || !verificationResult || !email) {
          return res.status(400).send({ message: 'All fields are required' });
      }

      const verification_timestamp = new Date();
      const sql = 'INSERT INTO verification_results (uniqueID, filename, verificationResult, verification_timestamp, email) VALUES (?, ?, ?, ?, ?)';

      const [result] = await db.query(sql, [uniqueID, filename, verificationResult, verification_timestamp, email]);

      console.log('✅ Data inserted successfully into verification_results:', result);
      res.status(200).send({ message: 'Verification results saved successfully' });
  } catch (err) {
      console.error('❌ Error inserting data into verification_results:', err);
      res.status(500).send({ message: 'Error saving verification results', error: err.sqlMessage || err.message });
  }
});

// ✅ Upload History Route
app.get("/api/uploaded-files", async (req, res) => {
  const { email } = req.query; // Get email from query params
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const [results] = await db.query(
      "SELECT * FROM uploaded_files WHERE email = ?",
      [email]
    );
    res.json(results);
  } catch (err) {
    console.error("Error fetching upload history:", err);
    res.status(500).json({ message: "Error fetching upload history" });
  }
});


app.get("/api/verification-results", async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const [results] = await db.query(
      "SELECT * FROM verification_results WHERE email = ?",
      [email]
    );
    res.json(results);
  } catch (err) {
    console.error("Error fetching verification history:", err);
    res.status(500).json({ message: "Error fetching verification history" });
  }
});


// ✅ Logout Route
const logoutRoute = require("./logout"); 

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ message: "Logout failed" });
    }
    
    res.clearCookie("connect.sid"); // ✅ Clear session cookie
    console.log("User logged out successfully");
    return res.json({ message: "Logged out successfully" });
  });
});
// ✅ Routes
app.use("/api", logoutRoute);

// ✅ Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));