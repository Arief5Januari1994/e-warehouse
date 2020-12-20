import validator from "validator";

export function validateCreateBorrowTransaction(data, callback) {
    console.log(data)
    var errors = {};
    if (!data.borrow_date) {
        errors["borrow_date"] = "Borrow date is Required";
    }
    if (!data.item_id) {
        errors["item_id"] = "Item ID is Required";
    }
    if (!data.project_location) {
        errors["project_location"] = "Project Location is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}
