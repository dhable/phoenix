
module.exports = function(schema) {
   return schema.define("TransactionItem", {
      qty:        {type: Number},
      display:    {type: String, length: 120},
      price:      {type: Number},
      subtotal:   {type: Number},
      tax:        {type: Number}
   });
};
