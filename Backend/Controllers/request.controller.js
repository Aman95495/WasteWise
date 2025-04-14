import Request from '../Models/request.model.js';
import Vendor from '../Models/vendor.model.js';
import User from '../Models/user.model.js';

// Create new pickup request
export const createRequest = async (req, res) => {
  try {
    const {
      user,
      vendor,
      materialType,
      quantity,
      pickupAddress,
      pickupCoordinates
    } = req.body;

    // Verify vendor exists
    const foundVendor = await Vendor.findById(vendor);
    if (!foundVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    // Get price from vendor's pricing
    const pricePerKg = foundVendor.pricePerKg[materialType];
    if (!pricePerKg) {
      return res.status(400).json({ message: 'Material not accepted by vendor' });
    }

    const newRequest = new Request({
      user, // Now properly populated
      vendor,
      materialType,
      quantity,
      pickupAddress,
      pickupCoordinates: {
        type: 'Point',
        coordinates: pickupCoordinates
      },
      pricePerKg,
      totalPrice: pricePerKg * quantity
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error });
  }
};


// Get vendor's requests
export const getVendorRequests = async (req, res) => {
  try {
    const requests = await Request.find({ vendor: req.params.vendorId })
      .populate('user', 'username email location')
      .sort({ createdAt: -1 });

    // Calculate stats
    const stats = {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      completed: requests.filter(r => r.status === 'completed').length
    };

    res.status(200).json({ requests, stats });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor requests' });
  }
};

// Get user's requests
export const getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user._id })
      .populate('vendor', 'companyName phone')
      .sort({ createdAt: -1 });
      
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user requests' });
  }
};

// Update request status
export const updateRequest = async (req, res) => {
  try {
    const { action, user } = req.body;
    const validActions = ['accept', 'complete', 'cancel'];
    
    if (!validActions.includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Authorization check
    if (
      !user._id.equals(request.user) &&
      !user._id.equals(request.vendor)
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Update status and history
    request.status = action === 'accept' ? 'accepted' 
                 : action === 'complete' ? 'completed' 
                 : 'cancel';
    
    request.history.push({
      status: request.status,
      updatedBy: user._id
    });

    await request.save();
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error updating request' });
  }
};

// Get single request
export const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('user', 'username email location')
      .populate('vendor', 'companyName phone');
      
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching request' });
  }
};