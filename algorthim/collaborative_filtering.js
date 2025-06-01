function calculateJaccardSimilarity(setA, setB) {
          const setA_ = new Set(setA);
          const setB_ = new Set(setB);
          // ايجاد تقاطع المجموعتين
          const intersection = new Set([...setA_].filter(x => setB_.has(x)));
          // اتحاد
          const union = new Set([...setA_, ...setB_]);

          return intersection.size / union.size; // معامل جاكارد
}

const users = [
          {name: "Ahmed", interests: ["كتب", "موسيقى", "رياضة"]},
          {name: "Basma", interests: ["كتب", "فنون", "موسيقى"]},
          {name: "Zaid", interests: ["افلام", "سياحة", "رياضة"]},
          {name: "Rana", interests: ["رياضة", "كتب", "موسيقى"]},
];

const targertUser = users[0];

const similarUsers = users.filter(user => user !== targertUser).map(user => ({
          name: user.name,
          similarity:
          calculateJaccardSimilarity(targertUser.interests, user.interests)
}));

const sortedSimilarUser = similarUsers.sort((a, b) => {
          if(a.similarity < 0 || a.similarity > 1 || b.similarity < 0 || b.similarity > 1){
                    return 0;
          }
          return b.similarity - a.similarity;
});
console.log("users gool",targertUser.name);
console.log("users similarity");
sortedSimilarUser.forEach(user => {
          console.log(`${user.name}: Similarity = ${user.similarity.toFixed(2)}`);
});

module.exports = {
          calculateJaccardSimilarity
}
