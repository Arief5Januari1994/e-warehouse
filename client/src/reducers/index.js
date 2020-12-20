import { combineReducers } from 'redux';

import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from "redux-form";

import authReducer from "./../reducers/AuthReducer";
import itemReducer from "./../reducers/ItemReducer";
import userReducer from "./../reducers/UserReducer";
import borrowTransactionReducer from "./../reducers/borrowTransactionReducer";
import serviceItemReducer from "./../reducers/ServiceItemReducer";
import vehicleTaxReducer from "./../reducers/VehicleTaxReducer";
import { useReducer } from 'react';

export default combineReducers({
    router: routerReducer,
    form: formReducer,
    auth: authReducer,
    item: itemReducer,
    user: userReducer,
    borrowTransaction: borrowTransactionReducer,
    serviceItem: serviceItemReducer,
    vehicleTax : vehicleTaxReducer
});