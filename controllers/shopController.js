const Shop = require('../models/Shop');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new shop
// @route   POST /api/shops
// @access  Private/Seller
exports.createShop = async (req, res, next) => {
  try {
    // Check if user already has a shop
    const existingShop = await Shop.findOne({ owner: req.user.id });
    if (existingShop) {
      return next(new ErrorResponse('User already has a shop', 400));
    }

    // Upload image to Cloudinary
    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        {
          folder: 'shops',
          resource_type: 'auto'
        }
      );
      imageUrl = result.secure_url;
    } else {
      return next(new ErrorResponse('Please upload a shop image', 400));
    }

    // Prepare shop data
    const shopData = {
      ...req.body,
      owner: req.user.id,
      image: imageUrl,
      workingHours: JSON.parse(req.body.workingHours),
      contact: {
        email: req.body.email,
        phone: req.body.phone,
        instagram: req.body.instagram,
        facebook: req.body.facebook,
        twitter: req.body.twitter
      },
      policies: {
        returnPolicy: req.body.returnPolicy,
        shippingPolicy: req.body.shippingPolicy
      }
    };

    const shop = await Shop.create(shopData);

    // Update user role to seller
    await User.findByIdAndUpdate(req.user.id, { role: 'seller' });

    res.status(201).json({
      success: true,
      data: shop
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all shops
// @route   GET /api/shops
// @access  Public
exports.getShops = async (req, res, next) => {
  try {
    const shops = await Shop.find().populate('owner', 'firstName lastName');

    res.status(200).json({
      success: true,
      count: shops.length,
      data: shops
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single shop
// @route   GET /api/shops/:id
// @access  Public
exports.getShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('owner', 'firstName lastName');

    if (!shop) {
      return next(new ErrorResponse(`Shop not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: shop
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get shop by user
// @route   GET /api/shops/user/:userId
// @access  Public
exports.getShopByUser = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ owner: req.params.userId }).populate('owner', 'firstName lastName');

    if (!shop) {
      return next(new ErrorResponse(`Shop not found for user ${req.params.userId}`, 404));
    }

    res.status(200).json({
      success: true,
      data: shop
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update shop
// @route   PUT /api/shops/:id
// @access  Private/Shop Owner
exports.updateShop = async (req, res, next) => {
  try {
    let shop = await Shop.findById(req.params.id);

    if (!shop) {
      return next(new ErrorResponse(`Shop not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is shop owner
    if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this shop`, 401));
    }

    shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: shop
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete shop
// @route   DELETE /api/shops/:id
// @access  Private/Shop Owner
exports.deleteShop = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return next(new ErrorResponse(`Shop not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is shop owner
    if (shop.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this shop`, 401));
    }

    // Delete image from Cloudinary
    if (shop.image) {
      const publicId = shop.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`shops/${publicId}`);
    }

    await shop.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
// ✅ Make sure this function is exported
exports.getMyShop = async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user.id });
  if (!shop) {
    return res.status(404).json({ message: "Shop not found" });
  }
  res.status(200).json({ success: true, data: shop });
};