import axios from "axios";

export const ADD_ITEM_STARTED = "ADD_ITEM_STARTED";
export const ADD_ITEM_FULFILLED = "ADD_ITEM_FULFILLED";
export const ADD_ITEM_REJECTED = "ADD_ITEM_REJECTED";

export const GET_ITEMS_STARTED = "GET_ITEMS_STARTED";
export const GET_ITEMS_FULFILLED = "GET_ITEMS_FULFILLED";
export const GET_ITEMS_REJECTED = "GET_ITEMS_REJECTED";

export const DELETE_ITEM_STARTED = "DELETE_ITEM_STARTED";
export const DELETE_ITEM_FULFILLED = "DELETE_ITEM_FULFILLED";
export const DELETE_ITEM_REJECTED = "DELETE_ITEM_REJECTED";

export const GET_PENDING_ITEMS_STARTED = "GET_PENDING_ITEMS_STARTED";
export const GET_PENDING_ITEMS_FULFILLED = "GET_PENDING_ITEMS_FULFILLED";
export const GET_PENDING_ITEMS_REJECTED = "GET_PENDING_ITEMS_REJECTED";

export const GET_AVAILABLE_ITEMS_STARTED = "GET_AVAILABLE_ITEMS_STARTED";
export const GET_AVAILABLE_ITEMS_FULFILLED = "GET_AVAILABLE_ITEMS_FULFILLED";
export const GET_AVAILABLE_ITEMS_REJECTED = "GET_AVAILABLE_ITEMS_REJECTED";

export const APPROVE_ITEM_STARTED = "APPROVE_ITEM_STARTED";
export const APPROVE_ITEM_FULFILLED = "APPROVE_ITEM_FULFILLED";
export const APPROVE_ITEM_REJECTED = "APPROVE_ITEM_REJECTED";

export const UPDATE_ITEM_STARTED = "UPDATE_ITEM_STARTED";
export const UPDATE_ITEM_FULFILLED = "UPDATE_ITEM_FULFILLED";
export const UPDATE_ITEM_REJECTED = "UPDATE_ITEM_REJECTED";

export const SET_UPDATING_ITEM_FULFILLED = "SET_UPDATING_ITEM_FULFILLED";

const WS_URL = "http://localhost:3000/items/";

export function addItem(data) {
    return function (dispatch) {
        dispatch({ type: ADD_ITEM_STARTED });
        return axios.post(WS_URL, data)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: ADD_ITEM_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: ADD_ITEM_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getItems(data) {
    return function (dispatch) {
        dispatch({ type: GET_ITEMS_STARTED });
        return axios.get(WS_URL, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_ITEMS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_ITEMS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getPendingItems(data) {
    return function (dispatch) {
        dispatch({ type: GET_PENDING_ITEMS_STARTED });
        return axios.get(WS_URL + "pending", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_PENDING_ITEMS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_PENDING_ITEMS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getAvailableItems(data) {
    return function (dispatch) {
        dispatch({ type: GET_AVAILABLE_ITEMS_STARTED });
        return axios.get(WS_URL + "available", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_AVAILABLE_ITEMS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_AVAILABLE_ITEMS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function approveItem(data) {
    const item = data.item;
    return function (dispatch) {
        dispatch({ type: APPROVE_ITEM_STARTED });
        return axios.put(WS_URL + item.id + "/approve", null, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: APPROVE_ITEM_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: APPROVE_ITEM_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteItem(data) {
    const item = data.item;
    console.log('ini action delete',item)
    return function (dispatch) {
        dispatch({ type: DELETE_ITEM_STARTED });
        return axios.delete(WS_URL + item.id, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_ITEM_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_ITEM_REJECTED, payload: response });
                throw response;
            })
    }
}

export function setUpdatingItem(id) {
    return function (dispatch) {
        dispatch({ type: SET_UPDATING_ITEM_FULFILLED, payload: id });
    }
}

export function updateItem(item) {
    return function (dispatch) {
        dispatch({ type: UPDATE_ITEM_STARTED });
        return axios.put(WS_URL + item.id, item)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: UPDATE_ITEM_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: UPDATE_ITEM_REJECTED, payload: response });
                throw response;
            })
    }
}