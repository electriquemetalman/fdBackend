import validator from "validator";

const validateUser = (req, res, next) => {
  const errors = [];
  const {name, password, email} = req.body;

  // validating name, email format & strong password
  if (!name || validator.isEmpty(name.trim())) {
    errors.push("the name is required.");
  } else if (!validator.isLength(name.trim(), { min: 2, max: 100 })) {
    errors.push("The name must be between 2 and 100 characters long.");
  }


  if (!email || !validator.isEmail(email)) {
    errors.push("Please enter a valid email");
  }


  if (!password || validator.isEmpty(password)) {
    errors.push("the password is required.");
  } else if (!validator.isLength(password, { min: 8 })) {
    errors.push("Please enter a strong passWord.");
  }

  // if error, we stop here
  if (errors.length > 0) {
    return res.status(400).send({
      status: 'error',
      message: 'Erreur de validation',
      errors,
    });
  }

  // if avery ting is correct, we continue
  next();
};

export default validateUser;