const asyncHandler = require('express-async-handler');


exports.category_list = asyncHandler(async (req, res) => {
    res.send("Page for Category list")
}
);

exports.detail_get = asyncHandler(async (req, res) => {
    res.send(`Detail Page for Category: ${req.params.category_id}`)
});

exports.create_get = asyncHandler(async (req, res) => {
    res.send(`Create Category page`)
});

exports.create_post = asyncHandler(async (req, res) => {
    res.send(`Create Category Post Request Response`)
});

exports.update_get = asyncHandler(async (req, res) => {
    res.send(`Update page for ${req.params.category_id}`)
});

exports.update_post = asyncHandler(async (req, res) => {
    res.send(`Update Post Requst response for ${req.params.category_id}`)
});

exports.delete_get = asyncHandler(async (req, res) => {
    res.send(`Delete Page for  ${req.params.category_id}`)
});

exports.delete_post = asyncHandler(async (req, res) => {
    res.send(`Delete Post Requst response for ${req.params.item_id}`)
});