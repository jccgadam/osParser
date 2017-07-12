

salesOrders = new FS.Collection("SalesOrders", {
  stores: [new FS.Store.FileSystem("SalesOrders", {path: "c:\\uploads"})]
});
