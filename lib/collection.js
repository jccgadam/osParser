var today = new Date();
var formatDate = (today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear();
productInfo = new Mongo.Collection('ProductInfo');
customerInfo = new Mongo.Collection('customerInfo');
companyInfo = new Mongo.Collection('companyInfo');
salesOrders = new FS.Collection("SalesOrders", {
  stores: [new FS.Store.FileSystem("SalesOrders"+formatDate, {path: "~/uploads"})]
});

Schemas={};

Schemas.productInfoSchema = new SimpleSchema({
  productName:{
    type:String,
    label:'Product Name'
  },
  description:{
    type:String,
  },
  price:{
    type:Number,
    decimal:true,
    label:'Product Price',
    min:0
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
    type:Number,
    min:0
  }
})
Schemas.companyInfoSchema = new SimpleSchema({
    companyName:{
      type:String,
      label:'Company Name',
    },
    productInfo:{
      type:[Schemas.productInfoSchema],
      optional:true
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
  phone:{
    type:String,
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
  },
  createdAt:{
    type:Date,
    autoValue:function(){
      if(!this.isSet&&this.isInsert){
        return new Date();
      }
    }
  }
})

SimpleSchema.debug = true;
customerInfo.attachSchema(Schemas.customerInfoSchema);
productInfo.attachSchema(Schemas.productInfoSchema);
companyInfo.attachSchema(Schemas.companyInfoSchema);
