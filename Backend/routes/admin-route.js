const router = require('express').Router();
const userController = require('../controllers/user-controller');
const teamController = require('../controllers/team-controller');
const doctorController = require('../controllers/doctor-controller');
const upload = require('../services/file-upload-service');
const asyncMiddleware = require('../middlewares/async-middleware');

router.post('/user', upload.single('profile'), asyncMiddleware(userController.createUser));              // Create User
router.patch('/user/:id', upload.single('profile'), asyncMiddleware(userController.updateUser));         // Update User
router.get('/members', asyncMiddleware(userController.getUsers));                                         // Members
router.get('/members/free', asyncMiddleware(userController.getFreeMembers));                               // Free Members
router.get('/member/:id', asyncMiddleware(userController.getUser));                                         // Member
router.get('/user/:id', asyncMiddleware(userController.getUserNoFilter));                                  // User - No Filter (Admin,Leader,Member)
router.get('/admins', asyncMiddleware(userController.getUsers));                                           // Admins
router.get('/admin/:id', asyncMiddleware(userController.getUser));                                         // Admin
router.get('/leaders/free', asyncMiddleware(userController.getFreeLeaders));                              // Free Leaders
router.get('/leaders', asyncMiddleware(userController.getLeaders));                                       // Leaders
router.get('/leader/:id', asyncMiddleware(userController.getUser));                                       // Leader
router.post('/team', upload.single('image'), asyncMiddleware(teamController.createTeam));                 // Create Team
router.patch('/team/:id', upload.single('image'), asyncMiddleware(teamController.updateTeam));            // Update Team
router.get('/teams', asyncMiddleware(teamController.getTeams));                                          // Teams
router.get('/team/:id', asyncMiddleware(teamController.getTeam));                                        // Team
router.get('/team/:id/members', asyncMiddleware(teamController.getTeamMembers));                         // Team Members
router.patch('/team/member/add', asyncMiddleware(teamController.addMember));                             // Add Team Member
router.patch('/team/member/remove', asyncMiddleware(teamController.removeMember));                        // Remove Team Member
router.patch('/team/leader/add', asyncMiddleware(teamController.addRemoveLeader));                       // Add Team Leader
router.patch('/team/leader/remove', asyncMiddleware(teamController.addRemoveLeader));                   // Remove Team Leader
router.post('/doctor', upload.single('image'), asyncMiddleware(doctorController.createDoctor));         // Create Doctor
router.patch('/doctors/:id', upload.single('image'), asyncMiddleware(doctorController.updateDoctor));   // Update a Doctor
router.get('/doctors', asyncMiddleware(doctorController.getDoctors));                                    // Doctors
router.get('/doctor/:id', asyncMiddleware(doctorController.getDoctor));                                  // Doctor
router.get('/doctors/free', asyncMiddleware(doctorController.getFreeDoctors));                           // Free Doctors



router.get('/counts', asyncMiddleware(teamController.getCounts));                                         // Counts





module.exports = router;