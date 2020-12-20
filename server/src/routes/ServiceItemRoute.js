import { Router } from "express";
import { createServiceItem, removeServiceItem, getServiceItems, updateServiceItem } from "../services/ServiceItemService";
import { validateCreateServiceItem } from "../validators/ServiceItemValidator"
import { verifyAuthMiddleware } from "../utils/AuthUtil";

const router = Router();

const multer = require('multer')
const storage = multer.diskStorage({
    destination: 'uploads/service',
    filename: function(req, file, cb) {
        const originalNameSplit = file.originalname.split('.');
        const fileExtension = originalNameSplit.pop();
        const fileName = originalNameSplit.join('');
        const date = new Date();
        cb(null, 'serviceItem-' + fileName + date.getTime().toString() + '.' + fileExtension)
    }
})
const upload = multer({ storage });

router.post('/uploads', upload.single('file'), (req, res) => {
    console.log(req.file);
    res.status(200).send(req.file);
})

router.post('/', verifyAuthMiddleware, function (req, res, next) {
    validateCreateServiceItem(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            console.log(req.body)
            const userSession = req.session;
            const nik = userSession.employee_nik;
            const employee_name = userSession.employee_name;
            const { service_code,item_id,start_service_date } = req.body;
            const data = { service_code,item_id, employee_nik: nik, employee_name: employee_name, start_service_date, userSession };
            createServiceItem(data, function (err, serviceItem) {
                if (err) {
                    if (err.message === "Not Enough Permission to Create Service Item") {
                        res.status(400).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(201).send(serviceItem);
                }
            });
        }
    });
});

router.put('/:id', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        validateCreateServiceItem(req.body, function (err) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                const userSession = req.session;
                const nik = userSession.employee_nik;
                const employee_name = userSession.employee_name;
                const { service_code, item_id, start_service_date, end_service_date, detail_service, cost_service, picture, kwitansi } = req.body;
                const data = { id, service_code, item_id, employee_nik:nik, service_by:employee_name, start_service_date, end_service_date, detail_service, cost_service, picture, kwitansi, userSession };
                updateServiceItem(data, function (err, serviceItem) {
                    if (err) {
                        if (err.message === "Not Enough Permission to Create Service Item") {
                            res.status(400).send(err.message);
                        }
                        else if (err.message === "Service Item Not Found") {
                            res.status(404).send(err.message);
                        }
                        else {
                            console.log(err);
                            res.status(500).send(err);
                        }
                    }
                    else {
                        res.status(201).send(serviceItem);
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
        removeServiceItem(data, function (err, serviceItem) {
            if (err) {
                if (err.message === "Not Enough Permission to Remove Service Item") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "An Operation is Pending on the Service Item") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "Service Item Not Found") {
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
 
    getServiceItems(function (err, serviceItems) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(serviceItems);
        }
    });
});

export default router;