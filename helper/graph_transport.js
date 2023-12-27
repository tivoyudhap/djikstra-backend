class GraphTransport {
  build(lines, interchanges) {
    const pointSets = new Set();

    for (const line of lines) {
      let prevPoint = null;
      for (const point of line.path) {
        if (prevPoint === null) {
          prevPoint = point;
          continue;
        } else {
          const distance = this.calculateDistance(prevPoint, point);
          const cost = { standardCost: 0, distance };

          prevPoint.addDestination(point, cost);
          point.addSource(prevPoint, cost);
          prevPoint = point;
        }

        pointSets.add(point);
      }
    }

    // Assign points to interchanges
    for (const interchange of interchanges) {
      for (const point of pointSets) {
        for (const pointId of interchange.pointIds) {
          if (point.id === pointId) interchange.points.push(point);
        }
      }
    }

    for (const interchange of interchanges) {
      for (const sPoint of interchange.points) {
        for (const dPoint of interchange.points) {
          if (sPoint.id === dPoint.id) continue;
          const cost = { standardCost: 0, distance: 0 };
          sPoint.addDestination(dPoint, cost);
          dPoint.addSource(sPoint, cost);
        }
      }
    }

    return pointSets;
  }

  calculateDistance(a, b) {
    const latDifference = a.lat - b.lat;
    const lngDifference = a.lng - b.lng;
    const distance = Math.sqrt(Math.pow(latDifference, 2) + Math.pow(lngDifference, 2));
    return distance;
  }
}

module.exports = GraphTransport;