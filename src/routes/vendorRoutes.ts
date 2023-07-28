import express from 'express';
import {verifyVendor, registerVendor,
    vendorChangeLoginPassword,
    getAllVendors, 
    vendorLogin, vendorEditProfile} from '../controllers/vendorControllers';
import {authVerify, vendorauth} from '../middleware/authorization';

const router = express.Router();

router.post('/verify_vendor', verifyVendor)
router.post('/createVendor', authVerify, registerVendor)
router.post('/login', vendorLogin)
router.post('/change_password', vendorauth, vendorChangeLoginPassword)
router.put('/update_profile', vendorauth, vendorEditProfile)
router.get('/getall', getAllVendors)
export default router;