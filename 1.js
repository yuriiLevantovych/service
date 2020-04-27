const { JSDOM } = require('jsdom');
const fs = require('fs');

const defaultFillMapConstant = '#F5F5F5';
// const yOffset = 37;

const isoCountryCodes = [
    'AFG',
    'ALA',
    'ALB',
    'DZA',
    'ASM',
    'AND',
    'AGO',
    'AIA',
    'ATA',
    'ATG',
    'ARG',
    'ARM',
    'ABW',
    'AUS',
    'AUT',
    'AZE',
    'BHS',
    'BHR',
    'BGD',
    'BRB',
    'BLR',
    'BEL',
    'BLZ',
    'BEN',
    'BMU',
    'BTN',
    'BOL',
    'BIH',
    'BWA',
    'BVT',
    'BRA',
    'IOT',
    'BRN',
    'BGR',
    'BFA',
    'BDI',
    'KHM',
    'CMR',
    'CAN',
    'CPV',
    'CYM',
    'CAF',
    'TCD',
    'CHL',
    'CHN',
    'CXR',
    'CCK',
    'COL',
    'COM',
    'COG',
    'COD',
    'COK',
    'CRI',
    'CIV',
    'HRV',
    'CUB',
    'CYP',
    'CZE',
    'DNK',
    'DJI',
    'DMA',
    'DOM',
    'ECU',
    'EGY',
    'SLV',
    'GNQ',
    'ERI',
    'EST',
    'ETH',
    'FLK',
    'FRO',
    'FJI',
    'FIN',
    'FRA',
    'GUF',
    'PYF',
    'ATF',
    'GAB',
    'GMB',
    'GEO',
    'DEU',
    'GHA',
    'GIB',
    'GRC',
    'GRL',
    'GRD',
    'GLP',
    'GUM',
    'GTM',
    'GGY',
    'GIN',
    'GNB',
    'GUY',
    'HTI',
    'HMD',
    'VAT',
    'HND',
    'HKG',
    'HUN',
    'ISL',
    'IND',
    'IDN',
    'IRN',
    'IRQ',
    'IRL',
    'IMN',
    'ISR',
    'ITA',
    'JAM',
    'JPN',
    'JEY',
    'JOR',
    'KAZ',
    'KEN',
    'KIR',
    'KOR',
    'KWT',
    'KGZ',
    'LAO',
    'LVA',
    'LBN',
    'LSO',
    'LBR',
    'LBY',
    'LIE',
    'LTU',
    'LUX',
    'MAC',
    'MKD',
    'MDG',
    'MWI',
    'MYS',
    'MDV',
    'MLI',
    'MLT',
    'MHL',
    'MTQ',
    'MRT',
    'MUS',
    'MYT',
    'MEX',
    'FSM',
    'MDA',
    'MCO',
    'MNG',
    'MNE',
    'MSR',
    'MAR',
    'MOZ',
    'MMR',
    'NAM',
    'NRU',
    'NPL',
    'NLD',
    'ANT',
    'NCL',
    'NZL',
    'NIC',
    'NER',
    'NGA',
    'NIU',
    'NFK',
    'MNP',
    'NOR',
    'OMN',
    'PAK',
    'PLW',
    'PSE',
    'PAN',
    'PNG',
    'PRY',
    'PER',
    'PHL',
    'PCN',
    'POL',
    'PRT',
    'PRI',
    'QAT',
    'REU',
    'ROU',
    'RUS',
    'RWA',
    'BLM',
    'SHN',
    'KNA',
    'LCA',
    'MAF',
    'SPM',
    'VCT',
    'WSM',
    'SMR',
    'STP',
    'SAU',
    'SEN',
    'SRB',
    'SYC',
    'SLE',
    'SGP',
    'SVK',
    'SVN',
    'SLB',
    'SOM',
    'ZAF',
    'SGS',
    'ESP',
    'LKA',
    'SDN',
    'SUR',
    'SJM',
    'SWZ',
    'SWE',
    'CHE',
    'SYR',
    'TWN',
    'TJK',
    'TZA',
    'THA',
    'TLS',
    'TGO',
    'TKL',
    'TON',
    'TTO',
    'TUN',
    'TUR',
    'TKM',
    'TCA',
    'TUV',
    'UGA',
    'UKR',
    'ARE',
    'GBR',
    'USA',
    'UMI',
    'URY',
    'UZB',
    'VUT',
    'VEN',
    'VNM',
    'VGB',
    'VIR',
    'WLF',
    'ESH',
    'YEM',
    'ZMB',
    'ZWE'
];

