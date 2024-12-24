const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');


const addUser = async(req, res = response) => {

    const { name, email, password } = req.body;

    try {
        
        // Verifico si existe un usuario con el mismo email en la db
        let user = await User.findOne({ email });
        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Email ya registrado'
            })
        }

        // Si no existe, instancio el modelo User creado
        user = new User( req.body );

        //  Encripto la contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        // Y lo guardo en la db
        await user.save();

        // Genero el JWT
        const token = await generateJWT( user.id, user.name );

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar el registro'
        });
    }
}

const loginUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        // Verifico si existe un usuario con el mail registrado
        const user = await User.findOne({ email });
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'No se ha encontrado usuario con ese email registrado'
            })
        }

        // Confirmo si coinciden las contraseñas
        const validPassword = bcrypt.compareSync( password, user.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        // Genero el JWT
        const token = await generateJWT( user.id, user.name );

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'No se ha podido completar el inicio de sesión'
        });
    }
}

const renewToken = async (req, res = response) => {
    const { uid, name } = req;
    const token = await generateJWT( uid, name );
    res.json({
        ok: true,
        token
    });
}

module.exports = {
    addUser,
    loginUser,
    renewToken
}