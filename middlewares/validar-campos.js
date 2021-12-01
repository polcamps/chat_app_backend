const { validationResult } = require("express-validator");

const validarCampos = (request, response, next) => {

    //El next es el middelware que trucarà questa funció, si no hi ha cap error en les peticions de entrada
    
    const errores = validationResult(request);

    if(!errores.isEmpty()){
        return response.status(400).json({
            ok: false,
            errores: errores.mapped()
        });
    }

    next();
};

module.exports = {
    validarCampos
};