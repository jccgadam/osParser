
productInfo = new Mongo.Collection('ProductInfo');
customerInfo = new Mongo.Collection('customerInfo');
salesOrders = new FS.Collection("SalesOrders", {
  stores: [new FS.Store.FileSystem("SalesOrders", {path: "~/uploads"})]
});


Schemas={};

Schemas.productInfoSchema = new SimpleSchema({
  productName:{
    type:String,
  },
  price:{
    type:Number,
    decimal:true
  }
})
Schemas.nameSchema = new SimpleSchema({
  firstName:{
    type:String,
    label:'First Name'
  },
  middleName:{
    type:String,
    optional:true
  },
  lastName:{
    type:String,
    label:'Last Name'
  },
})

Schemas.addressSchema = new SimpleSchema({
  street:{
    type:String,
  },
  city:{
    type:String,
  },
  state:{
    type:String,
  },
  zip:{
    type:String
  },
  country:{
    type:String,
    optional:true
  }
})

Schemas.refillProduct = new SimpleSchema({
  productName:{
    type:String,
  },
  quantity:{
    type:String,
  }
})

Schemas.customerInfoSchema = new SimpleSchema({
  customerName:{
    type:String
  },
  address:{
    type:Schemas.addressSchema
  },
  refillProducts:{
    type:[Schemas.refillProduct]
  },
  repunishDate:{
    type:Date,
    autoValue:function(){
      if(!this.isSet&&this.isInsert){
        return new Date();
      }
    }
  },
  status:{
    type:Boolean,
    autoValue:function(){
      if(!this.isSet&&this.isInsert){
        return true;
      }
    }
  },
  business:{
    type:String,
  }
})

customerInfo.attachSchema(Schemas.customerInfoSchema);
productInfo.attachSchema(Schemas.productInfoSchema);
