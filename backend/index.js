const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config(); // Load .env file
const mongoose = require('mongoose');
const path = require('path');

// Import the routers
const productRoutes = require('./api/routes/products'); 
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');
const home = require('./api/routes/home');
const cartRoutes = require('./api/routes/cart');

// Middleware to parse JSON request bodies
//express automatically includes body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Mount the routers
app.use('/products', productRoutes); 
app.use('/orders', orderRoutes);
app.use('/user',userRoutes);
app.use('/cart',cartRoutes);

app.get('/',(req,res)=>{
    res.json("hello it is working");
});


// Database connection
const dbURL = process.env.database_url ;
mongoose.connect(dbURL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error);
    });

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
