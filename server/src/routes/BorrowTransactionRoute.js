import { Router } from "express";
import { createBorrowTransaction, removeBorrowTransaction, getBorrowTransactions, updateBorrowTransaction } from "../services/BorrowTransactionService";
import { validateCreateBorrowTransaction } from "../validators/BorrowTransactionValidator"
import { verifyAuthMiddleware } from "../utils/AuthUtil";

const router = Router();

router.post('/', verifyAuthMiddleware, function (req, res, next) {
    validateCreateBorrowTransaction(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const userSession = req.session;
            const nik = userSession.employee_nik;
            const employee_name = userSession.employee_name;
            const { borrow_date, item_id, project_location} = req.body;
            const data = { borrow_date, item_id, project_location,employee_nik: nik,employee_name: employee_name,userSession };
            createBorrowTransaction(data, function (err, borrowTransaction) {
                
                if (err) {
                    if (err.message === "Not Enough Permission to Create Borrow Transaction") {
                        res.status(400).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    borrowTransaction.item_name = data.item_name;
                    res.status(201).send(borrowTransaction);
                }
            });
        }
    });
});

router.put('/:id', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        validateCreateBorrowTransaction(req.body, function (err) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                const userSession = req.session;
                const nik = userSession.employee_nik;
                const employee_name = userSession.employee_name;
                const { borrow_code, borrow_date, item_id, project_location, return_date } = req.body;
                const data = { id, borrow_code,borrow_date, item_id, project_location,employee_nik: nik,employee_name: employee_name, return_date,userSession };
                updateBorrowTransaction(data, function (err, borrowTransaction) {
                    if (err) {
                        if (err.message === "Not Enough Permission to Create Borrow Transaction") {
                            res.status(400).send(err.message);
                        }
                        else if (err.message === "Borrow Transaction Not Found") {
                            res.status(404).send(err.message);
                        }
                        else {
                            console.log(err);
                            res.status(500).send(err);
                        }
                    }
                    else {
                        res.status(201).send(borrowTransaction);
                    }
                });
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

router.put('/:id/return', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        validateCreateBorrowTransaction(req.body, function (err) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                const userSession = req.session;
                const nik = userSession.employee_nik;
                const employee_name = userSession.employee_name;
                const { borrow_code, borrow_date, item_id, project_location,return_date } = req.body;
                const data = { id, borrow_code,borrow_date, item_id, project_location,employee_nik: nik,employee_name: employee_name, return_date, userSession };
                updateBorrowTransaction(data, function (err, borrowTransaction) {
                    if (err) {
                        if (err.message === "Not Enough Permission to Create Borrow Transaction") {
                            res.status(400).send(err.message);
                        }
                        else if (err.message === "Borrow Transaction Not Found") {
                            res.status(404).send(err.message);
                        }
                        else {
                            console.log(err);
                            res.status(500).send(err);
                        }
                    }
                    else {
                        res.status(201).send(borrowTransaction);
                    }
                });
            }
        });
    }
    else {
        res.status(400).send("id param required");
    }
});

router.delete('/:id', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        const userSession = req.session;
        const data = { id, userSession };
        removeBorrowTransaction(data, function (err, borrowTransaction) {
            if (err) {
                if (err.message === "Not Enough Permission to Remove Borrow Transaction") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "An Operation is Pending on the Borrow Transaction") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "Borrow Transaction Not Found") {
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

router.get('/', verifyAuthMiddleware, function (req, res, next) {
    getBorrowTransactions(function (err, borrowTransactions) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(borrowTransactions);
        }
    });
});

export default router;