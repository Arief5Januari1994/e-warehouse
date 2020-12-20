import validator from "validator";

export function validateCreateVehicleTax(data, callback) {
    console.log(data)
    var errors = {};
    if (!data.vehicle_registration_number) {
        errors["vehicle_registration_number"] = "Vehicle Registration Number is Required";
    }
    if (!data.name_of_owner) {
        errors["name_of_owner"] = "Name of Owner is Required";
    }
    if (!data.address) {
        errors["address"] = "Address is Required";
    }
    if (!data.date_of_expire) {
        errors["date_of_expire"] = "Date of Expire is Required";
    }
    if (!data.estimated_tax) {
        errors["estimated_tax"] = "Estimated Tax ID is Required";
    }
    if (!data.file) {
        errors["file"] = "file is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}
