import mongoose from "mongoose";
import VehicleTax from "../schema/VehicleTaxSchema";

export function createVehicleTax(data, callback) {
    const vehicleTaxModel = new VehicleTax(data);
    vehicleTaxModel.save(function (err, vehicleTax) {
        callback(err, vehicleTax);
    })
}

export function getVehicleTaxById(id, callback) {
    VehicleTax.findOne({ "id": parseInt(id) }, function (err, vehicleTax) {
        callback(err, vehicleTax)
    });
}

export function getVehicleTaxs(callback) {
    VehicleTax.find({ "isRemoved": false }, function (err, vehicleTaxs) {
        callback(err, vehicleTaxs)
    });
}
export function getPendingVehicleTax(callback) {
    VehicleTax.find({ "isRemoved": false, "status": "pending" }, function (err, vehicleTaxs) {
        console.log(vehicleTaxs);
        callback(err, vehicleTaxs)
    });
}
export function updateVehicleTaxById(id, data, callback) {
    data.lastModifiedAt = new Date();
    VehicleTax.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, vehicleTax) {
        callback(err, vehicleTax);
    });
}