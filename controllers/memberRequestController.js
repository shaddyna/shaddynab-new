// controllers/memberRequestController.js
const MemberRequest = require('../models/MemberRequest');
const User = require('../models/User');
const Member = require('../models/Member');

exports.createMembershipRequest = async (req, res) => {
  try {
    const { mpesaName, mpesaCode } = req.body;
    const amount = 500; // Static amount in KES

    // 🔍 Log the incoming request data
    console.log('Received body:', req.body);
    console.log('Received user from token:', req.user);

    const existingRequest = await MemberRequest.findOne({
      userId: req.user.id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ 
        error: 'You already have a pending membership request' 
      });
    }

    const memberRequest = new MemberRequest({
      userId: req.user.id,
      mpesaName,
      mpesaCode,
      amount,
      paymentMethod: 'mpesa'
    });

    await memberRequest.save();

    res.status(201).json({
      message: 'Membership request submitted successfully',
      request: memberRequest
    });
  } catch (error) {
    console.error('Error creating membership request:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Get all member requests (admin only)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await MemberRequest.find()
      .populate('userId', 'firstName lastName email')
      .populate('processedBy', 'firstName lastName email')
      .sort('-createdAt');

    res.json(requests);
  } catch (error) {
    console.error('Error fetching member requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single member request
exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await MemberRequest.findById(id)
      .populate('userId', 'firstName lastName email')
      .populate('processedBy', 'firstName lastName email');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update member request (admin or user)
/*exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Fetch the request with the user populated
    const request = await MemberRequest.findById(id).populate('userId');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Update request status, processedBy, and processedAt
    request.status = status;
    //request.processedBy = req.user.id;
    request.processedAt = new Date();

    await request.save();

if (status === 'approved') {
  const user = await User.findById(request.userId._id);

  if (user) {
    user.role = 'member';
    await user.save();

    const existingMember = await Member.findOne({ email: user.email });

    if (!existingMember) {
      await Member.create({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        mpesaCode: request.mpesaCode,
        amount: request.amount,
        status: 'active'
      });
    }
  }
}


    res.json({
      message: 'Request updated successfully',
      request
    });

  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Server error' });
  }
};*/

exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Fetch the request with the user populated
    const request = await MemberRequest.findById(id).populate('userId');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Update request status, processedBy, and processedAt
    request.status = status;
    // request.processedBy = req.user.id;
    request.processedAt = new Date();
    await request.save();

    if (status === 'approved') {
      const user = await User.findById(request.userId._id);

      if (user) {
        // ✅ Mark the user as a member instead of changing role
        user.member = true;
        await user.save();

        const existingMember = await Member.findOne({ email: user.email });

        if (!existingMember) {
          await Member.create({
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phoneNumber: user.phoneNumber || '',
            mpesaCode: request.mpesaCode,
            amount: request.amount,
            status: 'active'
          });
        }
      }
    }

    res.json({
      message: 'Request updated successfully',
      request
    });

  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Delete member request
exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRequest = await MemberRequest.findByIdAndDelete(id);

    if (!deletedRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Check for pending request
exports.checkPendingRequest = async (req, res) => {
  try {
    const existingRequest = await MemberRequest.findOne({
      userId: req.user.id,
      status: 'pending'
    });

    res.json({ 
      hasPendingRequest: !!existingRequest,
      request: existingRequest || null
    });
  } catch (error) {
    console.error('Error checking pending request:', error);
    res.status(500).json({ error: 'Server error' });
  }
};