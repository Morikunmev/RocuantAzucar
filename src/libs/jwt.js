//Importa la biblioteca JWT para manejar tokens
import jwt from "jsonwebtoken";

//Define y exporta una funcion que crea tokens de acceso
export const createAccessToken = (payload) => {
//Retorna una nueva Promesa que encapsula la creacion del token
  return new Promise((resolve, reject) => {
    //Usa el metodo sign de jwt para crear el token
    jwt.sign(
      payload, //los datos que quieres incluir en el token
      "xyz123", //la clave secreta para firmar el token
      {
        expiresIn: "1d", //Configuración: el token expira en 1 dia
      },
      //Funcion callback que se ejecuta cuando termina de crear el token
      (err, token) => {
        //Si hay un error, rechaza la promesa
        if (err) reject(err);
        //Si todo va bien,resuelve la promesa con el token
        resolve(token);
      }
    );
  });
};
