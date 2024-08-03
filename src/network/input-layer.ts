import { Vector, vectorZero } from "../math/vector";
import { Layer } from "./layer";


export class InputLayer extends Layer {

    public backPropagate(expectedOutput: Vector): Vector { 
        return vectorZero(this.info.length);
    }

    protected calculateResult(input: Vector): Vector {
        return input;
    }
}