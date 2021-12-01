/*
*  path: /api/login
*/


const { Router, response } = require("express");
const { check } = require("express-validator");

const { crearUsuario, login, renewToken } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
//const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post("/new", [
    check("nombre","El nombre es obligatorio").not().isEmpty(),
    check("password","El password es obligatorio").not().isEmpty(),
    //check("password","El password debe ser más seguro").not().isStrongPassword(),
    check("email","El email es obligatorio").not().isEmpty(),
    check("email","Introduce un formato correcto de email").isEmail(),
    validarCampos
], crearUsuario);

router.post("/", [
    check("password","El password es obligatorio").not().isEmpty(),
    check("email","El email es obligatorio").not().isEmpty(),
    check("email","Introduce un formato correcto de email").isEmail(),
    validarCampos
], login);


router.get("/renew", validarJWT, renewToken);

module.exports = router;