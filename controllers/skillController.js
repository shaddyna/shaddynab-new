const Skill = require('../models/Skill');
const cloudinary = require('cloudinary').v2;
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new skill
// @route   POST /api/skills
// @access  Private/Seller
/*exports.createSkill = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    // Upload images to Cloudinary
    const imageUrls = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        {
          folder: 'skills',
          resource_type: 'auto'
        }
      );
      imageUrls.push(result.secure_url);
    }

    req.body.images = imageUrls;

    const skill = await Skill.create(req.body);

    res.status(201).json({
      success: true,
      data: skill
    });
  } catch (err) {
    next(err);
  }
};*/
exports.createSkill = async (req, res, next) => {
  try {
    // Log incoming files and body
    console.log('Incoming Files:', req.files);
    console.log('Incoming Body:', req.body);
    console.log('Authenticated User ID:', req.user.id);

    // Add user to req.body
    req.body.user = req.user.id;

    // Upload images to Cloudinary
    const imageUrls = [];
    for (const file of req.files) {
      console.log(`Uploading file: ${file.originalname}`);
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        {
          folder: 'skills',
          resource_type: 'auto'
        }
      );
      console.log('Upload result:', result);
      imageUrls.push(result.secure_url);
    }

    req.body.images = imageUrls;

    // Log final body before creating skill
    console.log('Final Skill Data:', req.body);

    const skill = await Skill.create(req.body);

    res.status(201).json({
      success: true,
      data: skill
    });
  } catch (err) {
    console.error('Error in createSkill:', err);
    next(err);
  }
};


// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
exports.getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().populate('user', 'firstName lastName');

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
exports.getSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id).populate('user', 'firstName lastName');

    if (!skill) {
      return next(new ErrorResponse(`Skill not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private/Seller
exports.updateSkill = async (req, res, next) => {
  try {
    let skill = await Skill.findById(req.params.id);

    if (!skill) {
      return next(new ErrorResponse(`Skill not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is skill owner
    if (skill.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this skill`, 401));
    }

    skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: skill
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private/Seller
exports.deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return next(new ErrorResponse(`Skill not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is skill owner
    if (skill.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this skill`, 401));
    }

    // Delete images from Cloudinary
    for (const imageUrl of skill.images) {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`skills/${publicId}`);
    }

    await skill.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};