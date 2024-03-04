const Category = require('../models/category');
var ObjectID = require('mongodb').ObjectId;
const Item = require('../models/item')
const asyncHandler = require('express-async-handler');
const {body,validationResult} = require("express-validator")
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/')
    },
    filename: function (req, file, cb) {
      const ext = file.originalname.split('.').pop()
      req.imageExstension = ext;
      cb(null, req.objectID.toHexString()+ "."+ ext);
    }
  })

  function myMiddleware(req,res, next) {
    req.objectID = new ObjectID();
    next();
  }
//used to pass to image name
function createObjectID(req,res,next){

 req.body.objectID = new ObjectID().toHexString();
 next();
}

const upload = multer({storage:storage})
const fs = require('node:fs/promises')
require("dotenv").config();

const ADMIN_PASS = process.env.ADMIN_PASS;



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
    res.render("item_form",{title:"Create Item",Categories:allCategories, passRequired:false})
});

exports.create_post = [myMiddleware,upload.single("image"),(err,req,res,next) => {
   
    //if only one category is in request
    if(!Array.isArray(req.body.category)){
        req.body.category = typeof req.body.category === "undefined"? [] : [req.body.category];
    }
    next();
},body("name","Name must be longer than 3 characters")
.trim().isLength({min:3}).escape(),
body("description")
.optional({values:"falsy"})
.trim()
.escape(),
body("price", "Price must be zero or a positive number")
.isFloat({min:0}),
body("stock", "Stock values must be zero or a positive number")
.isInt({min:0}),
asyncHandler(async (req,res,next) => {
     console.log(req.objectID)
     console.log(req.imageExstension)
    const errors = validationResult(req);
    
    const item = new Item({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        category:req.body.category,
        image_mime_type:req.imageExstension,
        _id:req.objectID
    })


    if(!errors.isEmpty()){
        const allCategories = await Category.find({}).sort({name:1}).exec()
    
        allCategories.forEach(category => {
            if(item.category.includes(category._id)){
                category.checked = "true";
            }
        });

        if(req.file){
            await fs.unlink(req.file.path)
        }

        res.render("item_form",{title:"Create Item",item:item, Categories:allCategories,errors:errors.array(),passRequired:false})
        return;
    }
    await item.save();
    res.redirect(item.url);

})
];



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

    res.render("item_form",{title:"Update Item",item:item, Categories:allCategories,passRequired:true})
});

exports.update_post = [
    body("password","invalid password").trim().escape().equals(ADMIN_PASS)
    ,(req,res,next) => {
    //if only one category is in request
    if(!Array.isArray(req.body.category)){
        req.body.category = typeof req.body.category === "undefined"? [] : [req.body.category];
    }
    next();
},body("name","Name must be longer than 3 characters")
.trim().isLength({min:3}).escape(),
body("description")
.optional({values:"falsy"})
.trim()
.escape(),
body("price", "Price must be zero or a positive number")
.isFloat({min:0}),
body("stock", "Stock values must be zero or a positive number")
.isInt({min:0}),
asyncHandler(async (req,res,next) => {
    const errors = validationResult(req);
    
    const item = new Item({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        category:req.body.category,
        _id: req.params.item_id
    })


    if(!errors.isEmpty()){
        const allCategories = await Category.find({}).sort({name:1}).exec()
    
        allCategories.forEach(category => {
            if(item.category.includes(category._id)){
                category.checked = "true";
            }
        });
        res.render("item_form",{title:"Create Item",item:item, Categories:allCategories,errors:errors.array(),passRequired:true})
        return;
    }
    await Item.findByIdAndUpdate(req.params.item_id,item)
    res.redirect(item.url);

})
];

exports.delete_get = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.item_id);
    if (item == null){
        res.redirect("/inventory/items")
    }
    res.render("item_delete", {title:"Delete Item", item:item,passRequired:true})
});

exports.delete_post = [
    body("password","invalid password").trim().escape().equals(ADMIN_PASS)
    ,asyncHandler(async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const item = await Item.findById(req.params.item_id);
        res.render("item_delete",{title:"Delete Item",item:item,errors:errors.array(),passRequired:true})
        return;
    }
    await Item.findByIdAndDelete(req.params.item_id);
    res.redirect("/inventory/items");
})];