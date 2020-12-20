import mongoose from "mongoose";

const VehicleTaxSchema = mongoose.Schema({
    id: { type: Number, required: true },

    vehicle_code: { type: String, required: true },
    vehicle_registration_number: { type: String, required: true },
    name_of_owner: { type: String, required: true },
    address: { type: String, required: true },
    date_of_expire: { type: Date, required: true },
    estimated_tax: { type: Number, required: true },
    status: { type: String, enum: ["approved", "pending"] },
    file: {
        type: String
    },
    isRemoved: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: new Date },
    lastModifiedAt: { type: Date, default: new Date },
});

export default mongoose.model("VehicleTax", VehicleTaxSchema);