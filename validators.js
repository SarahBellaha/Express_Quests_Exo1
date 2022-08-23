// const validateMovie = (req, res, next) => {
//     const {title, director, year, color, duration} = req.body;
//     const errorsMovie = [];

//     if (title == null) {
//         errorsMovie.push({field: "title", message: "The field 'title' is required"})
//     } else if (title.length > 256) {
//         errorsMovie.push({field: "title", message: "The field 'title' is too long"})
//     }

//     if (director == null) {
//         errorsMovie.push({field: "director", message: "The field 'director' is required"})
//     }

//     if (year == null) {
//         errorsMovie.push({field: "year", message: "The field 'year' is required"})
//     }

//     if (color == null) {
//         errorsMovie.push({field: "color", message: "The field 'color' is required"})
//     }

//     if (duration == null) {
//         errorsMovie.push({field: "duration", message: "The field 'duration' is required"})
//     }

//     if (errorsMovie.length) {
//         res.status(422).json({validationErrors: errorsMovie})
//     } else {
//         next()
//     }
// };

// const validateUser = (req, res, next) => {
//     const {firstname, lastname, email, city, language} = req.body;
//     const errorsUser = [];

//     const emailRegex = /[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,3}/;

//     if (!emailRegex.test(email)) {
//         errorsUser.push({field: "email", message:"Invalid email"})
//     };

//     if (errorsUser.length) {
//         res.status(422).json({validationErrors: errorsUser})
//     } else {
//         next()
//     };

// }

const Joi = require("joi");

const movieSchema = Joi.object({
    title: Joi.string().max(255).required(),
    director: Joi.string().max(255).required(),
    year: Joi.string().max(255).required(),
    color: Joi.string().max(255).required(),
    duration: Joi.number().integer().required()
})

const userSchema = Joi.object({
    firstname: Joi.string().max(255).required(),
    lastname: Joi.string().max(255).required(),
    email: Joi.string().email().max(255).required(),
    city: Joi.string().max(255),
    language: Joi.string().max(255).required(),
});

const validateMovie = (req, res, next) => {
    const {title, director, year, color, duration} = req.body;

    const { error } = movieSchema.validate(
        {title, director, year, color, duration},
        {abortEarly: false} 
    );

    if(error) {
        res.status(422).json({ validationErrors: error.details });
    } else {
        next();
    }
}

const validateUser = (req, res, next) => {
    const {firstname, lastname, email, city, language} = req.body;

    const { error } = userSchema.validate(
        {firstname, lastname, email, city, language},
        {abortEarly: false} 
    );

    if(error) {
        res.status(422).json({ validationErrors: error.details });
    } else {
        next();
    }
}

module.exports = {
    validateMovie,
    validateUser
};