/*
    Events Routes
    host + /api/events
*/

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { fieldValidator } = require('../middlewares/field-validator')
const { getEvents, addEvent, deleteEvent, updateEvent } = require('../controllers/events');
const { JSWValidator } = require('../middlewares/jwt-validator');
const { isDate } = require('../helpers/isDate');

// Todas las rutas son validadas por este este middleware 'JSWValidator'
router.use( JSWValidator )


// Get events
router.get('/', getEvents );

// Add event
router.post('/',
    [
        check('title', 'El titulo del evento es obligatorio').not().isEmpty(),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha de finalización es obligatoria').custom( isDate ),
        fieldValidator
    ],
    addEvent );

// Update event
router.put('/:id', updateEvent );

// Delete  event
router.delete('/:id', deleteEvent );


module.exports = router;
