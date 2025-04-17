const fuzzylogic = require('fuzzylogic');
var interestGrade = function(interest) {
    if (interest >= 0 && interest <= 2.5) return fuzzylogic.grade(interest, 0, 2.5);
    else if (interest > 2.5 && interest <= 5) return fuzzylogic.grade(interest, 2.5, 5); 
    return 0;
};

var interactionGrade = function(interaction) {
    if (interaction >= 0 && interaction <= 30) return fuzzylogic.grade(interaction, 0, 30);
    else if (interaction > 30 && interaction <= 60) return fuzzylogic.triangle(interaction, 30, 60, 100);
    else if (interaction > 60) return fuzzylogic.grade(interaction, 60, 100); 
    return 0;
};

var recommendationQuality = function(interest, interaction) {
    var interestValue = interestGrade(interest);
    var interactionValue = interactionGrade(interaction);
    var quality = Math.min(interestValue, interactionValue);

    if (quality <= 0.2) return "B";
    else if (quality <= 0.4) return "A";
    else if (quality <= 0.6) return "G";
    else if (quality <= 0.8) return "E";
    else return "E";
};

var testRecommendation = function(interest, interaction) {
    var quality = recommendationQuality(interest, interaction);
    console.log(`Interest: ${interest}, Interaction: ${interaction}, Recommendation Quality: ${quality}`);
};
testRecommendation(4, 50);   
testRecommendation(3, 35);   
testRecommendation(2.6, 65);