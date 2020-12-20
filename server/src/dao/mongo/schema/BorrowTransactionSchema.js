import mongoose from "mongoose";
// import Item from './ItemSchema'
const ItemSchema = mongoose.model('Item').schema;
const Schema = mongoose.Schema;

const BorrowTransactionSchema = mongoose.Schema({
    id: { type: Number, required: true },
    borrow_code : {type: String, required: true},
    employee_nik: { type: String, required: true },
    employee_name: { type: String, required: true },
    borrow_date: { type: Date, required: true },
    item_name :{ type: String},
    item_id :{ type: Number},
    project_location : { type: String, required: true },
    item_status: { type: String, enum: ["Available", "Borrowed", "Repaired"] },
    return_status: { type: Boolean, default: false },
    return_date: { type: Date },
    isRemoved: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: new Date },
    lastModifiedAt: { type: Date, default: new Date },
});

export default mongoose.model("BorrowTransaction", BorrowTransactionSchema);