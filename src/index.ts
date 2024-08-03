import * as d3 from 'd3';
import { vec2 } from 'gl-matrix';
import { sigmoidFunc } from './math/activation-functions';
import { Layer, Neuron, NeuronInfo } from './network/layer';
import { Network } from './network/network';

// --------------------------------------------------------------------------------

const info: NeuronInfo[] = [
  {color: "rgb(61, 209, 189)", neuron: { id: 1, pos: vec2.fromValues(50, 100) }, links: [{ targetId: 3 }, { targetId: 4 }, { targetId: 5 }]},
  {color: "rgb(61, 209, 189)", neuron: { id: 2, pos: vec2.fromValues(50, 300) }, links: [{ targetId: 3 }, { targetId: 4 }, { targetId: 5 }]},

  {color: "rgba(129, 137, 219)", neuron: { id: 3, pos: vec2.fromValues(250, 50) }, links: [{ targetId: 6 }, { targetId: 7 }, { targetId: 8 }]},
  {color: "rgba(129, 137, 219)", neuron: { id: 4, pos: vec2.fromValues(250, 200) }, links: [{ targetId: 6 }, { targetId: 7 }, { targetId: 8 }]},
  {color: "rgba(129, 137, 219)", neuron: { id: 5, pos: vec2.fromValues(250, 350) }, links: [{ targetId: 6 }, { targetId: 7 }, { targetId: 8 }]},

  {color: "rgba(129, 137, 219)", neuron: { id: 6, pos: vec2.fromValues(450, 50) }, links: [{ targetId: 9 }, { targetId: 10 }]},
  {color: "rgba(129, 137, 219)", neuron: { id: 7, pos: vec2.fromValues(450, 200) }, links: [{ targetId: 9 }, { targetId: 10 }]},
  {color: "rgba(129, 137, 219)", neuron: { id: 8, pos: vec2.fromValues(450, 350) }, links: [{ targetId: 9 }, { targetId: 10 }]},

  {color: "rgb(191, 99, 174)", neuron: { id: 9, pos: vec2.fromValues(650, 100) }},
  {color: "rgb(191, 99, 174)", neuron: { id: 10, pos: vec2.fromValues(650, 300) }},
];

const layers: Layer[] = [
  new Layer([info[0], info[1]], sigmoidFunc),
  new Layer([info[2], info[3]], sigmoidFunc),
  new Layer([info[4], info[5]]),
];

const network: Network = new Network(layers);

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
  .data(info.flatMap(i => i.links ? i.links.map(link => ({ source: i.neuron.id, target: link.targetId, weight: link.weight ?? 0})) : []))
  .enter().append('line')
  .attr('class', 'link')
  .attr('x1', link => getNodeById(link!.source).pos[0])
  .attr('y1', link => getNodeById(link!.source).pos[1])
  .attr('x2', link => getNodeById(link!.target).pos[0])
  .attr('y2', link => getNodeById(link!.target).pos[1])
  .attr('stroke', 'black');

  // Draw the arrowheads at the midpoint of the lines
const arrowheads = svg.selectAll('.arrowhead')
.data(info.flatMap(i => i.links ? i.links.map(link => ({ source: i.neuron.id, target: link.targetId, weight: link.weight ?? 0})) : []))
.enter().append('line')
  .attr('class', 'arrowhead')
  .attr('x1', link => {
    const sourcePos = getNodeById(link.source).pos;
    const targetPos = getNodeById(link.target).pos;
    return sourcePos[0] + 2 * (targetPos[0] - sourcePos[0]) / 3;
  })
  .attr('y1', link => {
    const sourcePos = getNodeById(link.source).pos;
    const targetPos = getNodeById(link.target).pos;
    return sourcePos[1] + 2 * (targetPos[1] - sourcePos[1]) / 3;
  })
  .attr('x2', link => {
    const sourcePos = getNodeById(link.source).pos;
    const targetPos = getNodeById(link.target).pos;
    return sourcePos[0] + 2 * (targetPos[0] - sourcePos[0]) / 3 + (targetPos[0] - sourcePos[0]) / 30; // Small offset to show the arrowhead
  })
  .attr('y2', link => {
    const sourcePos = getNodeById(link.source).pos;
    const targetPos = getNodeById(link.target).pos;
    return sourcePos[1] + 2 * (targetPos[1] - sourcePos[1]) / 3 + (targetPos[1] - sourcePos[1]) / 30; // Small offset to show the arrowhead
  })
  .attr('stroke', 'black')
  .attr('marker-end', 'url(#arrowhead)');

  // Draw the weights at the first third of the links
const linkGroups = svg.selectAll('.link-group')
.data(info.flatMap(i => i.links ? i.links.map(link => ({ source: i.neuron.id, target: link.targetId, weight: link.weight ?? 0})) : []))
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
  .text(info => info.neuron.value ?? 0);