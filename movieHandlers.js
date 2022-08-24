const database = require("./database")

const getMovies = (req, res) => {
  let sql = "select * from movies";
  const sqlValues = [];

  if(req.query.color != null) {
    sql += " where color=?";
    sqlValues.push(req.query.color);

    if(req.query.max_duration != null) {
      sql += " and duration <= ?";
      sqlValues.push(req.query.max_duration);
    }
  } else if(req.query.max_duration != null) {
    sql += " where duration <= ?";
    sqlValues.push(req.query.max_duration);
  }

  database
    .query(sql, sqlValues)
    .then(([movies]) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from movies where id = ?", [id])
    .then(([movies]) => {
      if (movies[0] != null) {
        res.json(movies[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const addMovie = (req, res) => {
  const {title, director, year, color, duration} = req.body;

  database
    .query("INSERT INTO movies (title, director, year, color, duration) VALUES (?,?,?,?,?)", 
      [title, director, year, color, duration])
    .then(([result]) => {
      res.location(`/api/movies/${result.insertId}`).status(201).send("Success!")
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    });
};

const updateMovie = (req, res) => {
  const {title, director, year, color, duration} = req.body;
  const id = parseInt(req.params.id);

  database
    .query(`UPDATE movies SET title = ?, director = ?, year = ?, color = ?, duration = ? WHERE id= ?`, 
      [title, director, year, color, duration, id])
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.status(404).send("Not Found");
        } else {
          res.sendStatus(204);
        }
      })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    });
};

const deleteMovie = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("DELETE from `movies` WHERE id=?", [id])
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
  getMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie
};
