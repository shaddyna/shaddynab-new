const Inquiry = require('../models/Inquiry');
const Skill = require('../models/Skill');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Private
exports.createInquiry = async (req, res, next) => {
  try {
    // Get the service (skill) details
    const skill = await Skill.findById(req.body.service);
    if (!skill) {
      return next(new ErrorResponse('Service not found', 404));
    }

    // Get the seller details
    const seller = await User.findById(skill.user);
    if (!seller) {
      return next(new ErrorResponse('Service provider not found', 404));
    }

    // Check if user already sent an inquiry for this service
    const existingInquiry = await Inquiry.findOne({
      service: req.body.service,
      user: req.user.id
    });

    if (existingInquiry) {
      return next(new ErrorResponse('You have already sent an inquiry for this service', 400));
    }

    const inquiry = await Inquiry.create({
      ...req.body,
      user: req.user.id,
      seller: skill.user
    });

    res.status(201).json({
      success: true,
      data: inquiry
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all inquiries for a seller
// @route   GET /api/inquiries/seller
// @access  Private/Seller
exports.getSellerInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ seller: req.user.id })
      .populate('service', 'title price deliveryTime')
      .populate('user', 'firstName lastName email');

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all inquiries sent by a user
// @route   GET /api/inquiries/user
// @access  Private
exports.getUserInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ user: req.user.id })
      .populate('service', 'title price deliveryTime')
      .populate('seller', 'firstName lastName');

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id/status
// @access  Private/Seller
exports.updateInquiryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return next(new ErrorResponse('Inquiry not found', 404));
    }

    // Check if the logged in user is the seller
    if (inquiry.seller.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this inquiry', 401));
    }

    inquiry.status = status;
    await inquiry.save();

    res.status(200).json({
      success: true,
      data: inquiry
    });
  } catch (err) {
    next(err);
  }
};