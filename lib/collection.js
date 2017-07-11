var changeFileName = function(fileObj) {
  console.log(fileObj)
};

salesOrders = new FS.Collection("SalesOrders", {
  stores: [new FS.Store.FileSystem("SalesOrders", {path: "~/uploads",transformWrite:changeFileName})]
});
