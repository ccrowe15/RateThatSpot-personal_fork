// Used to validate the data from signup
const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateSignupInput(data) {
    //assume logins are in the form username:password
    let errors = {};
    
    //convert any empty fields to empty strings to prevent error
    data.name = !isEmpty(data.name) ? data.name : "";
    data.password = !isEmpty(data.password) ? data.password: "";
    data.email = !isEmpty(data.email) ? data.email: "";

    // check username
    if (Validator.isEmpty(data.name)) {
        errors.name = "Username field is required";
    }
    // check password
    if (Validator.isEmpty(data.password)) {
        errors.password = "password field required";
    }
    // check email
    if (Validator.isEmpty(data.email)) {
        errors.email = "email field required";
    } else if (!Validator.isEmpty(data.email)) {
        if (!data.email.includes('@purdue.edu')) {
            errors.email = "email must be from a purdue.edu domain";
        }
    }

    return {
        errors, 
        isValid: isEmpty(errors)
    }
}