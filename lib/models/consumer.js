
module.exports = function(schema) {
   return schema.define("Consumer", {
      deviceSignature:     {type: String, length: 1048},
      msisdn:              {type: String, length: 40},
      email:               {type: String, length: 120}
   });
};
