import * as d3 from 'd3';
import { vec2 } from 'gl-matrix';
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

// --------------------------------------------------------------------------------

const width: number = 1000;
const height: number = 1000;

const svg = d3.select('#network')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

network.draw(svg);