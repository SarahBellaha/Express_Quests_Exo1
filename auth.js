const argon2 = require("argon2");
const jwt = require('jsonwebtoken');
require("dotenv").config();

const secretKey = process.env.JWT_SECRET;

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

const hashPassword = (req, res, next) => {
  argon2
    .hash(req.body.password, hashingOptions)
    .then((hashedPassword) => {

      req.body.hashedPassword = hashedPassword;
      delete req.body.password;

      next();
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const verifyPassword = (req, res) => {
    const passwordToVerify = req.body.password;

    argon2.verify(req.user.hashedPassword, passwordToVerify)
    .then((isVerified) => {
        if(isVerified){
            const token = jwt.sign({sub: req.user.id, }, secretKey, { expiresIn: 60*60 })
            req.user.token = token;
            res.send(req.user);
        } else {
            res.status(401).send("Invalid credentials")
        }
    })
}

const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");

    if (authorizationHeader == null) {
      throw new Error("Authorization header is missing");
    }

    const [type, token] = authorizationHeader.split(" ");

    if (type !== "Bearer") {
      throw new Error("Authorization header has not the 'Bearer' type");
    }

    req.payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log(req.payload);

    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
};

const verifyId = (req, res, next) => {
  const targetId = parseInt(req.params.id);
  const tokenId = req.payload.sub;
  console.log(targetId, tokenId)

  if(targetId === tokenId) {
    next();
  } else {
    res.status(403).send("Forbidden")
  }
}

module.exports = {
  hashPassword,
  verifyPassword,
  verifyToken,
  verifyId
};