import { MysqlClient } from "../db/connect.js";



const validateLogin = async(req, res, next) => {

    /** @type {{user_name:string,pwd:string}} */
    const { user_name, pwd } = req.body;

    const user = 
        await MysqlClient.from("user").where({ user_name: user_name, pwd: pwd }).first();
    

    if (user) {
        next();
    }

    return res.status(401).json({ message: "Unauthorized" });
    // return res.status(200).json({ verified: true });


};

export { validateLogin };