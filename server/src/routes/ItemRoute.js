import { Router } from "express";
import { createItem, approveItem, removeItem, getItems, getPendingItems, updateItem, getAvailableItems } from "./../services/ItemService";
import { validateCreateItem } from "../validators/ItemValidator"
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
    destination: 'uploads/items',
    filename: function(req, file, cb) {
        const originalNameSplit = file.originalname.split('.');
        const fileExtension = originalNameSplit.pop();
        const fileName = originalNameSplit.join('');
        const date = new Date();
        cb(null, fileName + date.getTime().toString() + '.' + fileExtension)
    }
})
const upload = multer({ storage });

// //Upload foto produk ke cloudinary
// router
// .post("/uploads", (request, response) => {
//     // collected image from a user
//     const data = {
//       image: request.body.image,
//     }

//     // upload image here
//     cloudinary.uploader.upload(data.image);

// });
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
    validateCreateItem(req.body, function (err) {
        if (err) {
            res.status(400).send(err);
        }
        else {
            const userSession = req.session;
            const { item_name, item_merk, category,item_picture, purchase_date, price, manual_book} = req.body;
            const data = { item_name: { en: item_name }, item_merk, category, item_picture, purchase_date, price, manual_book, userSession };

            createItem(data, function (err, item) {
                if (err) {
                    if (err.message === "Not Enough Permission to create Item") {
                        res.status(400).send(err.message);
                    }
                    else {
                        console.log(err);
                        res.status(500).send(err);
                    }
                }
                else {
                    res.status(201).send(item);
                }
            });
        }
    });
});

router.put('/:id', verifyAuthMiddleware, function (req, res, next) {
    const id = req.params.id;
    if (id) {
        validateCreateItem(req.body, function (err) {
            if (err) {
                res.status(400).send(err);
            }
            else {
                const userSession = req.session;
                const { item_code, item_name, item_merk, category,item_picture,  purchase_date, price, manual_book } = req.body;
                const data = { id, item_code, item_name: { en: item_name }, item_merk, category, item_picture,  purchase_date, price, manual_book, userSession };
                updateItem(data, function (err, item) {
                    if (err) {
                        if (err.message === "Not Enough Permission to create Item") {
                            res.status(400).send(err.message);
                        }
                        else if (err.message === "Item Not Found") {
                            res.status(404).send(err.message);
                        }
                        else {
                            console.log(err);
                            res.status(500).send(err);
                        }
                    }
                    else {
                        res.status(201).send(item);
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
        removeItem(data, function (err, item) {
            if (err) {
                if (err.message === "Not Enough Permission to remove Item") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "An Operation is Pending on the Item") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "Item Not Found") {
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
        approveItem(data, function (err, item) {
            if (err) {
                if (err.message === "Only Pending Items can be approved") {
                    res.status(400).send(err.message);
                }
                else if (err.message === "Not Enough Permission to approve Item") {
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

router.get('/', [], function (req, res, next) {
 
    getItems(function (err, items) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(items);
        }
    });
});

router.get('/pending', verifyAuthMiddleware, function (req, res, next) {
    getPendingItems(function (err, items) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(items);
        }
    });
});

router.get('/available', verifyAuthMiddleware, function (req, res, next) {
    getAvailableItems(function (err, items) {
        if (err) {
            console.log(err);
            res.status(500).send(err);

        }
        else {
            res.status(200).send(items);
        }
    });
});

export default router;