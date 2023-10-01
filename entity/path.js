class Path {
    constructor(idline, idpoint, sequence, stop, idinterchange, lat, lng) {
      this.idline = idline;
      this.idpoint = idpoint;
      this.sequence = sequence;
      this.stop = stop;
      this.idinterchange = idinterchange;
      this.lat = lat;
      this.lng = lng;
    }
}

module.exports = Path;