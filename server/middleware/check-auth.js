const jwt = require('jsonwebtoken');
const Request = require("../models/request");
//poner el token en el header
exports.checkAuth = (req, res, next) => {
    try {
        //para quitar el bearer
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "secret_this_should_be_longer");
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Auth Failed"
        });
    }
};

exports.checkAdmin = (req, res, next) => {
    try {
        //para quitar el bearer
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "secret_this_should_be_longer");
        req.userData = decoded;

    } catch (error) {
        return res.status(401).json({
            message: "Auth Failed"
        });
    }
    if(req.userData.user_type === "Admin"){
            next();
        } else{
            return res.status(401).json({
                    message: "No eres Admin"
                });
        }
};

exports.checkDelete = (req, res, next) => {
    try {
        //para quitar el bearer
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, "secret_this_should_be_longer");
        req.userData = decoded;
    } catch (error) {
        return res.status(401).json({
            message: "hubo un grave error Failed"
        });
    }
    const requestId = req.params.id;
        if(req.userData.user_type === "Admin"){
            next();
        }
        Request.findById({_id: requestId})
            .exec()
            .then(foundRequest => {
                if(foundRequest.request_type === "pending" && foundRequest.owner.id.equals(req.userData.userId)){
                    next();
                } else{
                    return res.status(401).json({
                        message: "no eres el Failed"
                    });
                }
            } )
            .catch(err => res.status(500).json({error: err}))
}
