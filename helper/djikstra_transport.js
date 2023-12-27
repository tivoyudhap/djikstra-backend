const TransportCost = require('../entity/transport_cost');

async function calculateShortestPathFrom(source, priority) {
  source.setPrice(0);
  source.setDistance(0);
  const settledPoints = new Set();
  const unsettledPoints = new Set();
  unsettledPoints.add(source);
  let currentPoint;

  while (unsettledPoints.size !== 0) {
    if (priority == "COST")
      currentPoint = await getLowestPricePoint(unsettledPoints);
    else currentPoint = await getLowestDistancePoint(unsettledPoints);

    unsettledPoints.delete(currentPoint);

    console.dir(currentPoint, { depth: null });

    // for (let [adjacentPoint, edgeWeight] of currentPoint.getAdjacentTransportPoints().entries()) {
    //   console.log(adjacentPoint);
    //   if (!settledPoints.has(adjacentPoint)) {
    //     await calculateMinimumPrice(
    //       adjacentPoint,
    //       edgeWeight,
    //       currentPoint
    //     );
    //     await calculateMinimumDistance(
    //       adjacentPoint,
    //       edgeWeight,
    //       currentPoint
    //     );
    //     unsettledPoints.add(adjacentPoint);
    //   }
    // }

    settledPoints.add(currentPoint);
  }
}

async function getLowestPricePoint(unsettledPoints) {
  let lowestCostPoint = null;
  let lowestCost = new TransportCost();
  for (const point of unsettledPoints) {
    const pointCost = point.getCost();
    if (pointCost.price < lowestCost.price) {
      lowestCost = pointCost;
      lowestCostPoint = point;
    }
  }

  return lowestCostPoint;
}

async function getLowestDistancePoint(unsettledPoints) {
  let lowestDistancePoint = null;
  let lowestDistance = new TransportCost(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
  for (const point of unsettledPoints) {
    const pointDistance = point.getCost();
    if (pointDistance.distance < lowestDistance.distance) {
      lowestDistance = pointDistance;
      lowestDistancePoint = point;
    }
  }

  return lowestDistancePoint;
}

async function calculateMinimumDistance(evaluationPoint, edgeWeight, sourcePoint) {
  const sourceCost = sourcePoint.getCost();
  if (sourceCost.distance + edgeWeight.distance < evaluationPoint.getCost().distance) {
    evaluationPoint.setDistance(sourceCost.distance + edgeWeight.distance);
    const shortestPath = [...sourcePoint.getShortestPath()];
    shortestPath.push(sourcePoint);
    evaluationPoint.setShortestPath(shortestPath);
  }
}

async function calculateMinimumPrice(evaluationPoint, edgeCost, sourcePoint) {
  const sourceCost = sourcePoint.getCost();
  if (sourceCost.price + edgeCost.price < evaluationPoint.getCost().price) {
    evaluationPoint.setPrice(sourceCost.price + edgeCost.price);
    const cheapestPath = [...sourcePoint.getCheapestPath()];
    cheapestPath.push(sourcePoint);
    evaluationPoint.setCheapestPath(cheapestPath);
  }
}

const Priority = {
  COST: 'COST',
  DISTANCE: 'DISTANCE'
};

module.exports = {
  calculateShortestPathFrom,
  Priority
};