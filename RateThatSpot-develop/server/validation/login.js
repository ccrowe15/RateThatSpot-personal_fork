/* used to validate the data passed from user login */
const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLogin(data) {
    //assume logins are in the form username:password
    let errors = {};
    
    //convert any empty fields to empty strings to prevent error
    data.name = !isEmpty(data.username) ? data.username : "";
    data.password = !isEmpty(data.password) ? data.password: "";

    //check username
    if (Validator.isEmpty(data.username)) {
        errors.name = "Username field is required";
    }
    //check password
    if (Validator.isEmpty(data.password)) {
        errors.password = "password field required";
    }

    return {
        errors, 
        isValid: isEmpty(errors)
    }
}

