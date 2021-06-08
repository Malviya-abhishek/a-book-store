const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = new Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },

  status: {
    type: String,
    default: "order_place"
  },

  sellers: [
    {
      sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true,
      },
      status:{
        type:Number,
        require:true,
        default:0
      },
      books:[
        { 
          qty:{
            type:Number,
            require: true
          },
          book:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Book',
            require:true
          }
        },
      ],
      
    },
  ],
  phone: {
    type: String,
    require: true
  },
  address: {
    type: String,
    require: true
  },
  paymentType: {
    type: String,
    default: "COD"
  }

}, { timestamps: true });


orderSchema.pre('save', function(next){
  let x = 4;
  this.sellers.forEach( order => {
    x = Math.min(x, order.status);
  });
  this.status = x;
  next();
});

// const orderSchema = new Schema({
//   customerId:{
//     type:mongoose.Schema.Types.ObjectId, 
//     ref: 'User',
//     require:true,
//   },

//   items:{
//     type: Object,
//     require: true,
//   },


//   phone:{
//     type: String,
//     require:true
//   },
//   address:{
//     type:String,
//     require:true
//   },
//   paymentType:{
//     type:String,
//     default:"COD"
//   },
//   status:{
//     type:String,
//     default:"order_place"
//   }
// }, {timestamps: true});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
