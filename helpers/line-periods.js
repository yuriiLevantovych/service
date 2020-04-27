const moment = require('moment');

/**
 * Get Daily Data data for request;
 */

const getDailyData = () => {
  const startDate = moment().hours(0).minute(0);
  const endDate = moment().hours(23).minute(59);
  const pastDays = [{
    startDate: startDate.valueOf(),
    endDate: endDate.valueOf(),
  }];
  const dateLabels = [endDate.format('MMM') + ' ' + endDate.format('DD')].reverse();
  return {
    pastDays,
    dateLabels,
  };

};

/**
 * Get Weekly Data data for request;
 */

const getWeeklyData = () => {
  const pastDays = [];
  const dateLabels = [];
  const startDate = moment().subtract(7, 'days').hours(0).minute(0);
  const endDate = moment().hours(23).minute(59);
  const dayLength = endDate.diff(startDate, 'days');

  for (let i = 0; i < dayLength; i++) {
    let iterEndDate = endDate;
    let iterStartDate = iterEndDate.clone().hours(0).minute(0);
    pastDays.push({
      startDate: iterStartDate.valueOf(),
      endDate: iterEndDate.valueOf(),
    });
    dateLabels.push(iterEndDate.format('MMM') + ' ' + iterEndDate.format('DD'));
    iterEndDate = iterEndDate.subtract(1, 'days').hours(23).minutes(59);
  }
  return {
    pastDays,
    dateLabels: dateLabels.reverse(),
  };
};
/**
 * Get Monthly Data data for request;
 */

const getMonthlyData = () => {
  const pastDays = [];
  const dateLabels = [];
  const startDate = moment().subtract(30, 'days').hours(0).minute(0);
  const endDate = moment().hours(23).minute(59);
  const dayLength = endDate.diff(startDate, 'days');

  for (let i = 0; i < dayLength; i++) {
    let iterEndDate = endDate;
    let iterStartDate = iterEndDate.clone().hours(0).minute(0);

    if ((i + 1) % 6 == 0 || i == 0) {
      pastDays.push({
        startDate: iterStartDate.valueOf(),
        endDate: iterEndDate.valueOf(),
      });
      dateLabels.push(iterEndDate.format('MMM') + ' ' + iterEndDate.format('DD'));
    }
    iterEndDate = iterEndDate.subtract(1, 'days').hours(23).minutes(59);
  }

  return {
    pastDays,
    dateLabels: dateLabels.reverse(),
  };
};

exports.getDailyData = getDailyData;
exports.getWeeklyData = getWeeklyData;
exports.getMonthlyData = getMonthlyData;

