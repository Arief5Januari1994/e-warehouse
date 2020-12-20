import { ADD_ITEM_STARTED, ADD_ITEM_FULFILLED, ADD_ITEM_REJECTED } from "./../actions/ItemActions";
import { GET_ITEMS_STARTED, GET_ITEMS_FULFILLED, GET_ITEMS_REJECTED } from "./../actions/ItemActions";
import { DELETE_ITEM_STARTED, DELETE_ITEM_FULFILLED, DELETE_ITEM_REJECTED } from "./../actions/ItemActions";
import { GET_PENDING_ITEMS_STARTED, GET_PENDING_ITEMS_FULFILLED, GET_PENDING_ITEMS_REJECTED } from "./../actions/ItemActions";
import { UPDATE_ITEM_STARTED, UPDATE_ITEM_FULFILLED, UPDATE_ITEM_REJECTED } from "./../actions/ItemActions";
import { SET_UPDATING_ITEM_FULFILLED } from "./../actions/ItemActions";

const initialState = {
    items: [],
    isAddingItem: false,
    addingItemError: null,
    isFetchingItems: false,
    fetchingItemsError: null,
    isDeletingItem: false,
    deletingsItemsError: null,
    pendingItems: [],
    isFetchingPendingItems: false,
    fetchingPendingItemsError: null,
    item: null,
    isUpdatingItem: false,
    updatingItemsError: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_ITEM_STARTED: {
            return { ...state, isAddingItem: true };
        }
        case ADD_ITEM_FULFILLED: {
            const data = action.payload;
            const newItem = state.items.concat([data]);
            return { ...state, isAddingItem: false, items: newItem };
        }
        case ADD_ITEM_REJECTED: {
            const error = action.payload.data;
            return { ...state, isAddingItem: false, addingItemError: error };
        }
        case GET_ITEMS_STARTED: {
            return { ...state, isFetchingItems: true };
        }
        case GET_ITEMS_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingItems: false, items: data };
        }
        case GET_ITEMS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingItems: false, fetchingItemsError: error };
        }
        case DELETE_ITEM_STARTED: {
            return { ...state, isDeletingItem: true };
        }
        case DELETE_ITEM_FULFILLED: {
            const data = action.payload;
            return { ...state, isDeletingItem: false };
        }
        case DELETE_ITEM_REJECTED: {
            const error = action.payload.data;
            return { ...state, isDeletingItem: false, deletingsItemsError: error };
        }
        case GET_PENDING_ITEMS_STARTED: {
            return { ...state, isFetchingPendingItems: true };
        }
        case GET_PENDING_ITEMS_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingPendingItems: false, pendingItems: data };
        }
        case GET_PENDING_ITEMS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingPendingItems: false, fetchingPendingItemsError: error };
        }
        case UPDATE_ITEM_STARTED: {
            return { ...state, isUpdatingItem: true };
        }
        case UPDATE_ITEM_FULFILLED: {
            const data = action.payload;
            return { ...state, isUpdatingItem: false, item: null };
        }
        case UPDATE_ITEM_REJECTED: {
            const error = action.payload.data;
            return { ...state, isUpdatingItem: false, updatingItemsError: error };
        }
        case SET_UPDATING_ITEM_FULFILLED: {
            const id = action.payload;
            const inv = state.items.filter(function (element) {
                return element.id == id;
            })[0];
            return Object.assign({}, state, { item: inv });
        }
        default: {
            return state;
        }
    }
}