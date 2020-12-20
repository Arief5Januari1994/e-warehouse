import validator from "validator";

export function validateCreateItem(data, callback) {
    console.log(data)
    var errors = {};
    // if (!data.item_code) {
    //     errors["item_code"] = "item code is Required";
    // }
    if (!data.item_name) {
        errors["item_name"] = "item name is Required";
    }
    if (!data.item_merk) {
        errors["item_merk"] = "item merk is Required";
    }
    if (!data.category) {
        errors["category"] = "category is Required";
    }
    if (!data.item_picture) {
        errors["item_picture"] = "item picture is Required";
    }
    if (!data.purchase_date) {
        errors["purchase_date"] = "purchase date is Required";
    }
    if (!data.price) {
        errors["price"] = "price is Required";
    }
    if (!data.manual_book) {
        errors["manual_book"] = "manual book is Required";
    }
    if (Object.keys(errors).length === 0) {
        callback();
    }
    else {
        callback(errors);
    }
}
