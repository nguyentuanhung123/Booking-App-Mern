const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    place: {type:mongoose.Schema.Types.ObjectId, require:true}, //ID của địa điểm mà booking được thực hiện. Điều này liên kết với một đối tượng ID trong cơ sở dữ liệu địa điểm (giống như trong ví dụ Place).
    checkIn: {type:Date, require: true},
    checkOut: {type:Date, require: true},
    name: {type:String, require: true},
    phone: {type:String, require: true},
    price: Number
});

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;