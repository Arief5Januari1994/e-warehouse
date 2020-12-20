import { ADD_USER_STARTED, ADD_USER_FULFILLED, ADD_USER_REJECTED } from "./../actions/UserActions";
import { GET_USERS_STARTED, GET_USERS_FULFILLED, GET_USERS_REJECTED } from "./../actions/UserActions";
import { DELETE_USER_STARTED, DELETE_USER_FULFILLED, DELETE_USER_REJECTED } from "./../actions/UserActions";
import { UPDATE_USER_STARTED, UPDATE_USER_FULFILLED, UPDATE_USER_REJECTED } from "./../actions/UserActions";
import { SET_UPDATING_USER_FULFILLED } from "./../actions/UserActions";

const initialState = {
    users: [],
    isAddingUser: false,
    addingUserError: null,
    isFetchingUsers: false,
    fetchingUsersError: null,
    isDeletingUser: false,
    deletingsUsersError: null,
    user: null,
    isUpdatingUser: false,
    updatingUsersError: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_USER_STARTED: {
            return { ...state, isAddingUser: true };
        }
        case ADD_USER_FULFILLED: {
            const data = action.payload;
            const newUser = state.users.concat([data]);
            return { ...state, isAddingUser: false, users: newUser };
        }
        case ADD_USER_REJECTED: {
            const error = action.payload.data;
            return { ...state, isAddingUser: false, addingUserError: error };
        }
        case GET_USERS_STARTED: {
            return { ...state, isFetchingUsers: true };
        }
        case GET_USERS_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingUsers: false, users: data };
        }
        case GET_USERS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingUsers: false, fetchingUsersError: error };
        }
        case DELETE_USER_STARTED: {
            return { ...state, isDeletingUser: true };
        }
        case DELETE_USER_FULFILLED: {
            const data = action.payload;
            return { ...state, isDeletingUser: false };
        }
        case DELETE_USER_REJECTED: {
            const error = action.payload.data;
            return { ...state, isDeletingUser: false, deletingsUsersError: error };
        }
        case UPDATE_USER_STARTED: {
            return { ...state, isUpdatingUser: true };
        }
        case UPDATE_USER_FULFILLED: {
            const data = action.payload;
            return { ...state, isUpdatingUser: false, user: null };
        }
        case UPDATE_USER_REJECTED: {
            const error = action.payload.data;
            return { ...state, isUpdatingUser: false, updatingUsersError: error };
        }
        case SET_UPDATING_USER_FULFILLED: {
            const id = action.payload;
            const inv = state.users.filter(function (element) {
                return element.id == id;
            })[0];
            return Object.assign({}, state, { user: inv });
        }
        default: {
            return state;
        }
    }
}