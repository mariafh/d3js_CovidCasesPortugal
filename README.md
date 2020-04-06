# COVID-19 in Portugal:
# Including background color depending on affected number of cases.

 - Circles are placed in every region with   
people affected by COVID-19. 
 - Scale pin radius is based on affected number.
 - Background color of communities is based on affected number.


![Map](/content/mapPortugal.png)

This code is based on:

- Lemoncode / d3js-typescript-examples  
[https://github.com/Lemoncode/d3js-typescript-examples/tree/master/02-maps/02-pin-location-scale](https://github.com/Lemoncode/d3js-typescript-examples/tree/master/02-maps/02-pin-location-scale)
- mariafh / d3js_Visualization_Advanced 
https://github.com/mariafh/d3js_Visualization_Advanced

# Steps

## Installation and Running

- Execute _npm install_.
```bash
npm install
```
- Execute _npm start_.
```bash
npm start
```
## Coding

- Adding location information about every portuguese region

_.src/communities.ts_
 ```typescript
export const latLongCommunities: ResultEntry[] = [
  {
    name: "Faro",
    long:  -8.046949,
    lat: 37.209786
  },
  {
    name: "Beja",
    long: -8.000682,
    lat: 37.613634
  },
  {
    name: "Setúbal",
    long: -8.892425,
    lat: 38.621096
  },
  {
    name: "Évora",
    long: -7.930823,
    lat: 38.552008
  },
  {
    name: "Portalegre",
    long: -7.696132,
    lat: 39.17046
  },
  {
    name: "Lisboa",
    long: -9.193706,
    lat: 38.8559
  },
  {
    name: "Santárem",
    long: -8.52333,
    lat: 39.2108
  },
  {
    name: "Leiria",
    long: -8.82333,
    lat: 39.81108
  },
  {
    name: "Coimbra",
    long: -8.41112,
    lat: 40.17662
  },
  {
    name: "Castelo Branco",
    long: -7.48621,
    lat: 39.79508
  },
  {
    name: "Aveiro",
    long: -8.624671,
    lat: 40.631161
  },
  {
    name: "Viseu",
    long: -7.910200,
    lat: 40.653333
  },
  {
    name: "Guarda",
    long: -7.170033,
    lat: 40.520011
  },
  {
    name: "Porto",
    long: -8.513808,
    lat: 41.162292
  },
  {
    name: "Vila Real",
    long: -7.698067,
    lat: 41.342586
  },
  {
    name: "Bragança",
    long: -6.773703,
    lat: 41.515160
  },  
  {
    name: "Braga",
    long: -8.443703,
    lat: 41.515010
  },
  {
    name: "Viana do Castelo",
    long: -8.545416,
    lat: 41.861750
  }
];
 ```
- Adding stats infomation about covid cases in a base date and currently

_.src/stats.ts_
```typescript
export const initial_stats : ResultEntry[] =[  
  {
    name: "Faro",
    value: 30
  },
  {
    name: "Beja",
    value: 50
  },
  {
    name: "Setúbal",
    value: 54
  },
  {
    name: "Évora",
    value: 8
  },
  {
    name: "Portalegre",
    value: 7
  },
  {
    name: "Lisboa",
    value: 150
  },
  {
    name: "Santarem",
    value: 7
  },
  {
    name: "Leiria",
    value: 26
  },
  {
    name: "Coimbra",
    value: 80
  },
  {
    name: "Castelo Branco",
    value: 12
  },
  {
    name: "Aveiro",
    value: 10
  },
  {
    name: "Viseu",
    value: 18
  },
  {
    name: "Guarda",
    value: 32
  },
  {
    name: "Porto",
    value: 40
  },
  {
    name: "Vila Real",
    value: 24
  },
  {
    name: "Bragança",
    value: 10
  },
  {
    name: "Braga",
    value: 13
  },
  {
    name: "Viana do Castelo",
    value: 13
  }
];
export const final_stats : ResultEntry[] =[
  {
    name: "Faro",
    value: 229
  },
  {
    name: "Beja",
    value: 84
  },
  {
    name: "Setúbal",
    value: 154
  },
  {
    name: "Évora",
    value: 40
  },
  {
    name: "Portalegre",
    value: 12
  },
  {
    name: "Lisboa",
    value: 1234
  },
  {
    name: "Santarem",
    value: 45
  },
  {
    name: "Leiria",
    value: 326
  },
  {
    name: "Coimbra",
    value: 268
  },
  {
    name: "Castelo Branco",
    value: 34
  },
  {
    name: "Aveiro",
    value: 140
  },
  {
    name: "Viseu",
    value: 118
  },
  {
    name: "Guarda",
    value: 32
  },
  {
    name: "Porto",
    value: 700
  },
  {
    name: "Vila Real",
    value: 127
  },
  {
    name: "Bragança",
    value: 110
  },
  {
    name: "Braga",
    value: 379
  },
  {
    name: "Viana do Castelo",
    value: 54
  }
];
```

- Creating a scaleThreshold of colors depending on affected cases (domain)

_.src/index.ts_
 ```typescript
var colors = d3 
  .scaleThreshold<number, string>()
  .domain([1, 10, 20, 30, 60, 100, 200, 300, 400, 500, 600, 800, 900, 1234])
  .range(["#edf7c0", "#e4f5b0", "#daf4a1", "#cef393", "#c0f285", "#b2ec79", "#a3e76d", "#93e162", "#80d555", "#6dc848", "#59bc3b", "#43b02e"]);
 ```


- Importing topojson file git Portugal geometry (portugal.json) and center and scale it in the frame

_.src/index.ts_
 ```typescript
const portugaljson = require("./portugal.json");
[...]
// Scaling an center
const aProjection = d3
  .geoMercator()
  // Let's make the map bigger to fit in our resolution
  .scale(5600)
  // Let's center the map
  .translate([1200,4600]);

const geoPath = d3.geoPath().projection(aProjection);
const geojson = topojson.feature(portugaljson, portugaljson.objects.PRT_adm1);
 ```
