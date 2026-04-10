const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../utils/multer');
const { addProject, getAllProjects, updateProject, deleteProject } = require('../controller/project/projectCon');

router.post('/add', auth, upload.single('screenshot'), addProject);
router.get('/all', getAllProjects);
router.patch('/update/:id', auth, upload.single('screenshot'), updateProject);
router.delete('/delete/:id', auth, deleteProject);

module.exports = router;
