const mongo = require("mongoose")

const d = new mongo.Schema({
    Discord_ID: { type: String },
    Roblox__ID: { type: String },
    money: { type: Number },
    account: { type: Number },
    date: { type: String }
})

const MessageModel = module.exports = mongo.model("계좌", d);