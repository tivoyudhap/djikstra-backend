'use strict'

const fs = require('fs');
const path = require('path');

const response = require('../helper/base_response');
const reader = require('../helper/reader');
const Line = require('../entity/line');
const Interchange = require('../entity/interchange');
const Latlng = require('../entity/latlng');
const DjikstraTransport = require('../helper/djikstra_transport');
const Priority = require('../helper/djikstra_transport');
const PointTransport = require('../entity/point_transport');
const Path = require('../entity/path');
const RouteTransport = require('../helper/route_transport');
const helper = require('../helper/helper');
require('buffer');

async function get(req, res) {
  let sourceLatitude = req.query.source_lat;
  let sourceLongitude = req.query.source_long;
  let destinationLatitude = req.query.destination_lat;
  let destinationLongitude = req.query.destination_long;
  // should be COST or DISTANCE
  let priority = req.query.priority;
  let radius = req.query.radius;

  const jsonData = await reader.readJsonFileAsString('./data/files.json');

  const parsedData = JSON.parse(jsonData);
    const linesData = parsedData.lines.map(lineData => {
      let line =  new Line(
        lineData.idline,
        lineData.name,
        lineData.color,
        lineData.direction,
        null,
        0,
        lineData.path
      )
      lineData.path.forEach(element => {
        let path = new Path(
          element.idline,
          element.idpoint,
          element.sequence,
          element.stop,
          element.idinterchange,
          element.lat,
          element.lng
        )

        line.addPointTransport(path);
      });

      return line;
    });

    const interchangesData = parsedData.interchanges.map(interchangeData => new Interchange(
      interchangeData.idinterchange,
      interchangeData.name,
      interchangeData.pointIds,
      interchangeData.points
    ));

    const pointTransport = [];
    linesData.forEach(element => {
      element.path.forEach(elementPath => {
        let transport = new PointTransport(
          elementPath.idline,
          elementPath.lat,
          elementPath.lng,
          elementPath.stop,
          element.idline,
          element.name,
          element.direction,
          element.color,
          elementPath.sequence,
          null,
          null
        );

        pointTransport.push(transport);
      })
    });

    const LinesClass = { lines: linesData };
    const InterchangesClass = { interchanges: interchangesData };

    let source = new Latlng(sourceLatitude, sourceLongitude);
    let destination = new Latlng(destinationLatitude, destinationLongitude);

    let route = await calculateRoutes(source, destination, radius, priority, pointTransport);

    return response.ok(route, "Success get values", res);
}

async function calculateRoutes(sourceLatLng, destinationLatLng, radius, priority, pointTransport) {
  const sources = await getSeveralNearby(sourceLatLng.latitude, sourceLatLng.longitude, radius, pointTransport);
  const destinations = await getSeveralNearby(destinationLatLng.latitude, destinationLatLng.longitude, radius, pointTransport);

  const total = sources.size * destinations.size;
  const paths = [];
  const routeTransports = [];

  let progress = 0;
  for (const sourcePoint of sources) {
    for (const destinationPoint of destinations) {
      DjikstraTransport.calculateShortestPathFrom(sourcePoint, priority);

      const path = priority === Priority.COST
        ? destinationPoint.getCheapestPath()
        : destinationPoint.getShortestPath();

      if (path.length > 0) {
        path.push(destinationPoint);
        paths.push(path);
        const routeTransport = new RouteTransport(sourcePoint, destinationPoint, path);
        routeTransports.push(routeTransport);
      }

      progress++;
    }
  }

  // Sort the results
  routeTransports.sort((a, b) => {
    const comparatorType = priority === DjikstraTransport.Priority.COST
      ? RouteTransport.ComparatorType.PRICE
      : RouteTransport.ComparatorType.DISTANCE;
    return RouteTransport.getComparator(comparatorType)(a, b);
  });

  return routeTransports;
}

async function getSeveralNearby(latitude, longitude, radius, pointTransports) {
    const nearbyPointTransports = new Set();
  
    if (!pointTransports) return nearbyPointTransports;

    const pointTransportMap = new Map();
  
    for (const point of pointTransports) {
      const distance = helper.calculateDistance(point, latitude, longitude);
      if (distance < radius * 0.00000898448) {
        let exists = false;
        let existingPoint = null;
        
        for (const p of pointTransportMap.keys()) {
          if (p.getIdLine() === point.getIdLine() && p.getDirection() === point.getDirection()) {
            exists = true;
            existingPoint = p;
          }
        }
        
        if (!exists) {
          pointTransportMap.set(point, distance);
        } else {
          if (distance < pointTransportMap.get(existingPoint)) {
            pointTransportMap.delete(existingPoint);
            pointTransportMap.set(point, distance);
          }
        }
      }
    }
  
    for (const point of pointTransportMap.keys()) {
      nearbyPointTransports.add(point);
    }
  
    return nearbyPointTransports;
  }

module.exports = {
    get
};