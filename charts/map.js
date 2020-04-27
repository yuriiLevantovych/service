const fs = require('fs');
const { createCanvas } = require('canvas');
const d3 = require('d3');
const { JSDOM } = require('jsdom');
/**
 * Generate and write map graph image
 */
const buildAndWriteMapGraph = async (data, { width, height, output }) => {
  const image = null;
  generateJSDOM();
  fs.writeFileSync(output || 'test.png', image);
};

/**
 * Build jsdom
 */

function generateJSDOM() {
  const dom = new JSDOM(`<!DOCTYPE html><body>
    <script defer src="https://cdn.jsdelivr.net/npm/@marp-team/marpit-svg-polyfill/lib/polyfill.browser.js"></script>
    <script defer src="https://www.amcharts.com/lib/4/core.js"></script>
      <script defer src="https://www.amcharts.com/lib/4/maps.js"></script>
    <script defer src="https://www.amcharts.com/lib/4/geodata/worldLow.js"></script>
    <script defer src="https://www.amcharts.com/lib/4/geodata/data/countries2.js"></script>
    <script defer src="https://www.amcharts.com/lib/4/themes/animated.js"></script>
    <div width="800" height="500" id="chartdiv"></div>
</body>`, {
    includeNodeLocations: true,
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true
  });
  const window = dom.window;
  // window.requestAnimationFrame = function(callback) {
  //   setTimeout(callback, 0);
  // };
  // window.createSVGMatrix = function(callback) {
  //   setTimeout(callback, 0);
  // };
  // window.SVGPathElement = new Function();
  // window.createSVGMatrix = new Function();
  // window.SVGSVGElement.createSVGMatrix = new Function();

  window.document.addEventListener('DOMContentLoaded', () => {

    const am4core = window.am4core;
    const am4themes_animated = window.am4themes_animated;
    const am4maps = window.am4maps;
    const am4geodata_worldLow = window.am4geodata_worldLow;
    const am4geodata_data_countries2 = window.am4geodata_data_countries2;

    // setImmediate(() => {
      am4core.ready(() => {
        // Themes begin
        am4core.useTheme(am4themes_animated);
        // Themes end

        const continents = {
          'AF': 0,
          'AN': 1,
          'AS': 2,
          'EU': 3,
          'NA': 4,
          'OC': 5,
          'SA': 6,
        };
        // Create map instance
        const chart = am4core.create('chartdiv', am4maps.MapChart);
        chart.projection = new am4maps.projections.Miller();

        // Create map polygon series for world map
        const worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
        worldSeries.useGeodata = true;
        worldSeries.geodata = am4geodata_worldLow;
        worldSeries.exclude = ['AQ'];

        const worldPolygon = worldSeries.mapPolygons.template;
        worldPolygon.tooltipText = '{name}';
        worldPolygon.nonScalingStroke = true;
        worldPolygon.strokeOpacity = 0.5;
        worldPolygon.fill = am4core.color('#eee');
        worldPolygon.propertyFields.fill = 'color';

        // Create country specific series (but hide it for now)
        const countrySeries = chart.series.push(new am4maps.MapPolygonSeries());
        countrySeries.useGeodata = true;
        countrySeries.hide();
        countrySeries.geodataSource.events.on('done', function(ev) {
          worldSeries.hide();
          countrySeries.show();
        });
        const countryPolygon = countrySeries.mapPolygons.template;
        countryPolygon.tooltipText = '{name}';
        countryPolygon.nonScalingStroke = true;
        countryPolygon.strokeOpacity = 0.5;
        countryPolygon.fill = am4core.color('#eee');
        // Set up data for countries
        const data = [];
        for (const id in am4geodata_data_countries2) {
          if (am4geodata_data_countries2.hasOwnProperty(id)) {
            const country = am4geodata_data_countries2[id];
            if (country.maps.length) {
              data.push({
                id: id,
                color: chart.colors.getIndex(continents[country.continent_code]),
                map: country.maps[0],
              });
            }
          }
        }
        worldSeries.data = data;
      }); // end am4core.ready()

      console.log(window.document.body.innerHTML);

    });

  // });
};

exports.buildAndWriteMapGraph = buildAndWriteMapGraph;
