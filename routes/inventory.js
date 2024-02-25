const express = require('express')
const router = express.Router();

const item_controller = require('../controllers/itemController');
const category_controller = require('../controllers/categoryController');


//index route is contained in item controller
router.get('/',item_controller.index);

//Routes for item
router.get('/item/create',item_controller.create_get);

router.post('/item/create',item_controller.create_post);

router.get('/item/:item_id',item_controller.detail_get);

router.get('/item/:item_id/update',item_controller.update_get);

router.post('/item/:item_id/update',item_controller.update_post);

router.get('/item/:item_id/delete',item_controller.delete_get);

router.post('/item/:item_id/delete',item_controller.delete_post);

router.get('/items',item_controller.item_list)

//Routes for Category 
router.get('/category/create',category_controller.create_get);

router.post('/category/create',category_controller.create_post);

router.get('/category/:category_id',category_controller.detail_get);

router.get('/category/:category_id/update',category_controller.update_get);

router.post('/category/:category_id/update',category_controller.update_post);

router.get('/category/:category_id/delete',category_controller.delete_get);

router.post('/category/:category_id/delete',category_controller.delete_post);

router.get('/categories',category_controller.category_list)







module.exports = router