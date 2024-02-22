const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name:{type:string,required:true,minLength:3},
    description: {type:string},
    category:[{type:Schema.Types.ObjectId, ref: "Category"}],
    price:{type:Number,required:true},
    stock:{type:Number, minNumber:0},

})


module.exports = mongoose.model("Item",ItemSchema);