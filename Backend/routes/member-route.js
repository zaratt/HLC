const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async-middleware');
const userController = require('../controllers/user-controller');
const doctorController = require('../controllers/doctor-controller')

const upload = require('../services/file-upload-service');


router.patch('/user', upload.single('profile'), asyncMiddleware(userController.updateUser));          // Update Self Account
router.post('/doctor', upload.single('image'), asyncMiddleware(doctorController.createDoctor));         // Create Doctor
router.patch('/doctors/:id', upload.single('image'), asyncMiddleware(doctorController.updateDoctor));   // Update a Doctor
router.get('/doctors', asyncMiddleware(doctorController.getDoctors));                                    // Doctors
router.get('/doctor/:id', asyncMiddleware(doctorController.getDoctor));                                  // Doctor


module.exports = router;