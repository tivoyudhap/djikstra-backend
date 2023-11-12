const TransportCost = require('./transport_cost');
const CDM = require('../helper/helper');
const Point = require('./point');

class PointTransport extends Point {
    constructor(
        id,
        lat,
        lng,
        stop,
        idLine,
        lineName,
        direction,
        color,
        sequence,
        adjacentPoints,
        interchanges
    ) {
        super(idLine, id, sequence, stop);
        this.lat = lat;
        this.lng = lng;
        this.lineName = lineName;
        this.direction = direction;
        this.color = color;
        this.adjacentPointId = adjacentPoints;
        this.adjacentPointInterchangeIds = interchanges;
        this.price = CDM.getStandardCost();
        this.adjacentTransportPoints = new Map();
        this.previousTransportPoints = new Map();
        this.via = [];
        this.mSubChains = new Map();
        this.cheapestPath = [];
        this.shortestPath = [];
        this.transportCost = new TransportCost();
      }
  
    // Getter methods
    lat() {
      return this.lat;
    }
  
    lng() {
      return this.lng;
    }
  
    isStop() {
      return this.stop;
    }
  
    getId() {
      return this.id;
    }
  
    getIdLine() {
      return this.idLine;
    }
  
    getColor() {
      return Color.parseColor(this.color);
    }
  
    getLineName() {
      return this.lineName;
    }
  
    getPrice() {
      return this.price;
    }
  
    getAdjacentPointId() {
      return this.adjacentPointId;
    }
  
    getInterchanges() {
      if (this.adjacentPointInterchangeIds !== null) {
        return this.adjacentPointInterchangeIds.split(",");
      } else {
        return null;
      }
    }
  
    getAdjacentTransportPoints() {
      return this.adjacentTransportPoints;
    }
  
    getCost() {
      return this.transportCost;
    }
  
    getCheapestPath() {
      return this.cheapestPath;
    }
  
    getShortestPath() {
      return this.shortestPath;
    }
  
    getDirection() {
      if (this.direction !== null && this.direction === "O") {
        return "Outbound";
      }
      if (this.direction !== null && this.direction === "I") {
        return "Inbound";
      }
      return this.direction;
    }
  
    getColorString() {
      return this.color;
    }
  
    // Additional methods
  
    addDestination(destination, cost) {
      this.adjacentTransportPoints.set(destination, cost);
    }
  
    clearDestination() {
      this.adjacentTransportPoints.clear();
    }
  
    setDistance(distance) {
      this.transportCost.distance = distance;
    }
  
    setPrice(price) {
      this.transportCost.price = price;
    }
  
    setCheapestPath(cheapestPath) {
      this.cheapestPath = cheapestPath;
    }
  
    setShortestPath(shortestPath) {
      this.shortestPath = shortestPath;
    }
  
    getCheapestPathCost() {
      let cost = 0;
      let currentLineId = 0;
  
      for (const p of this.cheapestPath) {
        if (cost === 0 && currentLineId === 0) {
          cost += p.price;
          currentLineId = p.getIdLine();
        }
  
        if (currentLineId !== p.getIdLine()) {
          currentLineId = p.getIdLine();
          cost += p.price;
        }
      }
  
      return cost;
    }
  
    addSource(source, cost) {
      this.previousTransportPoints.set(source, cost);
    }
  
    getDegree() {
      return (
        this.adjacentTransportPoints.size + this.previousTransportPoints.size
      );
    }
  
    inMiddleOfChain() {
      return (
        this.adjacentTransportPoints.size === 1 &&
        this.previousTransportPoints.size === 1
      );
    }
  
    getPreviousTransportPoints() {
      return this.previousTransportPoints;
    }
  
    addSubChain(next, subChain) {
      this.mSubChains.set(next, subChain);
    }
  
    getSubChain(next) {
      return this.mSubChains.get(next);
    }
  
    clearPath() {
      this.cheapestPath = [];
      this.shortestPath = [];
    }
  
    getLatLng() {
      return { lat: this.lat, lng: this.lng };
    }
}

module.exports = PointTransport;