import { vec2 } from "gl-matrix";

// --------------------------------------------------------------------------------

const neurons: Neuron[] = [];

// --------------------------------------------------------------------------------

export function getNodeById(id: number): Neuron {
    return neurons[neurons.findIndex((n) => n.id === id)];
}

// --------------------------------------------------------------------------------

export class Neuron implements Disposable {

    public readonly id: number;
    public readonly pos: vec2;
    public value: number;

    constructor(id: number, pos: vec2) {

        this.id = id;
        this.pos = pos;
        this.value = 0;

        neurons.push(this);
    }

    [Symbol.dispose](): void {
        
        const index = neurons.indexOf(this, 0);

        if (index > -1) {
            neurons.splice(index, 1);
        }
    }
}