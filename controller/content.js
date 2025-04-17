const Content = require("../model/content");
const Users = require("../model/user");
const errorHandler = require("../utils/error_handler");
const getMessage = require("../utils/message");
const add = errorHandler(async (req, res) => {
          const { content } = req.body;
      
          if (!content || !content.topics || !content.topics.ar || !content.topics.en) {
                    return res.status(400).json({ message: "Invalid content structure" });
                }
            
                if (!Array.isArray(content.topics.ar) || !Array.isArray(content.topics.en)) {
                    return res.status(400).json({ message: "Topics must be arrays" });
                }
            
      
          const newContent  = new Content({
              content: {
                    topics: {
                              ar: content.topics.ar,
                              en: content.topics.en
                          }
              }
          });
      
          await newContent.save();
          res.status(200).json({
              content:newContent 
          });
      });
      
const getAllTopic = errorHandler(async (req, res) => {
          console.log("getAllTopic called"); 
    console.log("Query parameters:", req.query);
          const { language } = req.query;
          console.log("Received language:", language);

          if (!language || !['ar', 'en'].includes(language)) {
              return res.status(400).json({ message: "Invalid language" });
          }
      
          const content = await Content.findOne({ "content.topics": { $exists: true } });
      
          if (!content) {
              return res.status(404).json({ message: "Content not found" });
          }
      
          const topics = content.content.topics[language];
      
          if (!topics) {
              return res.status(404).json({ message: "No topics found for this language" });
          }
      
          res.status(200).json({
              message: language === 'ar' ? "تم استرجاع المحتوى بنجاح" : "Content retrieved successfully",
              topics
          });
      });
      const selectTopics = errorHandler(async (req, res) => {
        const { selectedTopics } = req.body;
        const { language } = req.query;
    
        if (!language || !['ar', 'en'].includes(language)) {
            return res.status(400).json({ message: getMessage('invalidLanguage', language) });
        }
    
        if (!selectedTopics || !Array.isArray(selectedTopics)) {
            return res.status(400).json({
                message: getMessage('invalidRequest', language)
            });
        }
    
        if (selectedTopics.length > 5) {
            return res.status(400).json({
                message: getMessage('maxTopics', language)
            });
        }
    
        const userId = req.user.id;
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: getMessage('userNotFound', language)
            });
        }
    
        const content = await Content.findOne({
            $or: [
                { "content.topics.ar": { $in: selectedTopics } },
                { "content.topics.en": { $in: selectedTopics } }
            ]
        });
    
        if (!content) {
            return res.status(404).json({
                message: getMessage('noValidTopics', language)
            });
        }
    
        user.selectedTopics = selectedTopics;
        user.content = content._id; 
        await user.save();
    
        res.status(200).json({
            message: getMessage('topicsSelected', language),
            selectedTopics
        });
    }); 
    
module.exports = {
          add,
          getAllTopic,
          selectTopics
}