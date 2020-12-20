import React, { Component } from "react";
import { render } from "react-dom";
import { compose, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createHashHistory';
import { Route } from 'react-router';
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { persistStore, autoRehydrate } from 'redux-persist'

import { ConnectedRouter, routerMiddleware, push } from 'react-router-redux';

import reducers from './reducers';

import Login from "./containers/login";
import AddItem from "./containers/addItem";
import ViewItems from "./containers/viewItems";
import UpdateItem from "./containers/updateItem";

import AddUser from "./containers/addUser";
import ViewUsers from "./containers/viewUsers";
import UpdateUser from "./containers/updateUser";

import AddBorrowTransaction from "./containers/addBorrowTransaction";
import UpdateBorrowTransaction from "./containers/updateBorrowTransaction";
import ReturnTransaction from "./containers/returnTransaction";
import ViewBorrowTransactions from "./containers/viewBorrowTransactions";

import AddServiceItem from "./containers/addServiceItem";
import UpdateServiceItem from "./containers/updateServiceItem";
import ViewServiceItems from "./containers/viewServiceItems";
import EndServiceItems from "./containers/endServiceItem";

import ApproveVehicleTax from "./containers/approveVehicleTax";
import AddVehicleTax from "./containers/addVehicleTax";
import UpdateVehicleTax from "./containers/updateVehicleTax";
import ViewVehicleTax from "./containers/viewVehicleTaxs";

const history = createHistory();
const logger = createLogger();

const middleware = routerMiddleware(history)

const store = createStore(
    reducers,
    undefined,
    compose(
        applyMiddleware(middleware, logger, thunk),
        autoRehydrate()
    )
)



class App extends Component {
    state = {
        isLoading: true
    }
    componentWillMount() {
        persistStore(store, { whitelist: ['auth'] }, () => {
            this.setState({ isLoading: false });
            store.dispatch(push('/login'))
        })
    }
    render() {
        if (this.state.isLoading) {
            return (
                <div>Loading...</div>
            );
        }
        else {
            return (
                <Provider store={store}>
                    <ConnectedRouter history={history}>
                        <div>
                            {/* <Route exact path="/" component={}/> */}
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/item/add" component={AddItem} />
                            <Route exact path="/item/update/:id" component={UpdateItem} />
                            <Route exact path="/item" component={ViewItems} />
                            <Route exact path="/user/add" component={AddUser} />
                            <Route exact path="/user/update/:id" component={UpdateUser} />
                            <Route exact path="/user" component={ViewUsers} />
                            <Route exact path="/borrowTransaction/add" component={AddBorrowTransaction} />
                            <Route exact path="/borrowTransaction/update/:id" component={UpdateBorrowTransaction} />
                            <Route exact path="/returnTransaction/:id" component={ReturnTransaction} />
                            <Route exact path="/borrowTransaction" component={ViewBorrowTransactions} />
                            <Route exact path="/serviceItem/add" component={AddServiceItem} />
                            <Route exact path="/serviceItem/update/:id" component={UpdateServiceItem} />
                            <Route exact path="/endServiceItem/:id" component={EndServiceItems} />
                            <Route exact path="/serviceItem" component={ViewServiceItems} />
                            <Route exact path="/vehicleTax/add" component={AddVehicleTax} />
                            <Route exact path="/vehicleTax/approve" component={ApproveVehicleTax} />
                            <Route exact path="/vehicleTax" component={ViewVehicleTax} />
                            <Route exact path="/vehicleTax/update/:id" component={UpdateVehicleTax} />
                        </div>
                    </ConnectedRouter>
                </Provider>
            );
        }
    }
}

render(
    <App />
    , document.getElementById('app')
)
