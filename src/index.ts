import * as d3 from 'd3';
import { vec2 } from 'gl-matrix';
import { sigmoidFunc } from './math/activation-functions';
import { Vector } from './math/vector';
import { HiddenLayer } from './network/hidden-layer';
import { InputLayer } from './network/input-layer';
import { Layer, Link, Neuron, NeuronInfo } from './network/layer';
import { Network } from './network/network';

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

network.calculate(input);

// --------------------------------------------------------------------------------

function getNodeById(id: number): Neuron {
    return info[info.findIndex((n) => n.neuron.id === id)].neuron;
}

// --------------------------------------------------------------------------------

const radius: number = 20;
const width: number = 1000;
const height: number = 1000;

const svg = d3.select('#network')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

  // Define arrowhead marker
svg.append('defs').append('marker')
.attr('id', 'arrowhead')
.attr('viewBox', '0 -5 10 10')
.attr('refX', 5) // Center the arrowhead
.attr('refY', 0)
.attr('markerWidth', 6)
.attr('markerHeight', 6)
.attr('orient', 'auto')
.append('path')
.attr('d', 'M0,-5L10,0L0,5')
.attr('fill', 'black');

const link = svg.selectAll('.link')
  .data(info.flatMap(i => i.incomingLink ? i.incomingLink.map(previous => ({ source: previous.id, target: i.neuron.id, weight: previous.weight})) : []))
  .enter().append('line')
  .attr('class', 'link')
  .attr('x1', link => getNodeById(link!.source).pos[0])
  .attr('y1', link => getNodeById(link!.source).pos[1])
  .attr('x2', link => getNodeById(link!.target).pos[0])
  .attr('y2', link => getNodeById(link!.target).pos[1])
  .attr('stroke', 'black');

  // Draw the arrowheads at the midpoint of the lines
const arrowheads = svg.selectAll('.arrowhead')
.data(info.flatMap(i => i.incomingLink ? i.incomingLink.map(previous => ({ source: previous.id, target: i.neuron.id, weight: previous.weight})) : []))
.enter().append('line')
  .attr('class', 'arrowhead')
  .attr('x1', link => {
    const sourcePos = getNodeById(link.source).pos;
    const targetPos = getNodeById(link.target).pos;
    return sourcePos[0] + 5 * (targetPos[0] - sourcePos[0]) / 6;
  })
  .attr('y1', link => {
    const sourcePos = getNodeById(link.source).pos;
    const targetPos = getNodeById(link.target).pos;
    return sourcePos[1] + 5 * (targetPos[1] - sourcePos[1]) / 6;
  })
  .attr('x2', link => {
    const sourcePos = getNodeById(link.source).pos;
    const targetPos = getNodeById(link.target).pos;
    return sourcePos[0] + 5 * (targetPos[0] - sourcePos[0]) / 6 + (targetPos[0] - sourcePos[0]) / 60; // Small offset to show the arrowhead
  })
  .attr('y2', link => {
    const sourcePos = getNodeById(link.source).pos;
    const targetPos = getNodeById(link.target).pos;
    return sourcePos[1] + 5 * (targetPos[1] - sourcePos[1]) / 6 + (targetPos[1] - sourcePos[1]) / 60; // Small offset to show the arrowhead
  })
  .attr('stroke', 'black')
  .attr('marker-end', 'url(#arrowhead)');

  // Draw the weights at the first third of the links
const linkGroups = svg.selectAll('.link-group')
  .data(info.flatMap(i => i.incomingLink ? i.incomingLink.map(previous => ({ source: previous.id, target: i.neuron.id, weight: previous.weight})) : []))
  .enter().append('g')
  .attr('class', 'link-group')
  .attr('transform', link => {
    const sourcePos = getNodeById(link.source).pos;
    const targetPos = getNodeById(link.target).pos;
    const x = sourcePos[0] + (targetPos[0] - sourcePos[0]) / 4;
    const y = sourcePos[1] + (targetPos[1] - sourcePos[1]) / 4;
    return `translate(${x},${y})`;
});

// Draw background rectangles
linkGroups.append('rect')
  .attr('x', -15) // Adjust these values as needed to fit the text
  .attr('y', -7.5)
  .attr('width', 30)
  .attr('height', 15)
  .attr('fill', 'white')
  .attr('stroke', 'black');

// Draw the text on top of the rectangles
linkGroups.append('text')
  .attr('class', 'link-text')
  .attr('text-anchor', 'middle')
  .attr('dy', '0.35em') // Center the text vertically
  .text(link => link.weight.toFixed(2))
  .style('font-size', '10px') // Set the desired font size
  .style('font-weight', 'bold'); // Make the text bold


const node = svg.selectAll('.node')
  .data(info)
  .enter().append('circle')
  .attr('class', 'node')
  .attr('cx', info => info.neuron.pos[0])
  .attr('cy', info => info.neuron.pos[1])
  .attr('r', radius)
  .attr('fill', info => info.color)
  .attr('stroke', 'black');


const idText = svg.selectAll('.idText')
  .data(info)
  .enter().append('text')
  .attr('class', 'text')
  .attr('x', info => info.neuron.pos[0])
  .attr('y', info => info.neuron.pos[1] -5 - radius)
  .attr('text-anchor', 'middle')
  .text(info => info.neuron.id);


const valueText = svg.selectAll('.valueText')
  .data(info)
  .enter().append('text')
  .attr('class', 'text')
  .attr('x', info => info.neuron.pos[0])
  .attr('y', info => info.neuron.pos[1] + 5)
  .attr('text-anchor', 'middle')
  .text(info => info.neuron.value.toFixed(3));