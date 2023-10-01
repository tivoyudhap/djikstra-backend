class Line {
    constructor(id, name, color, direction, path) {
      this.id = id;
      this.name = name;
      this.color = color;
      this.direction = direction;
      this.cost = null; // Initialize cost as null
      this.distance = 0;
      this.path = []; // Initialize path as an empty array
    }
  
    addPointTransport(point) {
      this.path.push(point);
    }
  }

module.exports = Line;