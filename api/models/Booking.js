// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//     place: {type:mongoose.Schema.Types.ObjectId, require:true, ref:'Place'}, //ID của địa điểm mà booking được thực hiện. Điều này liên kết với một đối tượng ID trong cơ sở dữ liệu địa điểm (giống như trong ví dụ Place).
//     user: {type:mongoose.Schema.Types.ObjectId, require: true, ref:'User'},
//     checkIn: {type:Date, require: true},
//     checkOut: {type:Date, require: true},
//     name: {type:String, require: true},
//     phone: {type:String, require: true},
//     price: Number
//     // Cách dưới cũng đúng
//     // place: {type: mongoose.Schema.Types.ObjectId, ref:'Place'},
//     // checkIn: Date,
//     // checkOut: Date,
//     // name: String,
//     // phone: String,
//     // price: Number
// });

// const BookingModel = mongoose.model('Booking', bookingSchema);

// module.exports = BookingModel;
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    place: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Place' // Reference to the 'Place' model
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Reference to the 'User' model
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    price: Number
});


const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;