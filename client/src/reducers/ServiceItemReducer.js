import { ADD_SERVICEITEM_STARTED, ADD_SERVICEITEM_FULFILLED, ADD_SERVICEITEM_REJECTED } from "./../actions/ServiceItemActions";
import { GET_SERVICEITEMS_STARTED, GET_SERVICEITEMS_FULFILLED, GET_SERVICEITEMS_REJECTED } from "./../actions/ServiceItemActions";
import { DELETE_SERVICEITEM_STARTED, DELETE_SERVICEITEM_FULFILLED, DELETE_SERVICEITEM_REJECTED } from "./../actions/ServiceItemActions";
import { GET_PENDING_SERVICEITEMS_STARTED, GET_PENDING_SERVICEITEMS_FULFILLED, GET_PENDING_SERVICEITEMS_REJECTED } from "./../actions/ServiceItemActions";
import { UPDATE_SERVICEITEM_STARTED, UPDATE_SERVICEITEM_FULFILLED, UPDATE_SERVICEITEM_REJECTED } from "./../actions/ServiceItemActions";
import { SET_UPDATING_SERVICEITEM_FULFILLED } from "./../actions/ServiceItemActions";

const initialState = {
    serviceItems: [],
    isAddingServiceItem: false,
    addingServiceItemError: null,
    isFetchingServiceItems: false,
    fetchingServiceItemsError: null,
    isDeletingServiceItem: false,
    deletingsServiceItemsError: null,
    pendingServiceItems: [],
    isFetchingPendingServiceItems: false,
    fetchingPendingServiceItemsError: null,
    serviceItem: null,
    isUpdatingServiceItem: false,
    updatingServiceItemsError: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_SERVICEITEM_STARTED: {
            return { ...state, isAddingServiceItem: true };
        }
        case ADD_SERVICEITEM_FULFILLED: {
            const data = action.payload;
            console.log('ini reducer', action.payload)
            const newServiceItem = state.serviceItems.concat([data]);
            return { ...state, isAddingServiceItem: false, serviceItems: newServiceItem };
        }
        case ADD_SERVICEITEM_REJECTED: {
            const error = action.payload.data;
            return { ...state, isAddingServiceItem: false, addingServiceItemError: error };
        }
        case GET_SERVICEITEMS_STARTED: {
            return { ...state, isFetchingServiceItems: true };
        }
        case GET_SERVICEITEMS_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingServiceItems: false, serviceItems: data };
        }
        case GET_SERVICEITEMS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingServiceItems: false, fetchingServiceItemsError: error };
        }
        case DELETE_SERVICEITEM_STARTED: {
            return { ...state, isDeletingServiceItem: true };
        }
        case DELETE_SERVICEITEM_FULFILLED: {
            const data = action.payload;
            return { ...state, isDeletingServiceItem: false };
        }
        case DELETE_SERVICEITEM_REJECTED: {
            const error = action.payload.data;
            return { ...state, isDeletingServiceItem: false, deletingsServiceItemsError: error };
        }
        case UPDATE_SERVICEITEM_STARTED: {
            return { ...state, isUpdatingServiceItem: true };
        }
        case UPDATE_SERVICEITEM_FULFILLED: {
            const data = action.payload;
            return { ...state, isUpdatingServiceItem: false, serviceItem: null };
        }
        case UPDATE_SERVICEITEM_REJECTED: {
            const error = action.payload.data;
            return { ...state, isUpdatingServiceItem: false, updatingServiceItemsError: error };
        }
        case SET_UPDATING_SERVICEITEM_FULFILLED: {
            const id = action.payload;
            const inv = state.serviceItems.filter(function (element) {
                return element.id == id;
            })[0];
            return Object.assign({}, state, { serviceItem: inv });
        }
        default: {
            return state;
        }
    }
}