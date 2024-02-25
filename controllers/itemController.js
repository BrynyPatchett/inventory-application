const asyncHandler = require('express-async-handler');

exports.index = asyncHandler( async(req,res) => {
    res.send("Index Page for Items")
}
);

exports.item_list = null;

exports.detail_get = null;

exports.create_get = null;

exports.create_post = null;

exports.update_get = null;

exports.update_post = null;

exports.delete_get = null;

exports.delete_post = null;