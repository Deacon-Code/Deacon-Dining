const mongoose = require('mongoose')

const MenuItemSchema = new mongoose.Schema({
    location: String,
    item: String,
    date: Date,
    station: String,
    time: String,
    dateAdded: Date
})

const MenuItemModel = mongoose.model("menu-item", MenuItemSchema);
module.exports = MenuItemModel;