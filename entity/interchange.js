class Interchange {
    constructor(idinterchange, name, pointIds, points) {
      this.idinterchange = idinterchange;
      this.name = name;
      this.pointIds = pointIds;
      this.points = points;
    }
  
    addPointId(pointId) {
      this.pointIds.add(pointId);
    }
  
    addPoint(point) {
      this.points.add(point);
    }
  }

module.exports = Interchange;