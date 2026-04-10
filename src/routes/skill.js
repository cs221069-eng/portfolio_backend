const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addSkill, getAllSkills, deleteSkill, updateSkill } = require('../controller/skill/skillCon');   


router.post('/add', auth, addSkill);

router.get('/all', getAllSkills);

router.delete('/delete/:id', auth, deleteSkill);

router.patch('/update/:id', auth, updateSkill );


module.exports = router;