const countryDefaultColorsConstant = {};
isoCountryCodes.forEach(isoCode => {
    countryDefaultColorsConstant[ isoCode ] = {
        fillColor: defaultFillMapConstant
    };
});

const dom = new JSDOM(
  `<html><body>
<script defer src="https://www.dropbox.com/s/9wslbk8lhmgf5z9/d3.v3.js"></script>
<script defer src="https://unpkg.com/topojson@3"></script>
<script defer src="https://raw.githubusercontent.com/markmarkoh/datamaps/master/dist/datamaps.world.js"></script>
<div id="svgContainer"></div>
</body></html>`, {
    includeNodeLocations: true,
    runScripts: 'dangerously',
    resources: 'usable',
    pretendToBeVisual: true
  });

const window = dom.window;

let d3;
let Datamap;
window.document.addEventListener('DOMContentLoaded', () => {
    d3 = window.d3;
    Datamap = window.Datamap;
    console.log(Datamap);
    const svgContainer = d3.select("#svgContainer");
    // var svg = d3.select("#svgContainer")
    //   .append("svg")
    //   .attr("width", 100)
    //   .attr("height", 100)
    //   .attr("xmlns", "http://www.w3.org/2000/svg");
    //
    // svg.append("rect")
    //   .attr("x", 10)
    //   .attr("y", 10)
    //   .attr("width", 80)
    //   .attr("height", 80)
    //   .style("fill", "orange");

    const data = [{
        country: 'UKR',
        value: 1000
    }, {
        country: 'POL',
        value: 100
    }];

    const mappedData = datasetConverter(data);

    const datamap = initializeMap(svgContainer, mappedData);
    datamap.updateChoropleth(countryDefaultColorsConstant, { reset: true });
    datamap.updateChoropleth(mappedData, { reset: true });

    fs.writeFileSync('out.svg', d3.select("#svgContainer").html());
});

function initializeMap(element, data) {
    return new Datamap({
        fills: { defaultFill: defaultFillMapConstant },
        // setProjection: function (element) {
        //     const projection = d3.geo.mercator()
        //       .center([ 0, yOffset ])
        //       .scale(element.offsetWidth / 6.3)
        //       .translate([ element.offsetWidth / 2, element.offsetHeight / 2 ]);
        //     const path = d3.geo.path()
        //       .projection(projection);
        //
        //     return { path: path, projection: projection };
        // },
        geographyConfig: {
            borderColor: '#dedede',
            highlightBorderWidth: 1,
        },
        element,
        data
    });
}

function paletteScale(countriesData) {
    const onlyValues = countriesData.map(countryData => countryData.numberOfThings);
    const minValue = 0;
    const maxValue = Math.max.apply(null, onlyValues);

    return d3.scale
      .linear()
      .domain([ minValue, maxValue ])
      // @ts-ignore
      .range([ '#f8f4ff', '#685094' ]);
}

function datasetConverter(countriesData) {
    const dataset = {};
    const getColorByValue = paletteScale(countriesData);

    countriesData.forEach(countryData => {
        const value = countryData.numberOfThings;

        dataset[countryData.country] = {
            numberOfThings: value,
            fillColor: getColorByValue(countryData.value)
        };
    });

    return dataset;
}
