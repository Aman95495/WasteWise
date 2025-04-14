import express from 'express';
import { verifyToken } from '../Utils/verifyToken.js';
import {
  createRequest,
  getVendorRequests,
  updateRequest,
  getUserRequests,
  getRequestById
} from '../Controllers/request.controller.js';

const router = express.Router();

// Create new pickup request
router.post('/', verifyToken, createRequest);

// Get all requests for a vendor
router.get('/vendor/:vendorId', verifyToken, getVendorRequests);

// Get all requests for current user
router.get('/user', verifyToken, getUserRequests);

// Get single request by ID
router.get('/:id', verifyToken, getRequestById);

// Update request status
router.put('/:id', verifyToken, updateRequest);

export default router;