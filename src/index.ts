import * as d3 from 'd3';
import { vec2 } from 'gl-matrix';
import { Log as Logger } from './log/log';
import { sigmoidFunc } from './math/activation-functions';
import { Vector } from './math/vector';
import { HiddenLayer } from './network/hidden-layer';
import { InputLayer } from './network/input-layer';
import { Layer, NeuronInfo } from './network/layer';
import { Link } from './network/link';
import { Network } from './network/network';
import { Neuron } from './network/neuron';

// --------------------------------------------------------------------------------

const info: NeuronInfo[] = [
  {color: "rgb(61, 209, 189)", neuron: new Neuron(1, vec2.fromValues(50, 100))},
  {color: "rgb(61, 209, 189)", neuron: new Neuron(2, vec2.fromValues(50, 250))},
  {color: "rgb(61, 209, 189)", neuron: new Neuron(3, vec2.fromValues(50, 400))},

  {color: "rgb(61, 209, 189)", neuron: new Neuron(4, vec2.fromValues(350, 100)), incomingLink: [new Link(1, 0.9), new Link(2, 0.3), new Link(3, 0.4)]},
  {color: "rgb(61, 209, 189)", neuron: new Neuron(5, vec2.fromValues(350, 250)), incomingLink: [new Link(1, 0.2), new Link(2, 0.8), new Link(3, 0.2)]},
  {color: "rgb(61, 209, 189)", neuron: new Neuron(6, vec2.fromValues(350, 400)), incomingLink: [new Link(1, 0.1), new Link(2, 0.5), new Link(3, 0.6)]},
 
  {color: "rgb(191, 99, 174)", neuron: new Neuron(7, vec2.fromValues(650, 100)), incomingLink: [new Link(4, 0.3), new Link(5, 0.7), new Link(6, 0.5)]},
  {color: "rgb(191, 99, 174)", neuron: new Neuron(8, vec2.fromValues(650, 250)), incomingLink: [new Link(4, 0.6), new Link(5, 0.5), new Link(6, 0.2)]},
  {color: "rgb(191, 99, 174)", neuron: new Neuron(9, vec2.fromValues(650, 400)), incomingLink: [new Link(4, 0.8), new Link(5, 0.1), new Link(6, 0.9)]},
];

// --------------------------------------------------------------------------------

const logger: Logger = new Logger();

const layers: Layer[] = [
  new InputLayer([info[0], info[1], info[2]]),
  new HiddenLayer([info[3], info[4], info[5]], sigmoidFunc),
  new HiddenLayer([info[6], info[7], info[8]], sigmoidFunc),
];

const network: Network = new Network(layers);

const input: Vector = new Vector(3);
input.setValue(0, 0.9);
input.setValue(1, 0.1);
input.setValue(2, 0.8);

const output: Vector = new Vector(3);
output.setValue(0, 0.726);
output.setValue(1, 0.708);
output.setValue(2, 0.778);

network.calculate(input, output);
logger.log(result);

// --------------------------------------------------------------------------------

const width: number = 1000;
const height: number = 1000;

const svg = d3.select('#network')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

network.draw(svg);




// Create a clipping path for the box
svg.append('clipPath')
  .attr('id', 'clip-box')
  .append('rect')
  .attr('x', 50)
  .attr('y', 50)
  .attr('width', 400)
  .attr('height', 200);

// Create a group that will hold the text, and apply the clip-path
const textGroup = svg.append('g')
  .attr('clip-path', 'url(#clip-box)')
  .attr('transform', `translate(0, 0)`);  // Start with no transform

// Create a box (rectangle)
const boxWidth = 400;
const boxHeight = 200;
const boxX = 50;
const boxY = 50;

svg.append('rect')
  .attr('x', boxX)
  .attr('y', boxY)
  .attr('width', boxWidth)
  .attr('height', boxHeight)
  .attr('fill', '#f3f3f3')
  .attr('stroke', '#000');

// Set up logs data
let logs: string[] = [
  'Log 1: Initialized application',
  'Log 2: Fetched data from API',
  'Log 3: Rendered components',
  'Log 4: User clicked button',
];

const textPadding = 10;
const lineHeight = 20;

// Function to render logs with scrolling if needed
function renderLogs() {
  const textSelection = textGroup.selectAll<SVGTextElement, string>('text')
    .data(logs);

  // Remove old logs
  textSelection.exit().remove();

  // Add new logs
  textSelection.enter()
    .append('text')
    .merge(textSelection)
    .attr('x', boxX + textPadding)
    .attr('y', (d, i) => textPadding + (i * lineHeight)) // Adjust 'y' position for each log
    .attr('font-size', '14px')
    .attr('fill', '#333')
    .text(d => d);

  // Calculate the height of the logs and adjust the position if necessary
  const totalHeight = logs.length * lineHeight;
  if (totalHeight > boxHeight) {
    const offset = boxHeight - totalHeight;
    textGroup.attr('transform', `translate(0, ${offset})`);
  } else {
    textGroup.attr('transform', `translate(${boxX}, ${boxY})`);
  }
}

// Initial render
renderLogs();

// Function to add new logs and scroll if necessary
function addLog(newLog: string) {
  logs.push(newLog);
  renderLogs();
}

// Example: Add new logs every 2 seconds
setInterval(() => addLog(`Log ${logs.length + 1}: New log added`), 100);

