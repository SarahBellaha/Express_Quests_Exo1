const database = require("./database");

const authenticate = (req, res) => {
    const { email, password } = req.body;

    if(email === "dwight@theoffice.com" && password === "123456") {
        res.status(200).send("Credentials are valid")
    } else {
        res.status(401).send("Credentials invalid")
    }
}

module.exports = {authenticate};