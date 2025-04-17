const mongoose = require('mongoose');

const contentSchema = mongoose.Schema({
          content:{
                    topics: {
                              ar: [String],
                              en: [String]
                          }
                   }

});
const Content = mongoose.model('Content',contentSchema);
module.exports = Content;