#! /usr/bin/env node

console.log(
    'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Category = require("./models/category");
  const Item = require("./models/item");
  
  const Categories = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  // We pass the index to the ...Create functions so that, for example,
  // genre[0] will always be the Fantasy genre, regardless of the order
  // in which the elements of promise.all's argument complete.
  async function categoryCreate(index, name,description) {
    const category = new Category({ name: name,description:description });
    await category.save();
    Categories[index] = category;
    console.log(`Added Category: ${name}`);
  }
  

  async function itemCreate( name, description, price, stock,category) {
    const itemdetail = {
      name: name,
      description: description,
      price:price,
      stock: stock,
    };
    if (category != false) itemdetail.category = category;
  
    const item = new Item(itemdetail);
    await item.save();
    console.log(`Added item: ${name}`);
  }
  
  async function createCategories() {
    console.log("Adding Categories");
    await Promise.all([
      categoryCreate(0, "Tools", "Hardware Tools"),
      categoryCreate(1, "Fittings","Fittings for all your pipes and plumming"),
      categoryCreate(2, "Building Supplies", "Supplies for all your home,garden and other project needs"),
    ]);
  }
  

  
  async function createItems() {
    console.log("Adding Items");
    await Promise.all([
    itemCreate(
        "Hammer",
        "Steel Hammer",
        20.00,
        100,
        [Categories[0]]
      ),
      itemCreate(
        "15mm Brass Threaded Back Nut",
        "Heavy Duty, High Quality, Standards Approved Brass Nut",
        2.99,
        2000,
        [Categories[1]]
      ),
      itemCreate(
        "2 x 4 Pine",
        "Pine structural timber",
        3.00,
        1000
        [Categories[2]]
      ),
      itemCreate(
        "Screwdriver",
        "Flathead screw driver",
        13.99,
        10,
        [Categories[0]]
      ),
      itemCreate(
        "Pink batts insultaion R6.0 10%^2",
        "Insulation with R.6 thermal rating, covers area f 10m^2",
        89.99,
        4,
        [Categories[2]]
      ),
      itemCreate(
        "PVC high pressure pipe 10mx25mm",
        "High pressure PVC water pipe ",
        200.99,
        22,
        [Categories[1]]
      ),
      itemCreate(
        "30L Compost",
        "30L Compost for all your soil needs",
        7.99,
        0,
        false
      ),
    ]);
  }
  