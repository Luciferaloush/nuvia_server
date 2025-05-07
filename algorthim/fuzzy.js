const fuzzylogic = require('fuzzylogic');
// var interestGrade = function(interest) {
//     if (interest >= 0 && interest <= 2.5) return fuzzylogic.grade(interest, 0, 2.5);
//     else if (interest > 2.5 && interest <= 5) return fuzzylogic.grade(interest, 2.5, 5); 
//     return 0;
// };

// var interactionGrade = function(interaction) {
//     if (interaction >= 0 && interaction <= 30) return fuzzylogic.grade(interaction, 0, 30);
//     else if (interaction > 30 && interaction <= 60) return fuzzylogic.triangle(interaction, 30, 60, 100);
//     else if (interaction > 60) return fuzzylogic.grade(interaction, 60, 100); 
//     return 0;
// };

// const recommendationQuality = (interest, interaction) => {
//     var interestValue = interestGrade(interest);
//     var interactionValue = interactionGrade(interaction);
//     var quality = Math.min(interestValue, interactionValue);

//     if (quality <= 0.2) return "B";
//     else if (quality <= 0.4) return "A";
//     else if (quality <= 0.6) return "G";
//     else if (quality <= 0.8) return "E";
//     else return "E";
// };

// const testRecommendation = (interest, interaction) => {
//     var quality = recommendationQuality(interest, interaction);
//     console.log(`Interest: ${interest}, Interaction: ${interaction}, Recommendation Quality: ${quality}`);
// };
// testRecommendation(4, 50);   
// testRecommendation(3, 35);   
// testRecommendation(2.6, 65);

// module.exports = recommendationQuality;

const interestLevel = (interest) => {
    if (interest > 0 && interest < 2) {
        return fuzzylogic.grade(interest, 0, 2); // Small Level
    } else if (interest >= 2 && interest <= 5) {
        return fuzzylogic.grade(interest, 2, 5); // Medium Level
    } else if (interest > 5) {
        return fuzzylogic.grade(interest, 5, 10); // High Level
    }
    return 0; 
};

const engagementLevel = (engagement) => {
    if (engagement > 0 && engagement < 25) {
        return fuzzylogic.grade(engagement, 0, 25); // Small Level
    } else if (engagement >= 25 && engagement <= 75) {
        return fuzzylogic.grade(engagement, 25, 75); // Medium Level
    } else if (engagement > 75) {
        return fuzzylogic.grade(engagement, 75, 100); // High Level
    }
    return 0; 
};

const evaluateRecommendation = (interest, engagement) => {
    const interestValue = interestLevel(interest);
    const engagementValue = engagementLevel(engagement);
    const overallScore = Math.min(interestValue, engagementValue);

    if (overallScore >= 0.9) return "ER"; // Excellent Recommendation
    else if (overallScore >= 0.7) return "GR"; // Good Recommendation
    else if (overallScore >= 0.4) return "AR"; // Average Recommendation
    else return "BR"; // Bad Recommendation
};

module.exports = evaluateRecommendation;