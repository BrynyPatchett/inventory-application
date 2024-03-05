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
      cb(null, (req.params.item_id? req.params.item_id : req.objectID.toHexString())+ "."+ ext);
    }
  })

  function createObjectID(req,res, next) {
    if(req.params.item_id == undefined){
        req.objectID = new ObjectID();
    }
    next();
  }


const upload = multer({storage:storage,  limits: { fileSize: 1000000},fileFilter: function (req, file, cb) {

    var filetypes = /jpeg|jpg|gif|png|webp/;
    var mimetype = filetypes.test(file.mimetype);
    const ext = file.originalname.split('.').pop()
    var extname = filetypes.test(ext);
    
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
  }}).single("image")
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

exports.create_post = [createObjectID,upload,(err,req,res,next) => {
    
   if(err){
    req.error = err;
   }
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
    const validationErrors = validationResult(req);
    
    const item = new Item({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        category:req.body.category,
        image_mime_type:req.imageExstension,
        _id:req.objectID
    })


    if(!validationErrors.isEmpty() || req.error){
        const allCategories = await Category.find({}).sort({name:1}).exec()
        const errors = validationErrors.array();
        if(req.error ){
            if(!(req.error instanceof multer.MulterError)){
                errors.push({msg:req.error});
            }else{
                errors.push({msg:req.error.field + ' : '+req.error.code})
            }
        }   

    
        allCategories.forEach(category => {
            if(item.category.includes(category._id)){
                category.checked = "true";
            }
        });
    
        if(req.file){
          
            await fs.unlink(req.file.path)
        }

        res.render("item_form",{title:"Create Item",item:item, Categories:allCategories,errors:errors,passRequired:false})
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

exports.update_post = [createObjectID,upload
    ,(err,req,res,next) => {
        if(err){
            req.error = err;
           }
    //if only one category is in request
    if(!Array.isArray(req.body.category)){
        req.body.category = typeof req.body.category === "undefined"? [] : [req.body.category];
    }
   
    next();
},
body("description")
.optional({values:"falsy"})
.trim()
.escape(),
body("price", "Price must be zero or a positive number")
.isFloat({min:0}),
body("stock", "Stock values must be zero or a positive number")
.isInt({min:0}),
body("password","invalid password").trim().escape().equals(ADMIN_PASS)
,body("name","Name must be longer than 3 characters")
.trim().isLength({min:3}).escape(),
asyncHandler(async (req,res,next) => {
    const errorsValidation = validationResult(req);

    
    const item = new Item({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        category:req.body.category,
        image_mime_type:req.imageExstension,
        _id: req.params.item_id
    })


    if(!errorsValidation.isEmpty() || req.error){
        const allCategories = await Category.find({}).sort({name:1}).exec()
        const errors = errorsValidation.array();
        
        
        if(req.error ){
            if(!(req.error instanceof multer.MulterError)){
                errors.push({msg:req.error});
            }else{
                errors.push({msg:req.error.field + ' : '+req.error.code})
            }
        }   
    
        allCategories.forEach(category => {
            if(item.category.includes(category._id)){
                category.checked = "true";
            }
        });
        res.render("item_form",{title:"Update Item",item:item, Categories:allCategories,errors:errors,passRequired:true})
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
    
    const deletedItem = await Item.findByIdAndDelete(req.params.item_id);
    if(deletedItem.image_mime_type && deletedItem.image_mime_type != undefined){
        fs.unlink(`public/images/${req.params.item_id +"."+ deletedItem.image_mime_type}`)
    }
    res.redirect("/inventory/items");
})];