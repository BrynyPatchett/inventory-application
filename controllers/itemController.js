const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res) => {
    res.send("NOT_YET_IMPLEMENTED: Index Page for Items")
}
);

exports.item_list = asyncHandler(async (req, res) => {
    res.send("NOT_YET_IMPLEMENTED: Page for item list")
}
);

exports.detail_get = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Detail Page for Item: ${req.params.item_id}`)
});

exports.create_get = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Create item page`)
});

exports.create_post = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Create item Post Request Response`)
});

exports.update_get = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Update page for ${req.params.item_id}`)
});

exports.update_post = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Update Post Requst response for ${req.params.item_id}`)
});

exports.delete_get = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Delete Page for  ${req.params.item_id}`)
});

exports.delete_post = asyncHandler(async (req, res) => {
    res.send(`NOT_YET_IMPLEMENTED: Delete Post Requst response for ${req.params.item_id}`)
});