const validateUser = (req,res,next)=>{
  const user = req.body;

  if(typeof user.name != "string" || typeof user.lastname != "string" || typeof user.email != "string" || typeof user.username != "string" || typeof user.password != "string" || !user.name.trim() || !user.lastname.trim() || !user.email.trim() || !user.username.trim()|| !user.password ){
    return res.status(400).json({
      error:"Bad request",
      mensaje:"No deben existir espacios en blanco al registrar un usuario"
    });
  }
  next();
}
const validateAuth = (req,res,next)=>{
  const {username, password} = req.body;
  if(typeof username != "string" || typeof password != "string" || !username.trim() || !password ){
    return res.status(400).json({
      error:"Bad request",
      mensaje:"Usuario o contraseña invalidos"
    });
  }
  next();
}
export {
  validateUser,
  validateAuth
}
