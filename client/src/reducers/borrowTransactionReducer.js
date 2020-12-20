import { ADD_BORROWTRANSACTION_STARTED, ADD_BORROWTRANSACTION_FULFILLED, ADD_BORROWTRANSACTION_REJECTED } from "./../actions/BorrowTransactionActions";
import { GET_BORROWTRANSACTIONS_STARTED, GET_BORROWTRANSACTIONS_FULFILLED, GET_BORROWTRANSACTIONS_REJECTED } from "./../actions/BorrowTransactionActions";
import { DELETE_BORROWTRANSACTION_STARTED, DELETE_BORROWTRANSACTION_FULFILLED, DELETE_BORROWTRANSACTION_REJECTED } from "./../actions/BorrowTransactionActions";
import { GET_PENDING_BORROWTRANSACTIONS_STARTED, GET_PENDING_BORROWTRANSACTIONS_FULFILLED, GET_PENDING_BORROWTRANSACTIONS_REJECTED } from "./../actions/BorrowTransactionActions";
import { UPDATE_BORROWTRANSACTION_STARTED, UPDATE_BORROWTRANSACTION_FULFILLED, UPDATE_BORROWTRANSACTION_REJECTED } from "./../actions/BorrowTransactionActions";
import { SET_UPDATING_BORROWTRANSACTION_FULFILLED } from "./../actions/BorrowTransactionActions";

const initialState = {
    borrowTransactions: [],
    isAddingBorrowTransaction: false,
    addingBorrowTransactionError: null,
    isFetchingBorrowTransactions: false,
    fetchingBorrowTransactionsError: null,
    isDeletingBorrowTransaction: false,
    deletingsBorrowTransactionsError: null,
    pendingBorrowTransactions: [],
    isFetchingPendingBorrowTransactions: false,
    fetchingPendingBorrowTransactionsError: null,
    borrowTransaction: null,
    isUpdatingBorrowTransaction: false,
    updatingBorrowTransactionsError: null,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_BORROWTRANSACTION_STARTED: {
            return { ...state, isAddingBorrowTransaction: true };
        }
        case ADD_BORROWTRANSACTION_FULFILLED: {
            const data = action.payload;
            const newBorrowTransaction = state.borrowTransactions.concat([data]);
            return { ...state, isAddingBorrowTransaction: false, borrowTransactions: newBorrowTransaction };
        }
        case ADD_BORROWTRANSACTION_REJECTED: {
            const error = action.payload.data;
            return { ...state, isAddingBorrowTransaction: false, addingBorrowTransactionError: error };
        }
        case GET_BORROWTRANSACTIONS_STARTED: {
            return { ...state, isFetchingBorrowTransactions: true };
        }
        case GET_BORROWTRANSACTIONS_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingBorrowTransactions: false, borrowTransactions: data };
        }
        case GET_BORROWTRANSACTIONS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingBorrowTransactions: false, fetchingBorrowTransactionsError: error };
        }
        case DELETE_BORROWTRANSACTION_STARTED: {
            return { ...state, isDeletingBorrowTransaction: true };
        }
        case DELETE_BORROWTRANSACTION_FULFILLED: {
            const data = action.payload;
            return { ...state, isDeletingBorrowTransaction: false };
        }
        case DELETE_BORROWTRANSACTION_REJECTED: {
            const error = action.payload.data;
            return { ...state, isDeletingBorrowTransaction: false, deletingsBorrowTransactionsError: error };
        }
        case GET_PENDING_BORROWTRANSACTIONS_STARTED: {
            return { ...state, isFetchingPendingBorrowTransactions: true };
        }
        case GET_PENDING_BORROWTRANSACTIONS_FULFILLED: {
            const data = action.payload;
            return { ...state, isFetchingPendingBorrowTransactions: false, pendingBorrowTransactions: data };
        }
        case GET_PENDING_BORROWTRANSACTIONS_REJECTED: {
            const error = action.payload.data;
            return { ...state, isFetchingPendingBorrowTransactions: false, fetchingPendingBorrowTransactionsError: error };
        }
        case UPDATE_BORROWTRANSACTION_STARTED: {
            return { ...state, isUpdatingBorrowTransaction: true };
        }
        case UPDATE_BORROWTRANSACTION_FULFILLED: {
            const data = action.payload;
            return { ...state, isUpdatingBorrowTransaction: false, borrowTransaction: null };
        }
        case UPDATE_BORROWTRANSACTION_REJECTED: {
            const error = action.payload.data;
            return { ...state, isUpdatingBorrowTransaction: false, updatingBorrowTransactionsError: error };
        }
        case SET_UPDATING_BORROWTRANSACTION_FULFILLED: {
            const id = action.payload;
            const inv = state.borrowTransactions.filter(function (element) {
                return element.id == id;
            })[0];
            return Object.assign({}, state, { borrowTransaction: inv });
        }
        default: {
            return state;
        }
    }
}