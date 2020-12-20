import async from "async";

import {
    createServiceItem as createServiceItemDAO,
    getServiceItemById as getServiceItemByIdDAO,
    updateServiceItemById as updateServiceItemByIdDAO,
    getServiceItems as getServiceItemsDAO,
} from "../dao/mongo/impl/ServiceItemDAO";
import { getNextServiceItemId } from "./CounterService";

import {
    getAvailableItems as getAvailableItemsDAO,
    updateItemById as updateItemByIdDAO,
    getItemById  as getItemsByIdDAO
} from "../dao/mongo/impl/ItemDAO";

export function createServiceItem(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            getNextServiceItemId(function (err, counterDoc) {
                waterfallCallback(err, data, counterDoc);
            });
        },
        function (data, counterDoc, waterfallCallback) {
            const { division } = data.userSession;
            const { isManajemenDireksi, isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan } = getUserDivision(division);
            if (isManajemenDireksi || isHSE || isOperasidanPemeliharaan || isWarehouse || isKeuangan ) {
                data.id = counterDoc.counter;

                const date = new Date()
                const day = date.getDate().toString();
                const month = date.getMonth() + 1;
                const year = date.getFullYear().toString();
                data.service_code = 'SERVICE-'+ day + month.toString() + year + '-' + counterDoc.counter;

                data.employee_nik= data.userSession.employee_nik;
                data.employee_name=data.userSession.employee_name;
                let item_name;
                let update;
                getItemsByIdDAO(data.item_id, function (err, item) {
                    if(item){
                        item_name = item.item_name.en;
                        update = {
                            item_status : 'Repaired'
                        }
                        updateItemByIdDAO(data.item_id, update, function(err,item){
                            if(err){
                                waterfallCallback(err);
                            }
                        });
                    }
                    data.item_name= item_name;
                    data.item_status=update.item_status;
                    createServiceItemDAO(data, waterfallCallback);
                });
                
            }
            else {
                const err = new Error("Not Enough Permission to Create Service Item");
                waterfallCallback(err);
            }
        }
    ], callback);
}

export function updateServiceItem(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { division } = data.userSession;
            const { isManajemenDireksi, isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan } = getUserDivision(division);
            if (isManajemenDireksi || isHSE || isOperasidanPemeliharaan || isWarehouse || isKeuangan ) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to Update Service Item");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            const id = data.id;
            getServiceItemByIdDAO(id, function (err, serviceItem) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (serviceItem) {
                    waterfallCallback(null, serviceItem);
                }
                else {
                    const err = new Error("Service Item Not Found");
                    waterfallCallback(err);
                }
            });
        },
        function (serviceItem, waterfallCallback) {
            const { division } = data.userSession;
            const { isManajemenDireksi, isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan } = getUserDivision(division);
            if (isManajemenDireksi || isHSE || isOperasidanPemeliharaan || isWarehouse || isKeuangan) {
                let update = {
                    item_id: data.item_id,
                    start_service_date: data.start_service_date,
                }

                if(data.end_service_date){
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
                    
                    update.end_service_date= data.end_service_date;
                    update.service_status= true
                    update.detail_service = data.detail_service;
                    update.cost_service = data.cost_service;
                    update.picture = data.picture;
                    update.kwitansi = data.kwitansi;
                    const id = data.id;
                    updateServiceItemByIdDAO(id, update, waterfallCallback);
                } 
                else {
                    const update = {
                        item_name: data.item_name,
                        start_service_date: data.start_service_date,
                    }
                    const id = data.id;
                    updateServiceItemByIdDAO(id, update, waterfallCallback);

                }
                
            }
        }
    ], callback);
}

function getUserRoles(roles) {
    const isStoreManager = roles.indexOf("storeManager") >= 0;
    const isDepartmentManager = roles.indexOf("deliveryManager") >= 0;
    return { isStoreManager, isDepartmentManager };
}

function getUserDivision(division) {
    const isManajemenDireksi = division.indexOf("Manajemen Direksi") >= 0;
    const isHSE = division.indexOf("HSE") >= 0;
    const isOperasidanPemeliharaan = division.indexOf("Operasi dan Pemeliharaan") >= 0;
    const isWarehouse = division.indexOf("Warehouse") >= 0;
    const isKeuangan = division.indexOf("Keuangan") >= 0;
    return { isManajemenDireksi, isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan };
}

