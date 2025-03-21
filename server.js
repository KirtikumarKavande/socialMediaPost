const express = require('express');
const dotenv = require('dotenv');
const v1Routes = require('./routes/index');
const connectDB = require('./config/db.config');

dotenv.config();
console.log("logged")
const app = express();
app.use(express.json());

connectDB();


app.use('/api', v1Routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});