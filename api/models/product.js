const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    gameID: { type: String, required: true} ,
    home: { type: String, required: true},
    away: { type: String, required: true},
    book: { type: String, required: true},
    homePrice: { type: Number, required: true},
    awayPrice: { type: Number, required: true},
    homeSpread: { type: Number, required: true},
    awaySpread: { type: Number, required: true},
    homeSpreadPrice: { type: Number, required: true},
    awaySpreadPrice: { type: Number, required: true},
    OverTotal: { type: String, required: true},
    UnderTotal: { type: String, required: true},
    OverTotalPrice: { type: Number, required: true},
    UnderTotalPrice: { type: Number, required: true},
    date: { type: Date, required: true}
});

module.exports = mongoose.model('Product', productSchema);