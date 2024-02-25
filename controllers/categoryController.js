const asyncHandler = require('express-async-handler');


exports.category_list = asyncHandler(async (req, res) => {
    res.send("NOT_YET_IMPLEMENTED: Page for Category list")
}
);

exports.detail_get = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Detail Page for Category: ${req.params.category_id}`)
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