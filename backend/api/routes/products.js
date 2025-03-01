// routes/productRoutes.js


//normal body parser can't parse form data so we use multer
//form data includes field along with files or images

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAdmin = require('../middlewares/check-admin');
const multer = require('multer');
const path = require('path');
const Product = require('../models/product');
const upload = require('../multerConfig');
const cloudinary = require('../cloudinaryConfig');
//or import {Product} from '../models/product';

//multer

//file object after parsing
/*
{
  "fieldname": "profilePic", //name of the input tag of file
  "originalname": "avatar.png",//real name of file
  "encoding": "7bit",
  "mimetype": "image/png",
  "size": 34567,
  "destination": "./assets/images",
  "filename": "2024-10-02T12-15-30.123Zavatar.png",
  "path": "assets/images/2024-10-02T12-15-30.123Zavatar.png" //path after saving
}

 */





// Define routes
router.get('/', async(req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.post('/', checkAdmin, upload.single('productImage'), async (req, res) => {
    try {
        console.log("🔹 Incoming POST request to add a product");
        console.log("🔹 Request Body:", req.body);
        console.log("🔹 Uploaded File:", req.file);

        const { name, price } = req.body;

        if (!name || !price) {
            console.log("⚠️ Missing required fields:", { name, price });
            return res.status(400).json({
                message: "Please provide both name and price",
                providedFields: Object.keys(req.body)
            });
        }

        let productImage = undefined;
        if (req.file) {
            console.log("🔹 Uploading image to Cloudinary...");
            const result = await cloudinary.uploader.upload(req.file.path).catch(err => {
                console.error('❌ Cloudinary Upload Error:', err);
                throw new Error('Failed to upload to Cloudinary');
            });
            productImage = result.secure_url;
            console.log("✅ Image uploaded successfully:", productImage);
        }

        console.log("🔹 Creating new product document...");
        const newProduct = new Product({
            name,
            price: Number(price), // Ensure price is a number
            productImage,
            category: req.body.category || undefined,
            quantity: Number(req.body.quantity) || undefined,
            description: req.body.description || undefined
        });

        console.log("🔹 Saving product to database...");
        const product = await newProduct.save();
        console.log("✅ Product saved successfully:", product);

        return res.status(201).json({ product, message: "Created successfully" });
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ message: error.message });
    }
});


router.get('/:productId',async(req,res)=>{
    try {
        const { productId } = req.params;
        const numericProductId = Number(productId);
        if (isNaN(numericProductId)) {
            return res.status(400).send({ message: 'Invalid productId format' });
        }

        // Find the product by its productId field
        const product = await Product.findOne({ productId: numericProductId });



        if (!product) {
            return res.status(404).send({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }

});

router.get('/name/:productName', async (req, res) => {
    try {
        const { productName } = req.params;

        // Find all products that match the given name
        const docs = await Product.find({ name: productName }).select('_id name price');

        // Transform documents into the desired response format
        const response = {
            count: docs.length,
            products: docs.map(doc => ({
                id: doc._id,
                name: doc.name,
                price: doc.price,
                productImage: doc.productImage
            }))
        };

        // Check if no products were found
        if (response.count === 0) {
            return res.status(404).send({ message: 'No products found with that name' });
        }

        // Return the array of products
        res.status(200).json(response);
    } catch (error) {
        console.error('Error:', error); // Log the error for debugging
        res.status(500).send({ message: error.message });
    }
});



router.patch('/:productId', checkAdmin, upload.single('productImage'), async (req, res) => {
    try {
        const { productId } = req.params;

        const numericProductId = Number(productId);

        // Ensure productId is a number
        if (isNaN(numericProductId)) {
            return res.status(400).send({ message: 'Invalid productId format' });
        }

        let updateData = { ...req.body };
        
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            updateData.productImage = result.secure_url;
        }


        // Update the product using findOneAndUpdate
        const updatedProduct = await Product.findOneAndUpdate(
            { productId: numericProductId }, // Find by productId
            updateData,// Update with provided data
            { new: true } // Return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error during product update:', error.message); // Log the error
        res.status(500).send({ message: error.message });
    }
});




router.delete('/:productId', checkAdmin, async (req, res) => {
    try {
        const { productId } = req.params;
        const deletedProduct = await Product.findOneAndDelete({ productId });

        if (!deletedProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }

        // Delete image from Cloudinary
        if (deletedProduct.productImage) {
            const imagePublicId = deletedProduct.productImage.split('/').pop().split('.')[0]; // Extract public ID
            await cloudinary.uploader.destroy(imagePublicId);
        }

        res.status(200).send({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});



module.exports = router; // Ensure this line is present
