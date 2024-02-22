const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name:{type:string,required:true,minLength:3},
    description:{type:string}
})


CategorySchema.virtual("url").get(function(){
    return `/inventory/category/${this._id}`;
})

module.exports = mongoose.model("Category", CategorySchema);