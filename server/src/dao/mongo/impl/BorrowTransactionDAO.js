import mongoose from "mongoose";
import BorrowTransaction from "../schema/BorrowTransactionSchema";

export function createBorrowTransaction(data, callback) {
    const borrowTransactionModel = new BorrowTransaction(data);
    borrowTransactionModel.save(function (err, borrowTransaction) {
        callback(err, borrowTransaction);
    })
}

export function getBorrowTransactionById(id, callback) {
    BorrowTransaction.findOne({ "id": parseInt(id) }, function (err, borrowTransaction) {
        callback(err, borrowTransaction)
    });
}

export function getBorrowTransactions(callback) {
    BorrowTransaction.find({ "isRemoved": false }, function (err, borrowTransaction) {
        callback(err, borrowTransaction)
    });
}

export function updateBorrowTransactionById(id, data, callback) {
    data.lastModifiedAt = new Date();
    BorrowTransaction.findOneAndUpdate({ "id": parseInt(id) }, data, { "new": true }, function (err, borrowTransaction) {
        callback(err, borrowTransaction);
    });
}
