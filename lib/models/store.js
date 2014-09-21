
module.exports = function(schema) {
   return schema.define("Store", {
      name:       {type: String, length: 80},
      phone:      {type: String, length: 12},
      lat:        {type: Number, index: true},
      lon:        {type: Number, index: true},
      addr1:      {type: String, length: 80},
      addr2:      {type: String, length: 80},
      city:       {type: String, length: 60},
      state:      {type: String, length: 2},
      zipcode:    {type: String, length: 5},
      zipplus:    {type: String, length: 4},
      created:    {type: Number, default: function() { return Date.now; } },
      deleted:    {type: Number, index: true}
   });
};

