const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const validate = require('../middleware/validate');
const productSchemas = require('../validation/productSchemas');

router.post('/', authMiddleware, role(['store_owner','admin']), validate(productSchemas.createProduct), productsController.createProduct);
router.get('/', productsController.listProducts);
router.get('/:id', productsController.getProduct);
router.put('/:id', authMiddleware, role(['store_owner','admin']), validate(productSchemas.updateProduct), productsController.updateProduct);
router.delete('/:id', authMiddleware, role(['store_owner','admin']), productsController.deleteProduct);
router.post('/:id/stock', authMiddleware, role(['store_owner','admin']), validate(productSchemas.updateStock), productsController.updateStock);
router.post('/:id/images', authMiddleware, role(['store_owner','admin']), upload.single('image'), productsController.uploadImage || productsController.addProductImage);

module.exports = router;
