import mongoose from "mongoose";
import ServiceItem from "../schema/ServiceItemSchema";

export function createServiceItem(data, callback) {
    const serviceItemModel = new ServiceItem(data);
    serviceItemModel.save(function (err, serviceItem) {
        callback(err, serviceItem);
    })
}

export function getServiceItemById(id, callback) {
    ServiceItem.findOne({ "id": parseInt(id) }, function (err, serviceItem) {
        callback(err, serviceItem)
    });
}

export function getServiceItems(callback) {
    ServiceItem.find({ "isRemoved": false }, function (err, serviceItems) {
        console.log(serviceItems)
        callback(err, serviceItems)
    });
}

export function getPendingServiceItems(callback) {
    ServiceItem.find({ "isRemoved": false, "status": "pending" }, function (err, serviceItems) {
        callback(err, serviceItems)
    });
}

export function updateServiceItemById(id, data, callback) {
    data.lastModifiedAt = new Date();
    ServiceItem.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, serviceItem) {
        callback(err, serviceItem);
    });
}