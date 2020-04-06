import * as d3 from "d3";
import * as topojson from "topojson-client";
const portugaljson = require("./portugal.json");
const d3Composite = require("d3-composite-projections");
import { latLongCommunities } from "./communities";
import { initial_stats, final_stats, ResultEntry } from "./stats";
import { color } from "d3";

// Scaling an center
const aProjection = d3
  .geoMercator()
  // Let's make the map bigger to fit in our resolution
  .scale(5600)
  // Let's center the map
  .translate([1200,4600]);

const geoPath = d3.geoPath().projection(aProjection);
const geojson = topojson.feature(portugaljson, portugaljson.objects.PRT_adm1);

var colors = d3 
  .scaleThreshold<number, string>()
  .domain([1, 10, 20, 30, 60, 100, 200, 300, 400, 500, 600, 800, 900, 1234])
  .range(["#edf7c0", "#e4f5b0", "#daf4a1", "#cef393", "#c0f285", "#b2ec79", "#a3e76d", "#93e162", "#80d555", "#6dc848", "#59bc3b", "#43b02e"]);

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", 1024)
  .attr("height", 800)
  .attr("style", "background-color: #FBFAF0");

const modifyMap = (data: ResultEntry[]) => {  
   const maxAffected = data.reduce(
    (max, item) => (item.value > max ? item.value : max), 0); 

  const affectedRadiusScale = d3
    .scaleLinear()
    .domain([0, maxAffected])
    .clamp(true)
    .range([5, 20]); 

  const calculateRadiusBasedOnAffectedCases = (comunidad: string) => {
    const entry = data.find(item => item.name === comunidad);
    return entry ? affectedRadiusScale(entry.value) : 0
  };  
  
  const getColorByAffectedCases = (name: string) => {
    const item = data.find(
      item => item.name == name
    );
    return  item ? colors(item.value) : colors(0);
  }

  svg
    .selectAll("path")
    .data(geojson["features"])
    .enter()
    .append("path")
    .attr("class", "country")
    .style("fill", (d) => getColorByAffectedCases(d["properties"]["NAME_1"]))
    .attr("d", geoPath as any)
    .merge(svg.selectAll("path") as any)
    .transition()
    .duration(400)
    .attr("d", geoPath as any)
    .style("fill", (d) => getColorByAffectedCases(d["properties"]["NAME_1"]));
      
  const circles = svg.selectAll("circle")
  circles
    .data(latLongCommunities)
    .enter()
    .append("circle")
    .attr("class", "affected-marker")
    .style("r", function(d) {
      return calculateRadiusBasedOnAffectedCases(d.name)
    })
    .attr("cx", d => aProjection([d.long, d.lat])[0])
    .attr("cy", d => aProjection([d.long, d.lat])[1])
    .merge(circles as any)  
    .transition()
    .duration(400)
    .style("r", function(d) {
      return calculateRadiusBasedOnAffectedCases(d.name)
    });    
};

document
  .getElementById("initial")
  .addEventListener("click", function handleInitialResults(){
    modifyMap(initial_stats)
  });

document
  .getElementById("final")
  .addEventListener("click", function handleCurrentResults(){
    modifyMap(final_stats)
  });

modifyMap(initial_stats)