import axios from "axios";

export const ADD_BORROWTRANSACTION_STARTED = "ADD_BORROWTRANSACTION_STARTED";
export const ADD_BORROWTRANSACTION_FULFILLED = "ADD_BORROWTRANSACTION_FULFILLED";
export const ADD_BORROWTRANSACTION_REJECTED = "ADD_BORROWTRANSACTION_REJECTED";

export const GET_BORROWTRANSACTIONS_STARTED = "GET_BORROWTRANSACTIONS_STARTED";
export const GET_BORROWTRANSACTIONS_FULFILLED = "GET_BORROWTRANSACTIONS_FULFILLED";
export const GET_BORROWTRANSACTIONS_REJECTED = "GET_BORROWTRANSACTIONS_REJECTED";

export const DELETE_BORROWTRANSACTION_STARTED = "DELETE_BORROWTRANSACTION_STARTED";
export const DELETE_BORROWTRANSACTION_FULFILLED = "DELETE_BORROWTRANSACTION_FULFILLED";
export const DELETE_BORROWTRANSACTION_REJECTED = "DELETE_BORROWTRANSACTION_REJECTED";

export const GET_PENDING_BORROWTRANSACTIONS_STARTED = "GET_PENDING_BORROWTRANSACTIONS_STARTED";
export const GET_PENDING_BORROWTRANSACTIONS_FULFILLED = "GET_PENDING_BORROWTRANSACTIONS_FULFILLED";
export const GET_PENDING_BORROWTRANSACTIONS_REJECTED = "GET_PENDING_BORROWTRANSACTIONS_REJECTED";

export const APPROVE_BORROWTRANSACTION_STARTED = "APPROVE_BORROWTRANSACTION_STARTED";
export const APPROVE_BORROWTRANSACTION_FULFILLED = "APPROVE_BORROWTRANSACTION_FULFILLED";
export const APPROVE_BORROWTRANSACTION_REJECTED = "APPROVE_BORROWTRANSACTION_REJECTED";

export const UPDATE_BORROWTRANSACTION_STARTED = "UPDATE_BORROWTRANSACTION_STARTED";
export const UPDATE_BORROWTRANSACTION_FULFILLED = "UPDATE_BORROWTRANSACTION_FULFILLED";
export const UPDATE_BORROWTRANSACTION_REJECTED = "UPDATE_BORROWTRANSACTION_REJECTED";

export const RETURN_BORROWTRANSACTION_STARTED = "RETURN_BORROWTRANSACTION_STARTED";
export const RETURN_BORROWTRANSACTION_FULFILLED = "RETURN_BORROWTRANSACTION_FULFILLED";
export const RETURN_BORROWTRANSACTION_REJECTED = "RETURN_BORROWTRANSACTION_REJECTED";

export const SET_UPDATING_BORROWTRANSACTION_FULFILLED = "SET_UPDATING_BORROWTRANSACTION_FULFILLED";

const WS_URL = "http://localhost:3000/borrowTransaction/";

export function addBorrowTransaction(data) {
    return function (dispatch) {
        dispatch({ type: ADD_BORROWTRANSACTION_STARTED });
        return axios.post(WS_URL, data)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: ADD_BORROWTRANSACTION_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: ADD_BORROWTRANSACTION_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getBorrowTransactions(data) {

    return function (dispatch) {
        dispatch({ type: GET_BORROWTRANSACTIONS_STARTED });
        return axios.get(WS_URL, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_BORROWTRANSACTIONS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_BORROWTRANSACTIONS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getPendingBorrowTransactions(data) {
    return function (dispatch) {
        dispatch({ type: GET_PENDING_BORROWTRANSACTIONS_STARTED });
        return axios.get(WS_URL + "pending", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_PENDING_BORROWTRANSACTIONS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_PENDING_BORROWTRANSACTIONS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function approveBorrowTransaction(data) {
    const borrowTransaction = data.borrowTransaction;
    return function (dispatch) {
        dispatch({ type: APPROVE_BORROWTRANSACTION_STARTED });
        return axios.put(WS_URL + borrowTransaction.id + "/approve", null, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: APPROVE_BORROWTRANSACTION_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: APPROVE_BORROWTRANSACTION_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteBorrowTransaction(data) {
    const borrowTransaction = data.borrowTransaction;
    return function (dispatch) {
        dispatch({ type: DELETE_BORROWTRANSACTION_STARTED });
        return axios.delete(WS_URL + borrowTransaction.id, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_BORROWTRANSACTION_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_BORROWTRANSACTION_REJECTED, payload: response });
                throw response;
            })
    }
}

export function setUpdatingBorrowTransaction(id) {
    return function (dispatch) {
        dispatch({ type: SET_UPDATING_BORROWTRANSACTION_FULFILLED, payload: id });
    }
}

export function updateBorrowTransaction(borrowTransaction) {

    return function (dispatch) {
        dispatch({ type: UPDATE_BORROWTRANSACTION_STARTED });
        return axios.put(WS_URL + borrowTransaction.id, borrowTransaction)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: UPDATE_BORROWTRANSACTION_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: UPDATE_BORROWTRANSACTION_REJECTED, payload: response });
                throw response;
            })
    }
}

export function updateReturnTransaction(borrowTransaction) {
    console.log('ini update action')
    return function (dispatch) {
        dispatch({ type: RETURN_BORROWTRANSACTION_STARTED });
        return axios.put(WS_URL + borrowTransaction.id + "/return", borrowTransaction)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: RETURN_BORROWTRANSACTION_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: RETURN_BORROWTRANSACTION_REJECTED, payload: response });
                throw response;
            })
    }
}