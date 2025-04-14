import express from 'express';
import { verifyToken } from '../Utils/verifyToken.js';
import { getAllVendors, getVendor, updateVendorInfo, updateVendorPassword, deleteVendorAccount, getNearbyVendors } from '../Controllers/vendor.controller.js';

const router = express.Router();

router.get('/nearby', getNearbyVendors); // New route for nearby vendors
router.get('/:id', verifyToken, getVendor);
router.post('/update/:id', verifyToken, updateVendorInfo);
router.post('/update-password/:id', verifyToken, updateVendorPassword);
router.delete('/delete/:id', verifyToken, deleteVendorAccount);
router.get('/all', getAllVendors);


export default router;