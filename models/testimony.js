const mongoose = require('mongoose');
const Joi = require('joi');

const Testimony = mongoose.model('Testimony', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 55
    },
    date: {
        type: Date,
        default: Date.now
    },
    story: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 2000
    },
    author: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    }
}));

function validateTestimony(testimony) {
    const schema = {
        title: Joi.string().min(5).max(55).required(),
        story: Joi.string().min(10).max(2000).required(),
        author: Joi.string().min(2).max(30).required()
    };

    return Joi.validate(testimony, schema);
};

exports.Testimony = Testimony;
exports.validate = validateTestimony;