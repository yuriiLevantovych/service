// const { CanvasRenderService } = require('chartjs-node-canvas');
const { GraphTypes } = require('../data/constans');
const { createCanvas } = require('canvas');
const { Chart } = require('chart.js');
const fs = require('fs');

/**
 * Render to a buffer.
 */

const renderToBuffer = (configuration, width, height, mimeType = 'image/png') => {
  const chart = renderChart(configuration, width, height);
  return new Promise((resolve, reject) => {
    if (!chart.canvas) {
      throw new Error('Canvas is null');
    }
    const canvas = chart.canvas;
    canvas.toBuffer((error, buffer) => {
      chart.destroy();
      if (error) {
        return reject(error);
      }
      return resolve(buffer);
    }, mimeType);
  });
};

/**
 * Render Chart
 */

const renderChart = (configuration, width, height) => {
  const canvas = createCanvas(width, height);
  canvas.style = {};
  const context = canvas.getContext('2d');
  configuration.data.datasets[0].borderColor = generateLinerGradient(context);
  Chart.defaults.global.defaultFontFamily = 'VTKS UNAMOUR';
  return new Chart(context, configuration);
};

/**
 * Generate Liner Gradient
 */

const generateLinerGradient = (context) => {
  const gradientStroke = context.createLinearGradient(500, 0, 100, 0);
  const _stroke = context.stroke;
  gradientStroke.addColorStop(0, '#b682fc');
  gradientStroke.addColorStop(1, '#ffaebf');
  context.stroke = function() {
    context.save();
    context.shadowColor = '#979797';
    context.shadowBlur = 14;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    _stroke.apply(this, arguments);
    context.restore();
  };
  return gradientStroke;
};
/**
 * Generate and write line graph image
 */
const buildAndWriteLineGraph = async (data, labels, { width, height, output, type }) => {
  const stepSize = type === GraphTypes.CONVERSIONS ? 10 : 20;
  const suggestedMin = 0;
  const configuration = {
    type: 'line',
    data: {
      datasets: [{
        label: 'First dataset',
        data,
        borderColor: '#80b6f4',
        pointBackgroundColor: '#80b6f4',
        backgroundColor: 'transparent',
        pointBorderWidth: 2,
        borderWidth: 4,
        pointRadius: 0,
        fill: false,
      }],
      labels,
    },
    options: {
      responsive: false,
      animation: false,
      aspectRatio: 3,
      legend: {
        display: false,
        labels: {
          fontColor: '#000000',
        },
      },
      layout: {
        padding: {
          top: 20,
        },
      },
      scales: {
        xAxes: [{
          gridLines: {
            color: '#000000',
            drawOnChartArea: false,
            tickMarkLength: 0,
          },
          ticks: {
            padding: 15,
            fontColor: '#000000',
            fontSize: 14,
          },
        }],
        yAxes: [{
          gridLines: {
            color: '#000000',
            drawOnChartArea: false,
            tickMarkLength: 0,
          },
          ticks: {
            stepSize,
            padding: 15,
            suggestedMin,
            fontColor: '#000000',
            fontSize: 14,
          },
        }],
      },
    },
  };

  const image = await renderToBuffer(configuration, width, height);

  fs.writeFileSync(output || 'report.png', image);
};

exports.buildAndWriteLineGraph = buildAndWriteLineGraph;
