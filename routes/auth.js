/*
    Rutas de Auth
    host + /api/auth
*/

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { addUser, loginUser, renewToken } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/field-validator');
const { JSWValidator } = require('../middlewares/jwt-validator');


router.post(
    '/new',
    [ // middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min: 6}),
        fieldValidator
    ],
    addUser
);

router.post(
    '/', 
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min: 6}),
        fieldValidator
    ], 
    loginUser
);

router.get('/renew', JSWValidator, renewToken);

module.exports = router;