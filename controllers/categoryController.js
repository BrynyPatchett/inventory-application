const Category = require("../models/category")
const Item = require("../models/item")
const asyncHandler = require('express-async-handler');


exports.category_list = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({name:1}).exec()
    res.render("category_list",{title:"Categories", category_list:categories });
}
);

exports.detail_get = asyncHandler(async (req, res,next) => {
    const [category,itemsInCategory ] = await Promise.all([Category.findById(req.params.category_id).exec(),Item.find({category:req.params.category_id}, "name").exec()]);
    if(category == null){
        const err = new Error("Category Not Found");
        err.status = 404;
        return next(err)
    }
    res.render("category_detail",{title:"Category",category:category,itemsInCategory:itemsInCategory});
});

exports.create_get = asyncHandler(async (req, res) => {
    res.render("category_form",{title:"Create Category"})
});

exports.create_post = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Create Category Post Request Response`)
});

exports.update_get = asyncHandler(async (req, res,next) => {
    const category = await Category.findById(req.params.category_id).exec();
    if(category == null){
        const err = new Error("Category Not found")
        err.status = 404;
        return next(err)
    }
    res.render("category_form", {title:"Update Category",category:category})

});

exports.update_post = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Update Post Requst response for ${req.params.category_id}`)
});

exports.delete_get = asyncHandler(async (req, res) => {
    const [category,itemsInCategory ] = await Promise.all([Category.findById(req.params.category_id).exec(),Item.find({category:req.params.category_id}, "name").exec()]);
    if(category == null){
        res.redirect("/inventory/categories");
    }

    res.render("category_delete", {title:"Delete Category", category:category, itemsInCategory:itemsInCategory})

});

exports.delete_post = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Delete Post Requst response for ${req.params.category_id}`)
});