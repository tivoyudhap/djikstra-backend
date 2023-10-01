const cost = 4000;
const standardDistance = 400;
const oneMeterInDegreeVar = 0.00000898448;

function getStandardCost() {
    return cost;
  }
  
  function getStandardDistance() {
    return standardDistance;
  }
  
  function oneMeterInDegree() {
    return oneMeterInDegreeVar;
  }

  function calculateDistance(a, lat, lng) {
    return Math.sqrt(Math.pow(a.lat - lat, 2) + Math.pow(a.lng - lng, 2));
  }
  
  // Export the functions and constants
  module.exports = {
    getStandardCost,
    getStandardDistance,
    oneMeterInDegree,
    calculateDistance
  };