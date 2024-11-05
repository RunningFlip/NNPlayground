import { Neuron } from "./neuron";

// --------------------------------------------------------------------------------

export class Link {

    public readonly id: string;
    public weight: number;

    constructor(neuron: Neuron, weight?: number) {
        this.id = neuron.id;
        this.weight = weight ?? Math.random();
    }
}