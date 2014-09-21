
module.exports = function(schema) {
   var Transaction = schema.define("Transaction", {
      sessionStart:     {type: Number, index: true},
      sessionEnd:       {type: Number, index: true},
      payType:          {type: String, length: 12},
      payConfirmation:  {type: String, length: 128}
   });

   Transaction.hasMany(TransactionItem, {as: "items", foreignKey: "transactionId"});

   return Transaction;
};
