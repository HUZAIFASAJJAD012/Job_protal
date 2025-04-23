import { check, validationResult } from 'express-validator';

const emailAndPasswordValidation = [
  check('email')
    .isEmail().withMessage('Please enter a valid email address'),

  check('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, "i")
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

 
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(422).json({ errors: errors.array() });
}

export { emailAndPasswordValidation, validate };
