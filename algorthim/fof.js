const socialGraph = {
          'A': ['B', 'C'],
          'B': ['A', 'C', 'E'],
          'D': ['A', 'C', 'F'],
          'C': ['B', 'D'],
          'F': ['D']
};

const suggestFriends = (currentUser, graph) =>{
          const friendOfCurrentFriend = graph[currentUser] || [];
          const suggestions = {};

           friendOfCurrentFriend.forEach(friend => {
                    const friendOfFriend = graph[friend] || [];
                    friendOfFriend.forEach(potentialFriend => {
                              if(potentialFriend !== currentUser && !friendOfCurrentFriend.includes(potentialFriend))
                              {
                                        suggestions[potentialFriend] = (suggestions[potentialFriend] || 0) + 1;
                              }
                    });
           });
           const sortedSuggestions = Object.entries(suggestions)
           .map(([user, count]) => ({user, count}))
           .sort((a, b) => b.count - a.count);

           return sortedSuggestions;
}
const currentUser = 'A';
const suggestions = suggestFriends(currentUser, socialGraph);

suggestions.forEach(({user, count}) => {
          console.log(`${user} ${count} friends`)
});

module.exports = suggestFriends;