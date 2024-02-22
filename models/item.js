const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name:{type:String,required:true,minLength:3},
    description: {type:String},
    category:[{type:Schema.Types.ObjectId, ref: "Category"}],
    price:{type:Number,required:true},
    stock:{type:Number, min:0},

})

ItemSchema.virtual("url").get(function(){
    return `/inventory/item/${this.id}`
})


module.exports = mongoose.model("Item",ItemSchema);