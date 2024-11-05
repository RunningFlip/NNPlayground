import * as d3 from 'd3';
import { vec2 } from 'gl-matrix';
import { Log as Logger } from './log/log';
import { sigmoidFunc } from './math/activation-functions';
import { Vector } from './math/vector';
import { HiddenLayer } from './network/hidden-layer';
import { InputLayer } from './network/input-layer';
import { Layer, NeuronInfo } from './network/layer';
import { Link } from './network/link';
import { Network, NetworkResult } from './network/network';
import { Neuron } from './network/neuron';

// --------------------------------------------------------------------------------

const offsetX: number = 50;
const offsetY: number = 250;

const n0: Neuron = new Neuron(vec2.fromValues(50 + offsetX, 100 + offsetY));
const n1: Neuron = new Neuron(vec2.fromValues(50 + offsetX, 250 + offsetY));
const n2: Neuron = new Neuron(vec2.fromValues(50 + offsetX, 400 + offsetY));

const n3: Neuron = new Neuron(vec2.fromValues(350 + offsetX, 100 + offsetY));
const n4: Neuron = new Neuron(vec2.fromValues(350 + offsetX, 250 + offsetY));
const n5: Neuron = new Neuron(vec2.fromValues(350 + offsetX, 400 + offsetY));

const n6: Neuron = new Neuron(vec2.fromValues(650 + offsetX, 100 + offsetY));
const n7: Neuron = new Neuron(vec2.fromValues(650 + offsetX, 250 + offsetY));
const n8: Neuron = new Neuron(vec2.fromValues(650 + offsetX, 400 + offsetY));

// --------------------------------------------------------------------------------

const info: NeuronInfo[] = [
  {color: "rgb(61, 209, 189)", neuron: n0},
  {color: "rgb(61, 209, 189)", neuron: n1},
  {color: "rgb(61, 209, 189)", neuron: n2},

  {color: "rgb(61, 209, 189)", neuron: n3, incomingLink: [new Link(n0, 0.9), new Link(n1, 0.3), new Link(n2, 0.4)]},
  {color: "rgb(61, 209, 189)", neuron: n4, incomingLink: [new Link(n0, 0.2), new Link(n1, 0.8), new Link(n2, 0.2)]},
  {color: "rgb(61, 209, 189)", neuron: n5, incomingLink: [new Link(n0, 0.1), new Link(n1, 0.5), new Link(n2, 0.6)]},
 
  {color: "rgb(191, 99, 174)", neuron: n6, incomingLink: [new Link(n3, 0.3), new Link(n4, 0.7), new Link(n5, 0.5)]},
  {color: "rgb(191, 99, 174)", neuron: n7, incomingLink: [new Link(n3, 0.6), new Link(n4, 0.5), new Link(n5, 0.2)]},
  {color: "rgb(191, 99, 174)", neuron: n8, incomingLink: [new Link(n3, 0.8), new Link(n4, 0.1), new Link(n5, 0.9)]},
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

const result: NetworkResult = network.calculate(input, output);
logger.log(result);

// --------------------------------------------------------------------------------

const width: number = 1000;
const height: number = 1000;

const svg = d3.select('#network')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

network.draw(svg);

// --------------------------------------------------------------------------------


logger.draw(svg);