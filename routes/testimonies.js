const Joi = require('joi');
const express = require('express');
const router = express.Router();

const testimonies = [
    { id: 1, name: 'testimony1'},
    { id: 2, name: 'testimony2'},
    { id: 3, name: 'testimony3'},
];

// get all testimonies
router.get('/', (req, res) => {
    res.send(testimonies);
});

// add a new testimony
router.post('/', (req, res) => {
    const { error } = validateTestimony(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const testimony = {
        id: testimonies.length + 1,
        name: req.body.name
    };

    testimonies.push(testimony);
    res.send(testimony);
});

// update a testimony
router.put('/:id', (req, res) => {
    const testimony = testimonies.find(c => c.id === parseInt(req.params.id));
    if (!testimony) return res.status(404).send('Testimony not found');

    const { error } = validateTestimony(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    testimony.name = req.body.name;
    res.send(testimony);
});

// delete a testimony
router.delete('/:id', (req, res) => {
    const testimony = testimonies.find(c => c.id === parseInt(req.params.id));
    if (!testimony) return res.status(404).send('Testimony not found');

    const index = testimonies.indexOf(testimony);
    testimonies.splice(index, 1);

    res.send(testimony);
});

// get a single testimony
router.get('/:id', (req, res) => {
    const testimony = testimonies.find(c => c.id === parseInt(req.params.id));
    if (!testimony) return res.status(404).send('Testimony not found');
    res.send(testimony);
});

function validateTestimony(testimony) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(testimony, schema);
};

module.exports = router;