import validator from "validator";

export function validateCreateServiceItem(data, callback) {
    console.log(data)
    var errors = {};
    if (!data.item_id) {
        errors["item_name"] = "Item Name is Required";
    }
    if (!data.start_service_date) {
        errors["start_service_date"] = "Start Service Date is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}