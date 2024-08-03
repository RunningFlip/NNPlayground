import { Matrix } from "../math/matrix";
import { Vector } from "../math/vector";
import { Layer, NeuronInfo } from "./layer";


export class HiddenLayer extends Layer {

    private readonly activationFunc: (value: number) => number;

    constructor(info: NeuronInfo[], activationFunc: (value: number) => number) {
        super(info);       
        this.activationFunc = activationFunc;
    }

    public calculateResult(input: Vector) : Vector {

        const weights: Matrix = this.createWeighMatrix();
        const results: Vector = weights.multiplyVector(input);

        for (let i = 0; i < this.info.length; i++) {
           
            const result: number = this.activationFunc(results.getValue(i));
            results.setValue(i, result);
            this.info[i].neuron.value = result;
        }

        return results;
    }

    private createWeighMatrix(): Matrix {

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