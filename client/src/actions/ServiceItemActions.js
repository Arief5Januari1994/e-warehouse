import axios from "axios";

export const ADD_SERVICEITEM_STARTED = "ADD_SERVICEITEM_STARTED";
export const ADD_SERVICEITEM_FULFILLED = "ADD_SERVICEITEM_FULFILLED";
export const ADD_SERVICEITEM_REJECTED = "ADD_SERVICEITEM_REJECTED";

export const GET_SERVICEITEMS_STARTED = "GET_SERVICEITEMS_STARTED";
export const GET_SERVICEITEMS_FULFILLED = "GET_SERVICEITEMS_FULFILLED";
export const GET_SERVICEITEMS_REJECTED = "GET_SERVICEITEMS_REJECTED";

export const DELETE_SERVICEITEM_STARTED = "DELETE_SERVICEITEM_STARTED";
export const DELETE_SERVICEITEM_FULFILLED = "DELETE_SERVICEITEM_FULFILLED";
export const DELETE_SERVICEITEM_REJECTED = "DELETE_SERVICEITEM_REJECTED";

export const UPDATE_SERVICEITEM_STARTED = "UPDATE_SERVICEITEM_STARTED";
export const UPDATE_SERVICEITEM_FULFILLED = "UPDATE_SERVICEITEM_FULFILLED";
export const UPDATE_SERVICEITEM_REJECTED = "UPDATE_SERVICEITEM_REJECTED";

export const END_SERVICEITEM_STARTED = "UPDATE_SERVICEITEM_STARTED";
export const END_SERVICEITEM_FULFILLED = "UPDATE_SERVICEITEM_FULFILLED";
export const END_SERVICEITEM_REJECTED = "UPDATE_SERVICEITEM_REJECTED";

export const SET_UPDATING_SERVICEITEM_FULFILLED = "SET_UPDATING_SERVICEITEM_FULFILLED";

const WS_URL = "http://localhost:3000/serviceItem/";

export function addServiceItem(data) {
    return function (dispatch) {
        dispatch({ type: ADD_SERVICEITEM_STARTED });
        return axios.post(WS_URL, data)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: ADD_SERVICEITEM_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: ADD_SERVICEITEM_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getServiceItems(data) {
    return function (dispatch) {
        dispatch({ type: GET_SERVICEITEMS_STARTED });
        return axios.get(WS_URL, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_SERVICEITEMS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_SERVICEITEMS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteServiceItem(data) {
    const serviceItem = data.serviceItem;
    console.log('ini data view', serviceItem);

    return function (dispatch) {
        dispatch({ type: DELETE_SERVICEITEM_STARTED });
        return axios.delete(WS_URL + serviceItem.id, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_SERVICEITEM_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_SERVICEITEM_REJECTED, payload: response });
                throw response;
            })
    }
}

export function setUpdatingServiceItem(id) {
    return function (dispatch) {
        dispatch({ type: SET_UPDATING_SERVICEITEM_FULFILLED, payload: id });
    }
}

export function updateServiceItem(serviceItem) {
    return function (dispatch) {
        dispatch({ type: UPDATE_SERVICEITEM_STARTED });
        return axios.put(WS_URL + serviceItem.id, serviceItem)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: UPDATE_SERVICEITEM_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: UPDATE_SERVICEITEM_REJECTED, payload: response });
                throw response;
            })
    }
}

export function updateEndServiceItem(serviceItem) {
    return function (dispatch) {
        dispatch({ type: END_SERVICEITEM_STARTED });
        return axios.put(WS_URL + serviceItem.id + "/end", serviceItem)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: END_SERVICEITEM_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: END_SERVICEITEM_REJECTED, payload: response });
                throw response;
            })
    }
}