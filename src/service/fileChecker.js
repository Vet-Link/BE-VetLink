/*const path = require('path');
const Joi = require('joi');

// Function to check if the file is a jpg or jpeg image
function isJpgOrJpeg(filePath) {
    const validExtensions = ['.jpg', '.jpeg'];
    const fileExtension = path.extname(filePath).toLowerCase();
    return validExtensions.includes(fileExtension);
}

// Joi schema for jpg/jpeg image validation
const imageSchema = Joi.object({
    filePath: Joi.string()
        .custom((value, helpers) => {
            if (!isJpgOrJpeg(value)) {
                return helpers.message('Invalid image format. Only .jpg and .jpeg are allowed.');
            }
            return value;
        })
        .required()
        .messages({
            'string.base': 'File path should be a type of text',
            'string.empty': 'File path cannot be empty',
            'any.required': 'File path is required'
        }),
});

// Function to validate the image using Joi schema
const validateImage = (filePath) => {
    const { error } = imageSchema.validate({ filePath });
    if (error) {
        throw new Error(error.details[0].message);
    }
};

module.exports = {
    isJpgOrJpeg,
    validateImage,
};
*/