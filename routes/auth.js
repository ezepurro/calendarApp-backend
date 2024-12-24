/*
    Rutas de Auth
    host + /api/auth
*/

const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const { addUser, loginUser, renewToken } = require('../controllers/auth')


router.post(
    '/new',
    [ // middlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min: 6})
    ],
    addUser
);

router.post(
    '/', 
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({min: 6})
    ], 
    loginUser
);

router.get('/renew', renewToken);

module.exports = router;