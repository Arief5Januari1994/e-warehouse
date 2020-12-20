import validator from "validator";

export function validateCreateMember(data, callback) {
    var errors = {};
    if (!data.email) {
        errors.email = "Email is Required";
    }
    else {
        if (!validator.isEmail(data.email)) {
            errors.email = "Email Not Valid";
        }
    }
    if (!data.employee_nik) {
        errors.employee_nik = "Employee NIK is Required";
    }
    if (!data.password) {
        errors.password = "Password is Required";
    }
    if (!data.position) {
        errors.position = "Position is Required";
    }
    if (!data.division) {
        errors.division = "Division is Required";
    }
    if (!data.gender) {
        errors.gender= "Gender is Required";
    }
    if (!data.address) {
        errors.address= "Address is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}

export function validateLoginMember(data, callback) {
    var errors = {};
    if (!data.email) {
        errors.email = "Email Number Required";
    }
    if (!data.password) {
        errors.password = "Password is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}
