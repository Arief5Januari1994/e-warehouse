import mongoose from "mongoose";

const ItemSchema = mongoose.Schema({
    id: { type: Number, required: true },

    item_code: { type: String, required: true },
    item_name: {
        en: { type: String, required: true },
    },
    item_merk: { type: String, required: true },
    category: { 
        type: String, 
        required: true, 
        default: 'Alat Ringan',
        enum: ["Alat Ringan", "Alat Berat", "Kendaraan Operasional"]  
    },
    status: { type: String, enum: ["approved", "pending"] },
    item_picture: {
        type: String
    },
    item_status: { type: String, enum: ["Available", "Borrowed", "Repaired"], default: "Available" },
    purchase_date : { type : String, required: true},
    price : {type: Number, required: true},
    manual_book :  {type: String, required: true},
    isRemoved: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: new Date },
    lastModifiedAt: { type: Date, default: new Date },
});

export default mongoose.model("Item", ItemSchema);