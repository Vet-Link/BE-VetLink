const Joi = require('joi');

function isUsernameTooShort(username) {
    // Check if username is at least 5 characters long
    if (username.length < 4) {
        return true;
    } else {
        return false;
    }
}

function isUsernameTooLong(username) {
    // Check if username is no longer than 15 characters long
    if (username.length > 16) {
        return true;
    } else {
        return false;
    }
}

function isUsernameHasSymbol(username) {
    // Check if username contains only letters and numbers
    const regex = /^[a-zA-Z0-9]+$/;
    if(regex.test(username)) {
        return false;
    } else {
        return true;
    }
}
  
const passwordSchema = Joi.string()
    .min(8)
    .max(30)
    .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};\'":,.<>\\/?]+$'))
    .message('Password must be between 8 and 30 characters long, and contain only letters, numbers, or special characters.')
    .required()
    .messages({
        'string.base': 'Password should be a type of text',
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password should have a minimum length of 8',
        'string.max': 'Password should have a maximum length of 30',
        'any.required': 'Password is required'
    });

const validatePassword = (password) => {
    const { error } = passwordSchema.validate(password);
    if (error) {
        throw new Error(error.details[0].message);
    }
};

module.exports = {
    isUsernameTooShort,
    isUsernameTooLong,
    isUsernameHasSymbol,
    validatePassword,
}