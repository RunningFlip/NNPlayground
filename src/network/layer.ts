import { vec2 } from "gl-matrix"
import { Vector } from "../math/vector"

// --------------------------------------------------------------------------------

export class Neuron {

    public readonly id: number;
    public readonly pos: vec2;
    public value: number;

    constructor(id: number, pos: vec2) {

        this.id = id;
        this.pos = pos;
        this.value = 0;
    }
}

// --------------------------------------------------------------------------------

export class Link {

    public readonly id: number;
    public readonly weight: number;

    constructor(id: number, weight?: number) {
        this.id = id;
        this.weight = weight ?? Math.random();
    }
}

// --------------------------------------------------------------------------------

export type NeuronInfo = {
    color: string,
    neuron: Neuron,
    incomingLink?: Link[]
}

// --------------------------------------------------------------------------------

export abstract class Layer {

    protected readonly info: NeuronInfo[];

    public get count() { return this.info.length; }

    constructor(info: NeuronInfo[]) {
        this.info = info;
    }

    public calculate(input: Vector): Vector {

        const result: Vector = this.calculateResult(input);

        for (let i = 0; i < this.info.length; i++) {
            this.info[i].neuron.value = result.getValue(i);
        }

        return result;
    }

    protected abstract calculateResult(input: Vector) : Vector;
}