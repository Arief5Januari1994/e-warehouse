import axios from "axios";

export const ADD_VEHICLETAX_STARTED = "ADD_VEHICLETAX_STARTED";
export const ADD_VEHICLETAX_FULFILLED = "ADD_VEHICLETAX_FULFILLED";
export const ADD_VEHICLETAX_REJECTED = "ADD_VEHICLETAX_REJECTED";

export const GET_VEHICLETAXS_STARTED = "GET_VEHICLETAXS_STARTED";
export const GET_VEHICLETAXS_FULFILLED = "GET_VEHICLETAXS_FULFILLED";
export const GET_VEHICLETAXS_REJECTED = "GET_VEHICLETAXS_REJECTED";

export const DELETE_VEHICLETAX_STARTED = "DELETE_VEHICLETAX_STARTED";
export const DELETE_VEHICLETAX_FULFILLED = "DELETE_VEHICLETAX_FULFILLED";
export const DELETE_VEHICLETAX_REJECTED = "DELETE_VEHICLETAX_REJECTED";

export const GET_PENDING_VEHICLETAXS_STARTED = "GET_PENDING_VEHICLETAXS_STARTED";
export const GET_PENDING_VEHICLETAXS_FULFILLED = "GET_PENDING_VEHICLETAXS_FULFILLED";
export const GET_PENDING_VEHICLETAXS_REJECTED = "GET_PENDING_VEHICLETAXS_REJECTED";

export const APPROVE_VEHICLETAX_STARTED = "APPROVE_VEHICLETAX_STARTED";
export const APPROVE_VEHICLETAX_FULFILLED = "APPROVE_VEHICLETAX_FULFILLED";
export const APPROVE_VEHICLETAX_REJECTED = "APPROVE_VEHICLETAX_REJECTED";

export const UPDATE_VEHICLETAX_STARTED = "UPDATE_VEHICLETAX_STARTED";
export const UPDATE_VEHICLETAX_FULFILLED = "UPDATE_VEHICLETAX_FULFILLED";
export const UPDATE_VEHICLETAX_REJECTED = "UPDATE_VEHICLETAX_REJECTED";

export const SET_UPDATING_VEHICLETAX_FULFILLED = "SET_UPDATING_VEHICLETAX_FULFILLED";

const WS_URL = "http://localhost:3000/vehicleTax/";

export function addVehicleTax(data) {
    return function (dispatch) {
        dispatch({ type: ADD_VEHICLETAX_STARTED });
        return axios.post(WS_URL, data)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: ADD_VEHICLETAX_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: ADD_VEHICLETAX_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getVehicleTaxs(data) {
    return function (dispatch) {
        dispatch({ type: GET_VEHICLETAXS_STARTED });
        return axios.get(WS_URL, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_VEHICLETAXS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_VEHICLETAXS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getPendingVehicleTaxs(data) {
    return function (dispatch) {
        dispatch({ type: GET_PENDING_VEHICLETAXS_STARTED });
        return axios.get(WS_URL + "pending", { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_PENDING_VEHICLETAXS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_PENDING_VEHICLETAXS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function approveVehicleTax(data) {
    const vehicleTax = data.vehicleTax;
    return function (dispatch) {
        dispatch({ type: APPROVE_VEHICLETAX_STARTED });
        return axios.put(WS_URL + vehicleTax.id + "/approve", null, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: APPROVE_VEHICLETAX_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: APPROVE_VEHICLETAX_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteVehicleTax(data) {
    const vehicleTax = data.vehicleTax;
    return function (dispatch) {
        dispatch({ type: DELETE_VEHICLETAX_STARTED });
        return axios.delete(WS_URL + vehicleTax.id, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_VEHICLETAX_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_VEHICLETAX_REJECTED, payload: response });
                throw response;
            })
    }
}

export function setUpdatingVehicleTax(id) {
    return function (dispatch) {
        dispatch({ type: SET_UPDATING_VEHICLETAX_FULFILLED, payload: id });
    }
}

export function updateVehicleTax(vehicleTax) {
    return function (dispatch) {
        dispatch({ type: UPDATE_VEHICLETAX_STARTED });
        return axios.put(WS_URL + vehicleTax.id, vehicleTax)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: UPDATE_VEHICLETAX_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: UPDATE_VEHICLETAX_REJECTED, payload: response });
                throw response;
            })
    }
}