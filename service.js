const axios = require('axios');
const { buildAndWriteLineGraph } = require('./charts/line');
const { buildAndWriteMapGraph } = require('./charts/map');
const { getDailyData, getWeeklyData, getMonthlyData } = require('./helpers/line-periods');
const { GraphPeriods, GraphTypes } = require('./data/constans');

// Parse console configuration
let config = {};
process.argv.forEach(function(val) {
  const item = val.split('=');
  config[item[0]] = item[1] || '';
});

config.width = Number(config.width) || 730;
config.height = Number(config.height) || 243;

/**
 * Generate data for request;
 */

const getDataForRequest = (period, type, userId) => {
  let pastDays, dateLabels;
  switch (period || 'weekly') {
    case GraphPeriods.DAILY:
      ({ pastDays, dateLabels } = getDailyData());
      break;
    case GraphPeriods.WEEKLY:
      ({ pastDays, dateLabels } = getWeeklyData());
      break;
    case GraphPeriods.MONTHLY:
      ({ pastDays, dateLabels } = getMonthlyData());
      break;
  }

  switch (type) {
    case GraphTypes.CONVERSIONS:
      return {
        body: {
          customerId: userId,
          uniqueConversionsGraph: pastDays,
        },
        dateLabels,
      };
    case GraphTypes.VISITORS:
      return {
        body: {
          customerId: userId,
          uniqueVisitorsGraph: pastDays,
        },
        dateLabels,
      };
  }

};

/**
 * Get data for Liner graphs
 */

const fetchDataFoLinerGraph = () => {
  const { period, type, user_id } = config;
  const { body, dateLabels } = getDataForRequest(period, type, user_id);
  axios.post('https://prod.tracking.adline.com/stats', body)
    .then(function(response) {
      const { data } = response;
      switch (type) {
        case GraphTypes.CONVERSIONS:
          return buildAndWriteLineGraph(data.uniqueConversionsGraph, dateLabels, config);
        case GraphTypes.VISITORS:
          return buildAndWriteLineGraph(data.uniqueVisitorsGraph, dateLabels, config);
      }
    })
    .catch(function(error) {
      console.log(error);
    });
};


/**
 * Get data for Map graphs
 */


const fetchDataFoMapGraph = () => { // TODO
  const { user_id } = config;
  const url = 'https://stage2.adline.com?userId=' + user_id;
  return buildAndWriteMapGraph([{
    latitude: 59.856614,
    longitude: 18.352222,
  }, {
    latitude: 40.712775,
    longitude: -74.005973,
  }, {
    latitude: 49.282729,
    longitude: -123.120738,
  }], config);

  axios.get('https://stage2.adline.com?userId=' + user_id)
    .then(function(response) {
      const { data } = response;
      console.log(response);
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .finally(function() {
      // always executed
    });
};


/**
 * Build graph
 */

const buildGraph = () => {
  switch (config.type) {
    case GraphTypes.CONVERSIONS:
    case GraphTypes.VISITORS:
      return fetchDataFoLinerGraph();
    case GraphTypes.WORLD_MAP:
      return fetchDataFoMapGraph();
  }
};

buildGraph();
