const database = require("./database");

const getUsers = (req, res) => {
    let sql = "select * from users";
    const sqlValues = [];

    if(req.query.city != null) {
        sql += " where city=?";
        sqlValues.push(req.query.city);
    
        if(req.query.language != null) {
            sql += " and language=?";
            sqlValues.push(req.query.language);
        }
    } else if(req.query.language != null) {
        sql += " where language = ?";
        sqlValues.push(req.query.language);
    }

    database
        .query(sql, sqlValues)
        .then(([users]) => {
        res.status(200).sendFile(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
    });
};

const getUserById = (req, res) => {
    const id = parseInt(req.params.id);

    database
    .query("select * from users where id = ?", [id])
    .then(([users]) => {
        if (users[0] != null) {
        res.json(users[0]);
        } else {
        res.status(404).send("Not Found");
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
    });
};

const addUser = (req, res) => {
const {firstname, lastname, email, city, language, hashedPassword} = req.body;
console.log(req.body, "req.body")

database
    .query("INSERT INTO users (firstname, lastname, email, city, language, hashedPassword) VALUES (?,?,?,?,?,?)", 
        [firstname, lastname, email, city, language, hashedPassword])
    .then(([result]) => {
        console.log(result,"result")
        res.location(`/api/users/${result.insertId}`).status(201).send("Success!")
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving the user");
    });
};

const updateUser = (req, res) => {
    const {firstname, lastname, email, city, language} = req.body;
    const id = parseInt(req.params.id);

    database
        .query(`UPDATE users SET firstname = ?, lastname = ?, email = ?, city = ?, language = ? WHERE id= ?`, 
        [firstname, lastname, email, city, language, id])
            .then(([result]) => {
            if (result.affectedRows === 0) {
                res.status(404).send("Not Found");
            } else {
                res.sendStatus(204);
            }
            })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error saving the user");
        });
};

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id);

    database
        .query("DELETE from `users` WHERE id=?", [id])
        .then(([result]) => {
            if(result.affectedRows === 0 ) {
                res.status(404).send("Not Found");
            } else {
                res.status(200).send("Successfully deleted !");
            }
        })
        .catch((err) => {
        console.error(err);
        res.status(500).send("Error deleting the movie");
        })
}

module.exports = {
    getUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser
};