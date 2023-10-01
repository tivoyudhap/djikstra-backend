class RouteTransport {
    constructor(source, destination, path) {
        this.source = source;
        this.destination = destination;
        this.path = path;
        this.cost = destination.getCost();
        this.lineCodes = [];
        this.colorCodes = [];
    
        if (path) {
          let prevPath = null;
          for (const p of path) {
            const dir = `${p.getLineName()} ${p.getDirection().substring(0, 1) === 'O' ? '\u25B6' : '\u25C0'}`;
            if (prevPath === null) {
              prevPath = dir;
              this.lineCodes.push(prevPath);
              this.colorCodes.push(p.getColor());
              continue;
            } else {
              if (prevPath === dir) continue;
              prevPath = dir;
              this.lineCodes.push(prevPath);
              this.colorCodes.push(p.getColor());
            }
          }
        }
      }
    
      getDistanceReadable() {
        return Math.floor(this.cost.distance / CDM.oneMeterInDegree());
      }
    
      getTotalPrice() {
        return this.cost.price + CDM.getStandardCost();
      }
    
      getSource() {
        return this.source;
      }
    
      getDestination() {
        return this.destination;
      }
    
    // should be PRICE or DISTANCE
    static getComparator(type) {
        if (type === 'PRICE') {
          return (o1, o2) => {
            if (o1.getTotalPrice() < o2.getTotalPrice()) return -1;
            if (o1.getTotalPrice() === o2.getTotalPrice()) {
              return o1.getDistanceReadable() - o2.getDistanceReadable();
            } else return 1;
          };
        } else {
          return (o1, o2) => {
            if (Math.abs(o1.getDistanceReadable() - o2.getDistanceReadable()) <= 100) {
              return o1.getNumLines() - o2.getNumLines();
            } else return o1.getDistanceReadable() - o2.getDistanceReadable();
          };
        }
    }
    
    getPath() {
        return this.path;
    }
    
    getNumLines() {
        return this.lineCodes.length;
    }
}

module.exports = RouteTransport;