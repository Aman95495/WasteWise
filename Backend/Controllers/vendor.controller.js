import Vendor from "../Models/vendor.model.js";
import { errorHandler } from '../Utils/error.js';
import bcrypt from 'bcryptjs';


export const getVendor = async (req, res, next) => {
    try {
        const vendor = await Vendor.findById(req.params.id).select('-password');

        if (!vendor) {
            return next(errorHandler(404, 'Vendor not found'));
        }

        res.status(200).json(vendor);
    } catch (error) {
        next(error);
    }
}

export const getAllVendors = async (req, res, next) => {
    try {
        const vendors = await Vendor.find().select('-password');
        res.status(200).json(vendors);
    } catch (error) {
        next(error);
    }
}

// Update vendor information
export const updateVendorInfo = async (req, res, next) => {
    try {
        // Check if vendor is updating their own profile
        if (req.user.id !== req.params.id) {
            return next(errorHandler(401, 'You can only update your own profile'));
        }

        // Validate email uniqueness if email is being updated
        if (req.body.email) {
            const existingVendor = await Vendor.findOne({ email: req.body.email });
            if (existingVendor && existingVendor._id.toString() !== req.params.id) {
                return next(errorHandler(400, 'Email already in use'));
            }
        }

        // Validate username uniqueness if username is being updated
        if (req.body.username) {
            const existingVendor = await Vendor.findOne({ username: req.body.username });
            if (existingVendor && existingVendor._id.toString() !== req.params.id) {
                return next(errorHandler(400, 'Username already in use'));
            }
        }

        // Validate phone uniqueness if phone is being updated
        if (req.body.phone) {
            const existingVendor = await Vendor.findOne({ phone: req.body.phone });
            if (existingVendor && existingVendor._id.toString() !== req.params.id) {
                return next(errorHandler(400, 'Phone number already in use'));
            }
        }

        // Prepare the update object based on the request body
        const updateFields = {};

        if (req.body.username) updateFields.username = req.body.username;
        if (req.body.email) updateFields.email = req.body.email;
        if (req.body.avatar) updateFields.avatar = req.body.avatar;
        if (req.body.phone) updateFields.phone = req.body.phone;
        if (req.body.areasCovered) updateFields.areasCovered = req.body.areasCovered;
        if (req.body.pricePerKg) {
            updateFields.pricePerKg = {
                plastic: req.body.pricePerKg.plastic,
                metal: req.body.pricePerKg.metal,
                paper: req.body.pricePerKg.paper,
                glass: req.body.pricePerKg.glass,
                ewaste: req.body.pricePerKg.ewaste
            };
        }
        if (req.body.companyName) updateFields.companyName = req.body.companyName;
        if (req.body.vehicleType) {
            const validVehicleTypes = ['Truck', 'Van', 'Auto', 'Cycle', 'Other'];
            if (validVehicleTypes.includes(req.body.vehicleType)) {
                updateFields.vehicleType = req.body.vehicleType;
            } else {
                return next(errorHandler(400, 'Invalid vehicle type'));
            }
        }
        if (req.body.serviceHours) {
            updateFields.serviceHours = {
                start: req.body.serviceHours.start,
                end: req.body.serviceHours.end
            };
        }
        if (req.body.certification) updateFields.certification = req.body.certification;
        if (req.body.profileCompleted !== undefined) updateFields.profileCompleted = req.body.profileCompleted;

        // Update vendor information
        const updatedVendor = await Vendor.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true } // Return the updated document
        ).select('-password'); // Exclude password from the response

        if (!updatedVendor) {
            return next(errorHandler(404, 'Vendor not found'));
        }

        res.status(200).json(updatedVendor);
    } catch (error) {
        next(error);
    }
};


// Update vendor password
export const updateVendorPassword = async (req, res, next) => {
    try {
        // Check if vendor is updating their own password
        if (req.user.id !== req.params.id) {
            return next(errorHandler(401, 'You can only update your own password'));
        }

        // Validate current password
        const vendor = await Vendor.findById(req.params.id);
        const isMatch = await bcrypt.compare(req.body.currentPassword, vendor.password);
        if (!isMatch) {
            return next(errorHandler(400, 'Current password is incorrect'));
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        vendor.password = hashedPassword;
        await vendor.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
};

// Delete vendor account
export const deleteVendorAccount = async (req, res, next) => {
    try {
        // Check if vendor is deleting their own account
        if (req.user.id !== req.params.id) {
            return next(errorHandler(401, 'You can only delete your own account'));
        }

        // Delete vendor account
        const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);

        
        if (!deletedVendor) {
            return next(errorHandler(404, 'Vendor not found'));
        }

        res.clearCookie('access_token');

        res.status(200).json({
            message: 'Vendor account deleted successfully',
            success: true,
        });
    } catch (error) {
        next(error);
    }
};

// In vendor.controller.js
export const getNearbyVendors = async (req, res) => {
    try {
      const { lat, lng } = req.query;
      
      // Convert string coordinates to numbers
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);

  
      // Basic validation
      if (!latitude || !longitude) {
        return res.status(400).json({ 
          success: false, 
          message: 'Latitude and longitude are required' 
        });
      }
  
      // Example using MongoDB geospatial query
      // Assuming your Vendor model has a location field with coordinates
      const vendors = await Vendor.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude]
            },
            $maxDistance: 250000 // 10km radius (in meters)
          }
        }
      }).limit(20); // Limit to 20 nearest vendors

  
      res.status(200).json({
        success: true,
        data: vendors
      });
  
    } catch (error) {
      console.error('Error fetching nearby vendors:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching nearby vendors',
        error: error.message
      });
    }
  };