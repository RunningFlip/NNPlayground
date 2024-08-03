import { Vector } from "../math/vector";
import { Layer } from "./layer";

// --------------------------------------------------------------------------------

export class Network {

    // --------------------------------------------------------------------------------
    // Fields
    // --------------------------------------------------------------------------------
    
    private readonly layers: Layer[];

    // --------------------------------------------------------------------------------
    // Properties
    // --------------------------------------------------------------------------------
    
    public get inputCount(): number { return this.layers[0].count; }

    // --------------------------------------------------------------------------------
    // Constructor
    // --------------------------------------------------------------------------------
    
    public constructor(layers: Layer[]) {
        this.layers = layers;
    }

    // --------------------------------------------------------------------------------
    // Methods
    // --------------------------------------------------------------------------------
    
    public calculate(input: Vector, expectedOutput: Vector): boolean {

        let result = input;

        for (let i = 0; i < this.layers.length; i++) {
            result = this.layers[i].calculate(result);
        }

        const correct: boolean = result === expectedOutput;

        if (!correct) {
            this.backPropegate(expectedOutput);
        }

        return correct;
    }

    // --------------------------------------------------------------------------------

    private backPropegate(expectedResult: Vector): void {
        
        for (let i = this.layers.length - 1; i >= 0; i--) {
            expectedResult = this.layers[i].backPropagate(expectedResult);
        }
    }
}