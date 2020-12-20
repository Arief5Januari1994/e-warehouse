import async from "async";
import config from "config";

import { getNextUserId } from "./CounterService";
import {
    createUser as createUserDAO,
    getUserById as getUserByIdDAO,
    getUserByEmail as getUserByEmailDAO,
    getUsers as getUsersDAO,
    updateUserById as updateUserByIdDAO,
} from "./../dao/mongo/impl/UserDAO";
import { generatePasswordHash, validatePasswordHash } from "./../utils/PasswordUtil";
import JWTUtil from "./../utils/JWTUtil";

const clientSessionConfig = config.get("authenticate.clientSession");

const jwtUtilClientSession = new JWTUtil(clientSessionConfig);

export function createUser(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            getUserByEmailDAO(data.email, waterfallCallback);
        },
        function (user, waterfallCallback) {
            if (user) {
                var err = new Error("Email Already Exists");
                waterfallCallback(err);
            }
            else {
                waterfallCallback();
            }
        },
        function (waterfallCallback) {
            generatePasswordHash(data.password, function (err, hash) {
                if (err) {
                    waterfallCallback(err);
                }
                else {
                    data.passwordHash = hash;
                    delete data.password;
                    waterfallCallback();
                }
            })
        },
        function (waterfallCallback) {
            getNextUserId(function (err, counterDoc) {
                waterfallCallback(err, data, counterDoc);
            });
        },
        function (data, counterDoc, waterfallCallback) {
            data.id = counterDoc.counter;
            createUserDAO(data, waterfallCallback);
        }
    ], callback);
}

export function loginUser(data, callback) {
    const email = data.email;
    const password = data.password;
    async.waterfall([
        function (waterfallCallback) {
            getUserByEmailDAO(email, waterfallCallback);
        },
        function (user, waterfallCallback) {
            if (user) {
                waterfallCallback(null, user);
            }
            else {
                const err = new Error("Invalid Email or Password");
                waterfallCallback(err);
            }
        },
        function (user, waterfallCallback) {
            validatePasswordHash(password, user.passwordHash, function (err, isSame) {
                waterfallCallback(err, user, isSame);
            });
        },
        function (user, isSame, waterfallCallback) {
            if (isSame === true) {
                waterfallCallback(null, user);
            }
            else {
                const err = new Error("Invalid Email or Password");
                waterfallCallback(err);
            }
        },
        function (user, waterfallCallback) {
            const payload = {
                userId: user.id,
                division: user.division,
                employee_nik: user.employee_nik,
                employee_name: user.name.en
            }
            const userPayload = {
                id: user.id,
                name: user.name,
                email: user.email,
                division: user.division,
                employee_nik: user.employee_nik,
                employee_name: user.name.en
            }
            jwtUtilClientSession.signPayload(payload, function (err, token) {
                waterfallCallback(err, token, userPayload);
            });
        }
    ], callback);
}

export function updateUser(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const id = data.id;
            getUserByIdDAO(id, function (err, user) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (user) {
                    waterfallCallback(null, user);
                }
                else {
                    const err = new Error("Employee Not Found");
                    waterfallCallback(err);
                }
            });
        },
        function (user, waterfallCallback) {
                const update = {
                    name: data.name,
                    employee_nik: data.employee_nik,
                    position: data.position,
                    division: data.division,
                    password: data.password,
                    email: data.email,
                    gender: data.gender,
                    address: data.address
                }
                
                const id = data.id;
                updateUserByIdDAO(id, update, waterfallCallback);
            }
    ], callback);
}

export function removeUser(data, callback) {
    async.waterfall([
        function (waterfallCallback) {
            const id = data.id;
            getUserByIdDAO(id, function (err, user) {
                if (err) {
                    waterfallCallback(err);
                }
                else if (user) {
                    waterfallCallback(null, user);
                }
                else {
                    const err = new Error("Item Not Found");
                    waterfallCallback(err);
                }
            });
        },
        function (user, waterfallCallback) {
                const update = {
                    isRemoved: true,
                }
                const id = data.id;
                updateUserByIdDAO(id, update, waterfallCallback);
        }
    ], callback);
}

export function getUserById(id, callback) {
    getUserByIdDAO(id, callback);
}

export function getUsers(callback) {
    getUsersDAO(callback);
}

export function validateUserToken(token, callback) {
    jwtUtilClientSession.verifyToken(token, callback);
}
