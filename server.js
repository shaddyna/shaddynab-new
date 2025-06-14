const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');


dotenv.config();

const app = express();

// Middleware
app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));
app.use(express.static(path.join(__dirname, 'temp/uploads')));

// Routes 
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/membership', require('./routes/sellerRequestRoutes'));
app.use('/api/skills', require('./routes/skillRoutes'));
app.use('/api/shops', require('./routes/shopRoutes'));
app.use('/api/membersrequests', require('./routes/memberRequestRoutes'));
app.use('/api/inquiries', require('./routes/inquiryRoutes'));
app.use('/api/members', require('./routes/memberRoutes'));
app.use('/api/sellers', require('./routes/sellerRoutes'));


// Sample route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));