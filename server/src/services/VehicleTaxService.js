import async from "async";

import {
    createVehicleTax as createVehicleTaxDAO,
    getVehicleTaxById as getVehicleTaxByIdDAO,
    updateVehicleTaxById as updateVehicleTaxByIdDAO,
    getVehicleTaxs as getVehicleTaxsDAO,
    getPendingVehicleTax as getPendingVehicleTaxDAO,
} from "../dao/mongo/impl/VehicleTaxDAO";
import { getNextVehicleTaxId } from "./CounterService";

export function createVehicleTax(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { division } = data.userSession;
            const { isManajemenDireksi, isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan } = getUserDivision(division);
            if ( isManajemenDireksi) {
                data.status = 'approved';
            }
            if(isHSE || isOperasidanPemeliharaan || isWarehouse || isKeuangan ){
                data.status = 'pending';
            }
            if (data.status) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to Create Vehicle Tax");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            getNextVehicleTaxId(function (err, counterDoc) {
                waterfallCallback(err, data, counterDoc);
            });
        },
        function (data, counterDoc, waterfallCallback) {
            const { division } = data.userSession;
            const { isManajemenDireksi, isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan } = getUserDivision(division);
            if ( isManajemenDireksi || isHSE || isOperasidanPemeliharaan || isWarehouse || isKeuangan ) {
                data.id = counterDoc.counter;
                const date = new Date()
                const day = date.getDate().toString();
                const month = date.getMonth() + 1;
                const year = date.getFullYear().toString();
                data.vehicle_code = 'VEHICLETAX-'+ day + month.toString() + year + '-' + counterDoc.counter;
                createVehicleTaxDAO(data, waterfallCallback);
            }
            else {
                const err = new Error("Not Enough Permission to Create Vehicle Tax");
                waterfallCallback(err);
            }
        }
    ], callback);
}

export function updateVehicleTax(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { division } = data.userSession;
            const { isManajemenDireksi, isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan } = getUserDivision(division);
            if ( isManajemenDireksi || isHSE || isOperasidanPemeliharaan || isWarehouse || isKeuangan ) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to Update Vehicle Tax");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            const id = data.id;
            getVehicleTaxByIdDAO(id, function (err, vehicleTax) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (vehicleTax) {
                    console.log('come from service',vehicleTax)
                    if (vehicleTax.status == "pending") {
                        waterfallCallback(null, vehicleTax);
                    }
                    else {
                        const err = new Error("An Operation is Approved on the Vehicle Tax");
                        waterfallCallback(err);
                    }
                }
                else {
                    const err = new Error("Vehicle Tax Not Found");
                    waterfallCallback(err);
                }
            });
        },
        function (vehicleTax, waterfallCallback) {
            const { division } = data.userSession;
            const { isManajemenDireksi, isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan } = getUserDivision(division);
            if ( isManajemenDireksi ) {
                const update = {
                    status: "approved",
                    vehicle_code: data.vehicle_code,
                    vehicle_registration_number: data.vehicle_registration_number,
                    name_of_owner: data.name_of_owner,
                    address: data.address,
                    date_of_expire: data.date_of_expire,
                    estimated_tax: data.estimated_tax,
                    file: data.file
                }
                const id = data.id;
                updateVehicleTaxByIdDAO(id, update, waterfallCallback);
            }
            else if (isHSE || isOperasidanPemeliharaan || isWarehouse || isKeuangan){
                console.log('update tax', data.vehicle_code)
                const update = {
                    status: "pending",
                    vehicle_code: data.vehicle_code,
                    vehicle_registration_number: data.vehicle_registration_number,
                    name_of_owner: data.name_of_owner,
                    address: data.address,
                    date_of_expire: data.date_of_expire,
                    estimated_tax: data.estimated_tax,
                    file: data.file
                }
                const id = data.id;
                updateVehicleTaxByIdDAO(id, update, waterfallCallback);
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

export function approveVehicleTax(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
        const { division } = data.userSession;
        const { isManajemenDireksi } = getUserDivision(division);
            if ( isManajemenDireksi ) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to Approve Vehicle Tax");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            const id = data.id;
            getVehicleTaxByIdDAO(id, function (err, vehicleTax) {
                if (err) {
                    waterfallCallback(err);
                }
                else {
                    if (vehicleTax.status == "pending") {
                        waterfallCallback(null, vehicleTax);
                    }
                    else {
                        const err = new Error("Only Pending Vehicle Taxs can be Approved");
                        waterfallCallback(err);
                    }
                }
            })
        },
        function (vehicleTax, waterfallCallback) {
            if(vehicleTax){
                const update = {
                    status: "approved",
                }
                const id = data.id;
                updateVehicleTaxByIdDAO(id, update, waterfallCallback);
            }
            else {
                const err = new Error("Weird Flow in Vehicle Tax Approval");
                waterfallCallback(err);
            }
        }
    ], callback);
}

export function removeVehicleTax(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const { division } = data.userSession;
            const { isManajemenDireksi, isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan } = getUserDivision(division);
            if ( isManajemenDireksi || isHSE || isOperasidanPemeliharaan || isWarehouse || isKeuangan ) {
                waterfallCallback();
            }
            else {
                const err = new Error("Not Enough Permission to Remove Vehicle Tax");
                waterfallCallback(err);
            }
        },
        function (waterfallCallback) {
            const id = data.id;
            getVehicleTaxByIdDAO(id, function (err, vehicleTax) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (vehicleTax) {
                    if (vehicleTax.status == "approved") {
                        waterfallCallback(null, vehicleTax);
                    }
                    else {
                        const err = new Error("An Operation is Pending on the Vehicle Tax");
                        waterfallCallback(err);
                    }
                }
                else {
                    const err = new Error("Vehicle Tax Not Found");
                    waterfallCallback(err);
                }
            });
        },
        function (vehicleTax, waterfallCallback) {
            const { division } = data.userSession;
            const { isManajemenDireksi, isHSE, isOperasidanPemeliharaan, isWarehouse, isKeuangan } = getUserDivision(division);
            if ( isManajemenDireksi ) {
                const update = {
                    status: "approved",
                    isRemoved: true,
                }
                const id = data.id;
                updateVehicleTaxByIdDAO(id, update, waterfallCallback);
            }
            else if ( isHSE || isOperasidanPemeliharaan || isWarehouse || isKeuangan){
                const update = {
                    status: "pending",
                    isRemoved: true,
                }
                const id = data.id;
                updateVehicleTaxByIdDAO(id, update, waterfallCallback);
            }
        }
    ], callback);
}

export function getVehicleTaxs(callback) {
    getVehicleTaxsDAO(callback);
}

export function getPendingVehicleTax(callback) {
    getPendingVehicleTaxDAO(callback);
}