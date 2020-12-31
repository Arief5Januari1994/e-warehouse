import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    id: { type: Number, required: true },

    name: {
        en: { type: String, required: true },
    },
    employee_nik: { type: Number, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    position: {
        type: String,
        required: true,
        enum: ["Manajemen Direksi", "Koordinator Project", "HSE", "Project Manager", "Site Manager", "Supervisor", "Administrasi Keuangan"]
    },
    division: {
        type: String,
        required: true,
        enum: ["Manajemen Direksi", "HSE", "Operasi dan Pemeliharaan", "Keuangan", "Warehouse"]
    },
    gender: {
        type: String,
        required: true,
        enum: ["Pria", "Wanita"]
    },
    address: {
        type: String,
        required: true,
    },
    isRemoved: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: new Date },
    lastModifiedAt: { type: Date, default: new Date },
});

export default mongoose.model("User", UserSchema);