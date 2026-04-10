const express = require('express');
const router = express.Router();
const {
    addEducation,
    getAllEducation,
    deleteEducation,
    updateEducation
} = require('../controller/education/educationCon');

router.post('/add', addEducation);
router.get('/all', getAllEducation);
router.delete('/delete/:id', deleteEducation);
router.patch('/update/:id', updateEducation);

module.exports = router;
