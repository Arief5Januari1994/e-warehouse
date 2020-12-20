import async from "async";

import {
    createItem as createItemDAO,
    getItemById as getItemByIdDAO,
    updateItemById as updateItemByIdDAO,
    getItems as getItemsDAO,
    getPendingItems as getPendingItemsDAO,
    getAvailableItems as getAvailableItemsDAO
} from "../dao/mongo/impl/ItemDAO";
import { getNextItemId } from "./CounterService";

export function createItem(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            getNextItemId(function (err, counterDoc) {
                waterfallCallback(err, data, counterDoc);
            });
        },
        function (data, counterDoc, waterfallCallback) {
            const { division } = data.userSession;
            const { isManajemenDireksi, isWarehouse  } = getUserDivision(division);
            if (isManajemenDireksi || isWarehouse  ) {
                data.id = counterDoc.counter;
                const date = new Date()
                const day = date.getDate().toString();
                const month = date.getMonth() + 1;
                const year = date.getFullYear().toString();
                data.item_code = 'ITEM-'+ day + month.toString() + year + '-' + counterDoc.counter;
                data.item_status = 'Available';
                createItemDAO(data, waterfallCallback);
            }
            else {
                const err = new Error("Not Enough Permission to create Item");
                waterfallCallback(err);
            }
        }
    ], callback);
}

export function updateItem(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { division } = data.userSession;
            const { isManajemenDireksi, isWarehouse  } = getUserDivision(division);
            if (isManajemenDireksi || isWarehouse  ) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to update Item");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            const id = data.id;
            getItemByIdDAO(id, function (err, item) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (item) {
                    waterfallCallback(null, item);
                }
                else {
                    const err = new Error("Item Not Found");
                    waterfallCallback(err);
                }
            });
        },
        function (item, waterfallCallback) {
            const { division } = data.userSession;
            const { isManajemenDireksi, isWarehouse  } = getUserDivision(division);
            if (isManajemenDireksi || isWarehouse) {
                const update = {
                    item_code: data.item_code,
                    item_name: data.item_name,
                    item_merk: data.item_merk,
                    category: data.category,
                    item_picture: data.item_picture,
                    purchase_date: data.purchase_date,
                    price : data.price, 
                    manual_book: data.manual_book
                }
                const id = data.id;
                updateItemByIdDAO(id, update, waterfallCallback);
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
    const isWarehouse = division.indexOf("Warehouse") >= 0;
    return { isManajemenDireksi , isWarehouse };
}

export function removeItem(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { division } = data.userSession;
            const { isManajemenDireksi, isWarehouse  } = getUserDivision(division);
            if (isManajemenDireksi || isWarehouse) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to remove Item");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            const id = data.id;
            getItemByIdDAO(id, function (err, item) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (item) {
                        waterfallCallback(null, item);
                }
                else {
                    const err = new Error("Item Not Found");
                    waterfallCallback(err);
                }
            });
        },
        function (item, waterfallCallback) {
            const { division } = data.userSession;
            const { isManajemenDireksi, isWarehouse  } = getUserDivision(division);
            if (isManajemenDireksi || isWarehouse) {
                const update = {
                    isRemoved: true,
                }
                const id = data.id;
                updateItemByIdDAO(id, update, waterfallCallback);
            }

        }
    ], callback);
}

export function getItems(callback) {
    getItemsDAO(callback);
}

export function getPendingItems(callback) {
    getPendingItemsDAO(callback);
}
export function getAvailableItems(callback) {
    getAvailableItemsDAO(callback);
}