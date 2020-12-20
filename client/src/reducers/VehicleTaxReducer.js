import { ADD_VEHICLETAX_STARTED, ADD_VEHICLETAX_FULFILLED, ADD_VEHICLETAX_REJECTED } from "../actions/VehicleTaxActions";
import { GET_VEHICLETAXS_STARTED, GET_VEHICLETAXS_FULFILLED, GET_VEHICLETAXS_REJECTED } from "../actions/VehicleTaxActions";
import { DELETE_VEHICLETAX_STARTED, DELETE_VEHICLETAX_FULFILLED, DELETE_VEHICLETAX_REJECTED } from "../actions/VehicleTaxActions";
import { GET_PENDING_VEHICLETAXS_STARTED, GET_PENDING_VEHICLETAXS_FULFILLED, GET_PENDING_VEHICLETAXS_REJECTED } from "../actions/VehicleTaxActions";
import { UPDATE_VEHICLETAX_STARTED, UPDATE_VEHICLETAX_FULFILLED, UPDATE_VEHICLETAX_REJECTED } from "../actions/VehicleTaxActions";
import { SET_UPDATING_VEHICLETAX_FULFILLED } from "../actions/VehicleTaxActions";

const initialState = {
    vehicleTaxs: [],
    isAddingVehicleTax: false,
    addingVehicleTaxError: null,
    isFetchingVehicleTaxs: false,
    fetchingVehicleTaxsError: null,
    isDeletingVehicleTax: false,
    deletingsVehicleTaxsError: null,
    pendingVehicleTaxs: [],
    isFetchingPendingVehicleTaxs: false,
    fetchingPendingVehicleTaxsError: null,
    vehicleTax: null,
    isUpdatingVehicleTax: false,
    updatingVehicleTaxsError: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_VEHICLETAX_STARTED: {
            return { ...state, isAddingVehicleTax: true };
        }
        case ADD_VEHICLETAX_FULFILLED: {
            const data = action.payload;
            const newVehicleTax = state.vehicleTaxs.concat([data]);
            return { ...state, isAddingVehicleTax: false, vehicleTaxs: newVehicleTax };
        }
        case ADD_VEHICLETAX_REJECTED: {
            const error = action.payload.data;
            return { ...state, isAddingVehicleTax: false, addingVehicleTaxError: error };
        }
        case GET_VEHICLETAXS_STARTED: {
            return { ...state, isFetchingVehicleTaxs: true };
        }
        case GET_VEHICLETAXS_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingVehicleTaxs: false, vehicleTaxs: data };
        }
        case GET_VEHICLETAXS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingVehicleTaxs: false, fetchingVehicleTaxsError: error };
        }
        case DELETE_VEHICLETAX_STARTED: {
            return { ...state, isDeletingVehicleTax: true };
        }
        case DELETE_VEHICLETAX_FULFILLED: {
            const data = action.payload;
            return { ...state, isDeletingVehicleTax: false };
        }
        case DELETE_VEHICLETAX_REJECTED: {
            const error = action.payload.data;
            return { ...state, isDeletingVehicleTax: false, deletingsVehicleTaxsError: error };
        }
        case GET_PENDING_VEHICLETAXS_STARTED: {
            return { ...state, isFetchingPendingVehicleTaxs: true };
        }
        case GET_PENDING_VEHICLETAXS_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingPendingVehicleTaxs: false, pendingVehicleTaxs: data };
        }
        case GET_PENDING_VEHICLETAXS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingPendingVehicleTaxs: false, fetchingPendingVehicleTaxsError: error };
        }
        case UPDATE_VEHICLETAX_STARTED: {
            return { ...state, isUpdatingVehicleTax: true };
        }
        case UPDATE_VEHICLETAX_FULFILLED: {
            const data = action.payload;
            return { ...state, isUpdatingVehicleTax: false, vehicleTax: null };
        }
        case UPDATE_VEHICLETAX_REJECTED: {
            const error = action.payload.data;
            return { ...state, isUpdatingVehicleTax: false, updatingVehicleTaxsError: error };
        }
        case SET_UPDATING_VEHICLETAX_FULFILLED: {
            const id = action.payload;
            const inv = state.vehicleTaxs.filter(function (element) {
                return element.id == id;
            })[0];
            return Object.assign({}, state, { vehicleTax: inv });
        }
        default: {
            return state;
        }
    }
}