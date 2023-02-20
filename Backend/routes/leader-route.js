const router = require('express').Router();
const asyncMiddleware = require('../middlewares/async-middleware');
const userController = require('../controllers/user-controller');
const teamController = require('../controllers/team-controller');
const leaderController = require('../controllers/leader-controller');
const doctorController = require('../controllers/doctor-controller')
const upload = require('../services/file-upload-service');

router.patch('/user', upload.single('profile'), asyncMiddleware(userController.updateUser));      // Update Self Profile
router.get('/team', asyncMiddleware(leaderController.getTeam));                                  // Team
router.patch('/team/:id', upload.single('image'), asyncMiddleware(teamController.updateTeam));    // Update Team
router.get('/team/members', asyncMiddleware(leaderController.getTeamMembers));                   // Team Members
router.patch('/team/member/add', asyncMiddleware(teamController.addMember));                     // Add Team Member
router.patch('/team/member/remove', asyncMiddleware(teamController.removeMember));               // Remove Team Member
router.get('/doctor', asyncMiddleware(doctorController.createDoctor));                           // Create Doctor
router.get('/doctors/:id', asyncMiddleware(doctorController.updateDoctor));                      // Update a Doctor
router.get('/doctors', asyncMiddleware(doctorController.getDoctors));                            // Doctors
router.get('/doctors/:id', asyncMiddleware(doctorController.getDoctor));                         // Doctor
router.get('/counts', asyncMiddleware(teamController.getCounts));                                // Counts


module.exports = router;