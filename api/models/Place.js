const mongoose = require('mongoose');

// owner: Tên của trường trong schema, đại diện cho chủ sở hữu của địa điểm.
// {type: mongoose.Schema.Types.ObjectId, ref:'User'}: Đây là cách Mongoose xác định kiểu dữ liệu của trường "owner". Trường này được đặt kiểu dữ liệu là ObjectId, một kiểu dữ liệu đặc biệt trong MongoDB được sử dụng để lưu trữ các đối tượng ID (duy nhất) của các bản ghi trong cơ sở dữ liệu.
// mongoose.Schema.Types.ObjectId: Đây là kiểu dữ liệu ObjectId trong Mongoose.
// ref: 'User': Chỉ định rằng các giá trị của trường "owner" sẽ được tham chiếu đến các bản ghi trong bảng "User" (hoặc collection "User") trong cơ sở dữ liệu MongoDB. Nói cách khác, trường "owner" sẽ chứa ID của một người dùng từ bảng "User". Điều này giúp thiết lập mối quan hệ giữa địa điểm và người dùng.

const placeSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    title: String,
    address: String,
    photos: [String],
    description: String,
    perks: [String],//đặc quyền
    extraInfo: String,//thong tin thêm
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number,
    price: Number
}, {
    timestamps: true
})

const PlaceModel = mongoose.model('Place', placeSchema);

module.exports = PlaceModel;