const Category = require("../models/category")
const Item = require("../models/item")
const asyncHandler = require('express-async-handler');
const {body, validationResult} = require("express-validator")
require("dotenv").config();

const ADMIN_PASS = process.env.ADMIN_PASS

exports.category_list = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({name:1}).exec()
    res.render("category_list",{title:"Categories", category_list:categories });
}
);

exports.detail_get = asyncHandler(async (req, res,next) => {
    const [category,itemsInCategory ] = await Promise.all([Category.findById(req.params.category_id).exec(),
        Item.find({category:req.params.category_id}, "name").exec()]);
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

exports.create_post = [
    body("name", "Category Name Must be three or more Characters")
    .trim()
    .isLength({min:3})
    .escape(),
    body("description")
    .optional({values:"falsy"})
    .trim()
    .escape(),
    asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const category = new Category({
        name: req.body.name,
        description: req.body.description
    })
    const exists = await Category.findOne({name:category.name}).exec();
    if(exists){
        res.render("category_form",{title:"Create Category", category:category, errors:[{msg:"Category Already Exists, Please Choose Another Name"}] })
        return;
    }
    if(!errors.isEmpty()){
        res.render("category_form",{title:"Create Category", category:category, errors:errors.array() });
        return;
    }
    await category.save();
    res.redirect(category.url);

})
];

exports.update_get = asyncHandler(async (req, res,next) => {
    const category = await Category.findById(req.params.category_id).exec();
    if(category == null){
        const err = new Error("Category Not found")
        err.status = 404;
        return next(err)
    }
    res.render("category_form", {title:"Update Category",category:category,passRequired:true})

});

exports.update_post = [body("password","invalid password").trim().escape().equals(ADMIN_PASS),
    body("name", "Category Name Must be three or more Characters")
    .trim()
    .isLength({min:3})
    .escape(),
    body("description")
    .optional({values:"falsy"})
    .trim()
    .escape(),
    asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    const category = new Category({
        name: req.body.name,
        description: req.body.description,
        _id: req.params.category_id
    })
    if(!errors.isEmpty()){
        res.render("category_form",{title:"Update Category", category:category, errors:errors.array(),passRequired:true });
        return;
    }

    await Category.findByIdAndUpdate(req.params.category_id,category)
    res.redirect(category.url);
})
];

exports.delete_get = asyncHandler(async (req, res) => {
    const [category,itemsInCategory ] = await Promise.all([Category.findById(req.params.category_id).exec(),
        Item.find({category:req.params.category_id}, "name").exec()]);
    if(category == null){
        res.redirect("/inventory/categories");
    }

    res.render("category_delete", {title:"Delete Category", category:category, itemsInCategory:itemsInCategory,passRequired:true})

});

exports.delete_post = [
    body("password","invalid password").trim().escape().equals(ADMIN_PASS),
    asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    
    const [category,itemsInCategory ] = await Promise.all([
        Category.findById(req.params.category_id).exec(),
        Item.find({category:req.params.category_id}, "name").exec()]);

    if(!errors.isEmpty()){
        res.render("category_delete", {title:"Delete Category", category:category, itemsInCategory:itemsInCategory,errors:errors.array(),passRequired:true})
        return;
    }

    if(category == null){
        res.redirect("/inventory/categories");
    }

    if(itemsInCategory.length > 0 ){
        res.render("category_delete", {title:"Delete Category", category:category, itemsInCategory:itemsInCategory,passRequired:true})
    }
    await Category.findByIdAndDelete(req.params.category_id);
    res.redirect("/inventory/categories");
})];