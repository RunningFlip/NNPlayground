import { Color } from "d3"
import { vec2 } from "gl-matrix"
import { Matrix } from "../math/matrix"
import { Vector } from "../math/vector"

// --------------------------------------------------------------------------------

export type Neuron = {
    id: number,
    pos: vec2
    value?: number
}

export type Link = {
    targetId: number,
    weight?: number
}

// --------------------------------------------------------------------------------

export type NeuronInfo = {
    color: string,
    neuron: Neuron,
    links?: Link[]
}

// --------------------------------------------------------------------------------

export class Layer {

    // --------------------------------------------------------------------------------
    // Fields
    // --------------------------------------------------------------------------------
    
    private readonly neuronInfo: NeuronInfo[];
    private readonly activationFunc?: (value: number) => number

    private readonly weights?: Matrix;
    private results: Vector;

    // --------------------------------------------------------------------------------
    // Properties
    // --------------------------------------------------------------------------------

    public get count(): number { return this.neuronInfo.length; }

    // --------------------------------------------------------------------------------
    // Constructor
    // --------------------------------------------------------------------------------
    
    public constructor(neuronInfo: NeuronInfo[], activationFunc?: (value: number) => number) {

        this.neuronInfo = neuronInfo;
        
        if (activationFunc) {
            this.activationFunc = activationFunc;
        }

        if (neuronInfo[0].links) {
            this.weights = new Matrix(neuronInfo[0].links.length, this.neuronInfo.length);
        }
        
        this.results = new Vector(this.neuronInfo.length);

        this.updateWeights();
    }

    // --------------------------------------------------------------------------------
    // Methods
    // --------------------------------------------------------------------------------
    
    public calculate(input: Vector): Vector {

        if (!this.weights) {
            return input;
        }

        this.results = this.weights.multiplyVector(input);

        for (let i = 0; i < this.results.size; i++) {

            const result: number = this.activationFunc!(this.results.getValue(i));
            this.results.setValue(i, result)
            this.neuronInfo[i].neuron.value = result;
        }

        return this.results;
    }

    // --------------------------------------------------------------------------------

    public setError(error: number): void {

        // TODO calc new weight
        this.updateWeights;
    }

    // --------------------------------------------------------------------------------
    
    private updateWeights(): void {

        if (!this.weights) {
            return;
        }

        for (let x = 0; x < this.weights.columnCount; x++) {

            const neuron: NeuronInfo = this.neuronInfo[x];

            for (let y = 0; y < this.weights.rowCount; y++) {
                this.weights.setValue(y, x, neuron.links![y].weight!);
            }
        }
    }
}