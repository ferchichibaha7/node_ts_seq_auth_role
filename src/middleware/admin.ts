import HttpStatusCodes from "http-status-codes";

export default  function(req, res, next) {

    let isAdmin   = req.isAdmin
    if(isAdmin)
    next();
    else
    res.status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: "restricted for normal users" });
 
}
