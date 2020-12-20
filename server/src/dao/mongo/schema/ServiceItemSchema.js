import mongoose from "mongoose";

const ServiceItemSchema = mongoose.Schema({
    id: { type: Number, required: true },

    service_code: { type: String },
    item_id: {type: Number},
    item_name: { type: String},
    employee_nik: { type: String, required: true},
    employee_name: { type: String, required: true},
    start_service_date: { type: Date, required: true },
    item_status: { type: String },
    service_status: { type: Boolean, required: true, default: false },
    end_service_date: { type: Date },
    detail_service: { type: String },
    cost_service: { type: Number },
    kwitansi: {type: String},
    picture: {
        type: String
    },
    isRemoved: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: new Date },
    lastModifiedAt: { type: Date, default: new Date },
});

export default mongoose.model("ServiceItem", ServiceItemSchema);