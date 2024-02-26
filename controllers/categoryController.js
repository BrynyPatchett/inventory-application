const Category = require("../models/category")
const asyncHandler = require('express-async-handler');


exports.category_list = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({name:1}).exec()
    res.render("category_list",{title:"Categories", category_list:categories });
}
);

exports.detail_get = asyncHandler(async (req, res,next) => {
    const category = await Category.findById(req.params.category_id);
    if(category == null){
        const err = new Error("Category Not Found");
        err.status = 404;
        return next(err)
    }
    res.send(category);
});

exports.create_get = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Create Category page`)
});

exports.create_post = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Create Category Post Request Response`)
});

exports.update_get = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Update page for ${req.params.category_id}`)
});

exports.update_post = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Update Post Requst response for ${req.params.category_id}`)
});

exports.delete_get = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Delete Page for  ${req.params.category_id}`)
});

exports.delete_post = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Delete Post Requst response for ${req.params.item_id}`)
});