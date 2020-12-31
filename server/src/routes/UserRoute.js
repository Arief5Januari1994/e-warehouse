import { Router } from "express";
import { createUser, getUserById, loginUser, getUsers, updateUser, removeUser } from "./../services/UserService";
import { validateCreateMember, validateLoginMember } from "./../validators/UserValidator"

const router = Router();

router.post('/', function (req, res, next) {
    validateCreateMember(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const { name, email, password, employee_nik, position, division, gender, address } = req.body;

            const data = { name: { en: name }, email, password,employee_nik, position, division, gender, address };
            createUser(data, function (err, user) {
                if (err) {
                    if (err.message === "Email Already Exists") {
                        res.status(409).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(201).send(user);
                }
            });
        }
    });
});

router.post('/login', function (req, res, next) {
    validateLoginMember(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const { email, password } = req.body;
            const data = { email, password };
            loginUser(data, function (err, token, user) {
                if (err) {
                    if (err.message === "Invalid Email or Password") {
                        res.status(400).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(200).send({ token: token, user: user });
                }
            });
        }
    });
});

router.get('/:id', function (req, res, next) {
    const id = req.params.id;
    if (id) {
        getUserById(id, function (err, user) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else {
                res.status(200).send(user);
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

router.get('/', function (req, res, next) {
    getUsers(function (err, users) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(users);
        }
    });
});

router.put('/:id', function (req, res, next) {
    const id = req.params.id;
    if (id) {
        validateCreateMember(req.body, function (err) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                const { name, email, password, employee_nik, position, division, gender, address } = req.body;
                const data = {id, name: { en: name }, email, password, employee_nik, position, division, gender, address};
                updateUser(data, function (err, user) {
                    console.log(data);
                    if (err) {
                        if (err.message === "Not Enough Permission to create User") {
                            res.status(400).send(err.message);
                        }
                        else if (err.message === "User Not Found") {
                            res.status(404).send(err.message);
                        }
                        else {
                            console.log(err);
                            res.status(500).send(err);
                        }
                    }
                    else {
                        res.status(201).send(user);
                    }
                });
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

router.delete('/:id', function (req, res, next) {
    const id = req.params.id;
    if (id) {
        const data = { id };
        removeUser(data, function (err, user) {
            if (err) {
                if (err.message === "Not Enough Permission to remove User") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "User Not Found") {
                    res.status(404).send(err.message);
                }
                else {
                    console.log(err);
                    res.status(500).send(err);
                }
            }
            else {
                res.status(200).send();
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

export default router;