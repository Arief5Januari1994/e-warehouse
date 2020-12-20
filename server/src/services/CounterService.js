import { incrementCounter } from "./../dao/mongo/impl/CounterDAO";

export function getNextUserId(callback) {
    incrementCounter("user", callback);
}

export function getNextItemId(callback) {
    incrementCounter("item", callback);
}

export function getNextBorrowTransactionId(callback) {
    incrementCounter("borrowTransaction", callback);
}

export function getNextServiceItemId(callback) {
    incrementCounter("serviceItem", callback);
}

export function getNextVehicleTaxId(callback) {
    incrementCounter("vehicleTax", callback);
}
