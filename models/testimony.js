const mongoose = require('mongoose');
const Joi = require('joi');

const Testimony = mongoose.model('Testimony', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    date: {
        type: Date,
        default: Date.now
    },
    post: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 2000
    }
}));

function validateTestimony(testimony) {
    const schema = {
        title: Joi.string().min(3).max(30).required(),
        post: Joi.string().min(10).max(2000).required()
    };

    return Joi.validate(testimony, schema);
};

exports.Testimony = Testimony;
exports.validate = validateTestimony;