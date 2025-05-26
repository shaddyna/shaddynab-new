const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;
const Shop = require('../models/Shop');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const productController = {
  // Create a new product
createProduct: async (req, res) => {
  try {
    // Extract product data from req.body
    const { name, designer, mainCategory, subCategory, brand, price, stock, attributes } = req.body;

    // Parse attributes if they come as a string (FormData serialization)
    const parsedAttributes = typeof attributes === 'string' ? JSON.parse(attributes) : attributes;

    // Find the shop owned by the authenticated user
    const shop = await Shop.findOne({ owner: req.user.id });
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found for this user' });
    }

    // Upload images to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'products' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(file.buffer);
        });
        imageUrls.push(result.secure_url);
      }
    }

    // Prepare product data object for logging
const productData = {
  name,
  designer,
  category: {
    main: mainCategory,
    sub: subCategory,
    brand
  },
  price: parseFloat(price),
  stock: parseInt(stock),
  images: imageUrls,
  attributes: parsedAttributes,
  shop: {
    id: shop._id,
    name: shop.name
  },
  owner: req.user.id
};


    console.log('Product data to be saved:', productData);

    // Create new product with shop reference
    const newProduct = new Product(productData);

    await newProduct.save();

    res.status(201).json({
      success: true,
      product: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
},
  // Get all products
  getProducts: async (req, res) => {
    try {
      const products = await Product.find().populate('shop', 'name').populate('owner', 'username');
      res.status(200).json({
        success: true,
        products
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching products',
        error: error.message
      });
    }
  },

  // Get a single product by ID
  getProductById: async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).populate('shop', 'name').populate('owner', 'username');
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      res.status(200).json({
        success: true,
        product
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching product',
        error: error.message
      });
    }
  }

}


module.exports = productController;