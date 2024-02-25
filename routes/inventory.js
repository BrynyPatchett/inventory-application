const express = ('express')
const router = ('express-router');

const item_controller = require('../controllers/itemController');


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

router.get('/category/:item_id',category_controller.detail_get);

router.get('/category/:item_id/update',category_controller.update_get);

router.post('/category/:item_id/update',category_controller.update_post);

router.get('/category/:item_id/delete',category_controller.delete_get);

router.post('/category/:item_id/delete',category_controller.delete_post);

router.get('/categories',item_controller.category_controller.category_list)







module.exports = router