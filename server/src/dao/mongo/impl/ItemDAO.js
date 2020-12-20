import mongoose from "mongoose";
import Item from "../schema/ItemSchema";

export function createItem(data, callback) {
    const itemModel = new Item(data);
    itemModel.save(function (err, item) {
        callback(err, item);
    })
}

export function getItemById(id, callback) {
    Item.findOne({ "id": parseInt(id) }, function (err, item) {
        callback(err, item)
    });
}

export function getItems(callback) {
    Item.find({ "isRemoved": false }, function (err, items) {
        callback(err, items)
    });
}

export function getPendingItems(callback) {
    Item.find({ "isRemoved": false, "status": "pending" }, function (err, items) {
        callback(err, items)
    });
}

export function getAvailableItems(callback) {
    Item.find({ "isRemoved": false, "item_status": "Available" }, function (err, items) {
        callback(err, items)
    });
}

export function updateItemById(id, data, callback) {
    data.lastModifiedAt = new Date();
    Item.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, item) {
        callback(err, item);
    });
}
