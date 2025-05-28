/*const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware');
const { authorize } = require('../middleware/auth');
const protect = require('../middleware/authMiddleware');

//router.use(authorize('admin'));
router.post('/', protect, upload.array('images', 5), productController.createProduct);
// Simple GET endpoint for all products
router.get('/', productController.getProducts);

module.exports = router;*/
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/uploadMiddleware');
const { authorize } = require('../middleware/auth');
const protect = require('../middleware/authMiddleware');

// Protect all routes
//router.use(protect);

// Create a new product
router.post('/', upload.array('images', 5), productController.createProduct);

// Get all products
router.get('/', productController.getProducts);

// Get products by user owner
router.get('/user/:userId', productController.getProductsByUser);

// Get products by shop owner
router.get('/shop/:shopId', productController.getProductsByShop);

// Get a single product by ID
router.get('/:id', productController.getProductById);

module.exports = router;