export function approveServiceItem(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
        const { division } = data.userSession;
        const { isManajemenDireksi, isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan } = getUserDivision(division);
            if (isManajemenDireksi || isHSE || isOperasidanPemeliharaan || isWarehouse || isKeuangan) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to Approve Service Item");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            const id = data.id;
            getServiceItemByIdDAO(id, function (err, serviceItem) {
                if (err) {
                    waterfallCallback(err);
                }
                else {
                    if (serviceItem.status == "pending") {
                        waterfallCallback(null, serviceItem);
                    }
                    else {
                        const err = new Error("Only Pending Service Items can be Approved");
                        waterfallCallback(err);
                    }
                }
            })
        },
        function (serviceItem, waterfallCallback) {
            const latestHistory = getLatestHistory(serviceItem);
            if (latestHistory.action === "created") {
                const update = {
                    status: "approved",
                }
                const id = data.id;
                updateServiceItemByIdDAO(id, update, waterfallCallback);
            }
            else if (latestHistory.action === "removed") {
                const update = {
                    status: "approved",
                    isRemoved: true,
                    $push: {
                        history: {
                            action: "approved",
                            userId: data.userSession.userId,
                            timestamp: new Date()
                        }
                    }
                }
                const id = data.id;
                updateServiceItemByIdDAO(id, update, waterfallCallback);
            }
            else if (latestHistory.action === "updated") {
                const payload = latestHistory.payload;
                const update = {
                    status: "approved",
                    service_code: payload.service_code,
                    item_name: payload.item_name,
                    employee_nik: payload.employee_nik,
                    service_by: payload.service_by,
                    start_service_date: payload.start_service_date,
                    estimated_cost_service: payload.estimated_cost_service,
                    item_status: payload.item_status,
                    service_status: payload.service_status,
                    end_service_date: payload.end_service_date,
                    detail_service: payload.detail_service,
                    cost_service: payload.cost_service,
                    picture: payload.picture,
                    kwitansi: payload.kwitansi,
                    $push: {
                        history: {
                            action: "approved",
                            userId: data.userSession.userId,
                            timestamp: new Date()
                        }
                    }
                }
                const id = data.id;
                updateServiceItemByIdDAO(id, update, waterfallCallback);
            }
            else {
                const err = new Error("Weird Flow in Service Item Approval");
                waterfallCallback(err);
            }
        }
    ], callback);
}

function getLatestHistory(serviceItem) {
    let latestHistory = null
    serviceItem.history.every(function (history) {
        if (latestHistory) {
            if ((new Date(history.timestamp)).getTime() > (new Date(latestHistory.timestamp)).getTime()) {
                latestHistory = history;
            }
        }
        else {
            latestHistory = history;
        }
        return true;
    });
    return latestHistory;
}

export function removeServiceItem(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { division } = data.userSession;
            const { isManajemenDireksi, isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan } = getUserDivision(division);
            if (isManajemenDireksi || isHSE || isOperasidanPemeliharaan || isWarehouse || isKeuangan) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to Remove Service Item");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            const id = data.id;
            getServiceItemByIdDAO(id, function (err, borrowTransaction) {
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
        function (serviceItem, waterfallCallback) {
            const { division } = data.userSession;
            const { isManajemenDireksi, isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan } = getUserDivision(division);
            if (isManajemenDireksi || isHSE || isOperasidanPemeliharaan || isWarehouse || isKeuangan) {
                let update = {
                    isRemoved: true,
                }
                getItemsByIdDAO(serviceItem.item_id, function (err, item) {
                    if(item){
                        update = {
                            item_status : 'Available'
                        }
                        updateItemByIdDAO(serviceItem.item_id, update, function(err,item){
                            if(err){
                                waterfallCallback(err);
                            }
                        });
                    }
                });
                const id = data.id;
                updateServiceItemByIdDAO(id, update, waterfallCallback);
            }
        }
    ], callback);
}

export function getServiceItems(callback) {
    getServiceItemsDAO(callback);
}