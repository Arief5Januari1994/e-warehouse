import axios from "axios";

export const ADD_USER_STARTED = "ADD_USER_STARTED";
export const ADD_USER_FULFILLED = "ADD_USER_FULFILLED";
export const ADD_USER_REJECTED = "ADD_USER_REJECTED";

export const GET_USERS_STARTED = "GET_USERS_STARTED";
export const GET_USERS_FULFILLED = "GET_USERS_FULFILLED";
export const GET_USERS_REJECTED = "GET_USERS_REJECTED";

export const DELETE_USER_STARTED = "DELETE_USER_STARTED";
export const DELETE_USER_FULFILLED = "DELETE_USER_FULFILLED";
export const DELETE_USER_REJECTED = "DELETE_USER_REJECTED";

export const UPDATE_USER_STARTED = "UPDATE_USER_STARTED";
export const UPDATE_USER_FULFILLED = "UPDATE_USER_FULFILLED";
export const UPDATE_USER_REJECTED = "UPDATE_USER_REJECTED";

export const SET_UPDATING_USER_FULFILLED = "SET_UPDATING_USER_FULFILLED";

const WS_URL = "http://localhost:3000/users/";

export function addUser(data) {
    return function (dispatch) {
        dispatch({ type: ADD_USER_STARTED });
        return axios.post(WS_URL, data)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: ADD_USER_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: ADD_USER_REJECTED, payload: response });
                throw response;
            })
    }
}

export function getUsers(data) {
    return function (dispatch) {
        dispatch({ type: GET_USERS_STARTED });
        return axios.get(WS_URL, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: GET_USERS_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: GET_USERS_REJECTED, payload: response });
                throw response;
            })
    }
}

export function deleteUser(data) {
    const user = data.user;
    return function (dispatch) {
        dispatch({ type: DELETE_USER_STARTED });
        return axios.delete(WS_URL + user.id, { headers: { Authorization: data.token } })
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: DELETE_USER_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: DELETE_USER_REJECTED, payload: response });
                throw response;
            })
    }
}

export function setUpdatingUser(id) {
    return function (dispatch) {
        dispatch({ type: SET_UPDATING_USER_FULFILLED, payload: id });
    }
}

export function updateUser(user) {
    return function (dispatch) {
        dispatch({ type: UPDATE_USER_STARTED });
        return axios.put(WS_URL + user.id, user)
            .then(function (response) {
                return response.data;
            })
            .then(function (data) {
                dispatch({ type: UPDATE_USER_FULFILLED, payload: data });
                return data;
            })
            .catch(function (error) {
                const response = error.response;
                dispatch({ type: UPDATE_USER_REJECTED, payload: response });
                throw response;
            })
    }
}