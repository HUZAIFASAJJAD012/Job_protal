import express from 'express';
import {emailAndPasswordValidation, validate} from "../utils/Validations.js";
import schoolController from "../controllers/schoolController.js";
import {check} from 'express-validator';

const updatecheck = [
    check('email')
        .isEmail().withMessage('Please enter a valid email address'),

    check('password')
        .optional()
        .isLength({min: 8}).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, "i")
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];


const router = express.Router();

router.get('/get/job', schoolController.getJob);
router.get('/get-all-school', schoolController.getAllSchool);
router.get('/get/applied-candidate', schoolController.getappliedcandidate);
router.post('/register', emailAndPasswordValidation, validate, schoolController.register);
router.post('/update/:id', updatecheck, schoolController.update);
router.post('/add/job', schoolController.addJob);

export default router;