const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({email: email});
        if(existeEmail){
            return res.status(400).json({
                ok: false,
                msg: "El correo ya esta registrado"
            });
        }

        const usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt);

        await usuario.save();

        // Generar mi jsonWebToken
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }
}

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const usuarioDB = await Usuario.findOne({email: email});
        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                msg: "Credenciales incorrectas"
            });
        }

        //Validar el password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: "Credenciales incorrectas"
            });
        }

        // Generar mi jsonWebToken
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

        /*res.json({
            ok: true,
            email: email,
            password: password
        });*/

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: "Hable con el administrador"
        });
    }
}

const renewToken = async ( req, res ) => {

    const uid = req.uid;

    // Generar mi jsonWebToken
    const token = await generarJWT( uid );

    //encontrar usuario
    const usuarioDB = await Usuario.findById(uid);
    if(!usuarioDB){
        return res.status(400).json({
            ok: false,
            msg: "No existe este usuario"
        });
    }

    res.json({
        ok: true,
        usuario: usuarioDB,
        token
    });
}

module.exports = {
    crearUsuario,
    login,
    renewToken
};