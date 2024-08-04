import { Matrix } from "../math/matrix";
import { Vector } from "../math/vector";
import { Layer, NeuronInfo } from "./layer";

// --------------------------------------------------------------------------------

export class HiddenLayer extends Layer {

    // --------------------------------------------------------------------------------
    // Fields
    // --------------------------------------------------------------------------------
    
    private readonly activationFunc: (value: number) => number;

    // --------------------------------------------------------------------------------
    // Constructor
    // --------------------------------------------------------------------------------

    public constructor(info: NeuronInfo[], activationFunc: (value: number) => number) {
        super(info);       
        this.activationFunc = activationFunc;
    }

    // --------------------------------------------------------------------------------
    // Methods
    // --------------------------------------------------------------------------------

    public calculateResult(input: Vector) : Vector {

        const weights: Matrix = this.createWeigthMatrix().transpose(); // why do we really need to transponse here?;
        const results: Vector = weights.multiplyVector(input);

        for (let i = 0; i < this.info.length; i++) {
           
            const result: number = this.activationFunc(results.getValue(i));
            results.setValue(i, result);
            this.info[i].neuron.value = result;
        }

        return results;
    }

    // --------------------------------------------------------------------------------
    
    public backPropagate(expectedOutput: Vector): Vector {

        const weights: Matrix = this.createWeigthMatrix().transpose();
        
        let error: Vector = this.createValuesVector().substract(expectedOutput);
        error = weights.multiplyVector(error);

        for (let i = 0; i < this.info.length; i++) {
           
            const currentInfo: NeuronInfo = this.info[i];
            const currentWeight: number = currentInfo.incomingLink![i].weight;
            currentInfo.incomingLink![i].weight = currentWeight + error.getValue(i);
        }

        return error;
    }

    // --------------------------------------------------------------------------------
    
    private createValuesVector(): Vector {

        const values: Vector = new Vector(this.info.length);

        for (let i = 0; i < this.info.length; i++) {
            values.setValue(i, this.info[i].neuron.value);
        }

        return values;
    }

    // --------------------------------------------------------------------------------
    
    private createWeigthMatrix(): Matrix {

        const weights: Matrix = new Matrix(this.info[0].incomingLink!.length, this.info.length);

        for (let x = 0; x < weights.columnCount; x++) {

            const neuron: NeuronInfo = this.info[x];

            for (let y = 0; y < weights.rowCount; y++) {
                weights.setValue(y, x, neuron.incomingLink![y].weight!);
            }
        }

        return weights;
    }
}