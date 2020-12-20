import async from "async";

import {
    createBorrowTransaction as createBorrowTransactionDAO,
    getBorrowTransactionById as getBorrowTransactionByIdDAO,
    updateBorrowTransactionById as updateBorrowTransactionByIdDAO,
    getBorrowTransactions as getBorrowTransactionsDAO,
} from "../dao/mongo/impl/BorrowTransactionDAO";
import {
    getAvailableItems as getAvailableItemsDAO,
    updateItemById as updateItemByIdDAO,
    getItemById  as getItemsByIdDAO
} from "../dao/mongo/impl/ItemDAO";

import { getNextBorrowTransactionId } from "./CounterService";

export function createBorrowTransaction(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            getNextBorrowTransactionId(function (err, counterDoc) {
                waterfallCallback(err, data, counterDoc);
            });
        },
        function (data, counterDoc, waterfallCallback) {
            const { division } = data.userSession;
            const { isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan } = getUserDivision(division);
            if ( isHSE || isOperasidanPemeliharaan || isKeuangan || isWarehouse ) {
                data.id = counterDoc.counter;
             
                const date = new Date()
                const day = date.getDate().toString();
                const month = date.getMonth() + 1;
                const year = date.getFullYear().toString();
                data.borrow_code = 'BORROW-'+ day + month.toString() + year + '-' + counterDoc.counter;

                data.employee_nik= data.userSession.employee_nik;
                data.employee_name=data.userSession.employee_name;
                let item_name;
                let update;
                getItemsByIdDAO(data.item_id, function (err, item) {
                    if(item){
                        item_name = item.item_name.en;
                        update = {
                            item_status : 'Borrowed'
                        }
                        updateItemByIdDAO(data.item_id, update, function(err,item){
                            if(err){
                                waterfallCallback(err);
                            }
                        });
                    }
                    data.item_name= item_name;
                    data.item_status=update.item_status;
                    createBorrowTransactionDAO(data, waterfallCallback);
                });
            }
            else {
                const err = new Error("Not Enough Permission to Create Borrow Transaction");
                waterfallCallback(err);
            }
           
        }
    ], callback);
}


export function updateBorrowTransaction(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { division } = data.userSession;
            const { isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan } = getUserDivision(division);
            if (isHSE || isOperasidanPemeliharaan || isWarehouse || isKeuangan) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to Update Borrow Transaction");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            const id = data.id;
            getBorrowTransactionByIdDAO(id, function (err, borrowTransaction) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (borrowTransaction) {
                        waterfallCallback(null, borrowTransaction);
                }
                else {
                    const err = new Error("Borrow Transaction Not Found");
                    waterfallCallback(err);
                }
            });
        },
        function (borrowTransaction, waterfallCallback) {
            const { division } = data.userSession;
            const { isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan } = getUserDivision(division);
            if (isHSE || isOperasidanPemeliharaan || isKeuangan || isWarehouse ) {
                let update = {
                    borrow_date: data.borrow_date,
                    project_location: data.project_location,
                    item_id : data.item_id,
                }
                
                if(data.return_date){
                    let item_name;
                    getItemsByIdDAO(update.item_id, function (err, item) {
                        if(item){
                            item_name = item.item_name.en;
                            update = {
                                item_status : 'Available'
                            }
                            updateItemByIdDAO(data.item_id, update, function(err,item){
                                if(err){
                                    waterfallCallback(err);
                                }
                            });
                        }
                        data.item_name= item_name;
                        data.item_status=update.item_status;
                    });
                    
                    update.return_date = data.return_date;
                    update.return_status= true
                    const id = data.id;
                    updateBorrowTransactionByIdDAO(id, update, waterfallCallback);
                }
                else {
                    let update = {
                        borrow_date: data.borrow_date,
                        project_location: data.project_location,
                        item_id : data.item_id,
                    }
                    const id = data.id;
                    updateBorrowTransactionByIdDAO(id, update, waterfallCallback);
                }
                
            }
        }
    ], callback);
}


function getUserDivision(division) {
    const isHSE = division.indexOf("HSE") >= 0;
    const isOperasidanPemeliharaan = division.indexOf("Operasi dan Pemeliharaan") >= 0;
    const isWarehouse = division.indexOf("Warehouse") >= 0;
    const isKeuangan = division.indexOf("Keuangan") >= 0;
    return { isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan };
}

export function removeBorrowTransaction(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { division } = data.userSession;
            const { isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan } = getUserDivision(division);
            if (isHSE || isOperasidanPemeliharaan || isWarehouse || isKeuangan) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to Remove Borrow Transaction");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            const id = data.id;
            getBorrowTransactionByIdDAO(id, function (err, borrowTransaction) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (borrowTransaction) {
                        waterfallCallback(null, borrowTransaction);
                }
                else {
                    const err = new Error("Borrow Transaction Not Found");
                    waterfallCallback(err);
                }
            });
        },
        function (borrowTransaction, waterfallCallback) {
            const { division } = data.userSession;
            const { isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan } = getUserDivision(division);
            if (isHSE || isOperasidanPemeliharaan || isKeuangan || isWarehouse) {
                let update = {
                    isRemoved: true,
                }
                getItemsByIdDAO(borrowTransaction.item_id, function (err, item) {
                    if(item){
                        update = {
                            item_status : 'Available'
                        }
                        updateItemByIdDAO(borrowTransaction.item_id, update, function(err,item){
                            if(err){
                                waterfallCallback(err);
                            }
                        });
                    }
                });
                const id = data.id;
                updateBorrowTransactionByIdDAO(id, update, waterfallCallback);
            }
        }
    ], callback);
}

export function getBorrowTransactions(callback) {
    getBorrowTransactionsDAO(callback);
}