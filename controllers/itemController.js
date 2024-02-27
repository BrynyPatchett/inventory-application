const Category = require('../models/category');
const Item = require('../models/item')
const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res) => {
    const [numCategories,numItems] = await Promise.all([
        Category.countDocuments({}).exec(),
        Item.countDocuments({}).exec(),
    ])
    res.render("index",{title:"Inventory Application",category_count: numCategories,item_count:numItems})
}
);

exports.item_list = asyncHandler(async (req, res) => {
    const items = await Item.find().sort({name:1}).exec()
    res.render("item_list", {title:"Items", item_list:items});
}
);

exports.detail_get = asyncHandler(async (req, res,next) => {
    const item = await Item.findById(req.params.item_id).populate("category").exec();
    if(item == null){
        const err = new Error("Item Not Found");
        err.status = 404;
        return next(err)
    }
    res.render("item_detail",{title:"Item", item:item});
});

exports.create_get = asyncHandler(async (req, res) => {
    const allCategories = await Category.find({}).sort({name:1}).exec()
    res.render("item_form",{title:"Create Item",Categories:allCategories})
});

exports.create_post = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Create item Post Request Response`)
});

exports.update_get = asyncHandler(async (req, res,next) => {
    const [item,allCategories] = await Promise.all([
        Item.findById(req.params.item_id),
        Category.find({}).sort({name:1}).exec(),
    ])

    if(item == null){
        const err = new Error("Item to update Not Found")
        err.status = 404;
        return next(err)
    }

    allCategories.forEach(category => {
        if(item.category.includes(category._id)){
            category.checked = "true";
        }
    });

    res.render("item_form",{title:"Update Item",item:item, Categories:allCategories})
});

exports.update_post = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Update Post Requst response for ${req.params.item_id}`)
});

exports.delete_get = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.item_id);
    if (item == null){
        res.redirect("/inventory/items")
    }
    res.render("item_delete", {title:"Delete Item", item:item})
});

exports.delete_post = asyncHandler(async (req, res) => {
    await Item.findByIdAndDelete(req.params.item_id);
    res.redirect("/inventory/items");
});