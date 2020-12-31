import { Router } from "express";
import { createVehicleTax, approveVehicleTax, removeVehicleTax, getVehicleTaxs, updateVehicleTax, getPendingVehicleTax } from "./../services/VehicleTaxService";
import { validateCreateVehicleTax } from "../validators/VehicleTaxValidator"
import { verifyAuthMiddleware } from "../utils/AuthUtil";

const router = Router();
const cloudinary = require('cloudinary')
const fs = require('fs')
//Konfigurasi untuk menyimpan foto produk ke cloudinary
cloudinary.config({
    cloud_name : 'dsm3uouph',
    api_key: '316634259286793',
    api_secret: 'u1XYJvd9DbHdXgC2HiN6ZSZmAgQ'
})

const multer  = require('multer')
const storage = multer.diskStorage({
    destination: 'uploads/vehicle-tax',
    filename: function(req, file, cb) {
        const originalNameSplit = file.originalname.split('.');
        const fileExtension = originalNameSplit.pop();
        const fileName = originalNameSplit.join('');
        const date = new Date();
        cb(null, fileName + date.getTime().toString() + '.' + fileExtension)
    }
})
const upload = multer({ storage });

router.post('/uploads', upload.single('file'),(req, res) => {

    let urls = [];
    console.log('ini file',req.file)
    const uploader = function(path) {
        return cloudinary.v2.uploader.upload(path,{folder: 'items'}).then(result => {return result})
    };
    const pathFiles = [];
    pathFiles.push(req.file.path)
    for (const file of pathFiles ){
        const newPath = uploader(file);
        newPath.then(function(result) {
            urls.push(result.secure_url);
            res.status(200).send(result.secure_url);
        })
    }
   
})

// router.post('/uploads', upload.single('file'), (req, res) => {
//     console.log(req.file);
//     res.status(200).send(req.file);
// })

router.post('/', verifyAuthMiddleware, function (req, res, next) {
    validateCreateVehicleTax(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const userSession = req.session;
            const { vehicle_registration_number, name_of_owner, address, date_of_expire, estimated_tax, file } = req.body;
            const data = { vehicle_registration_number, name_of_owner, address, date_of_expire, estimated_tax, file, userSession };

            createVehicleTax(data, function (err, vehicleTax) {
                if (err) {
                    if (err.message === "Not Enough Permission to Create Vehicle Tax") {
                        res.status(400).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(201).send(vehicleTax);
                }
            });
        }
    });
});

router.put('/:id', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        validateCreateVehicleTax(req.body, function (err) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                const userSession = req.session;
                const { vehicle_code, vehicle_registration_number, name_of_owner, address, date_of_expire, estimated_tax, file } = req.body;
                const data = { id, vehicle_code, vehicle_registration_number, name_of_owner, address, date_of_expire, estimated_tax, file, userSession };
                updateVehicleTax(data, function (err, vehicleTax) {
                    if (err) {
                        if (err.message === "Not Enough Permission to Create Vehicle Tax") {
                            res.status(400).send(err.message);
                        }
                        else if (err.message === "Vehicle Tax Not Found") {
                            res.status(404).send(err.message);
                        }
                        else {
                            console.log(err);
                            res.status(500).send(err);
                        }
                    }
                    else {
                        res.status(201).send(vehicleTax);
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
        removeVehicleTax(data, function (err, vehicleTax) {
            if (err) {
                if (err.message === "Not Enough Permission to Remove Vehicle Tax") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "An Operation is Pending on the Vehicle Tax") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "Vehicle Tax Not Found") {
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

router.put('/:id/approve', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        const userSession = req.session;
        const data = { id, userSession };
        approveVehicleTax(data, function (err, vehicleTax) {
            if (err) {
                if (err.message === "Only Pending Vehicle Taxs can be Approved") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "Not Enough Permission to Approve Vehicle Tax") {
                    res.status(400).send(err.message);
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
 
    getVehicleTaxs(function (err, vehicleTaxs) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(vehicleTaxs);
        }
    });
});

router.get('/pending', verifyAuthMiddleware, function (req, res, next) {
    getPendingVehicleTax(function (err, vehicleTaxs) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(vehicleTaxs);
        }
    });
});

export default router;