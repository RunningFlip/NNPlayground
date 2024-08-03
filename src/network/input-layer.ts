import { Vector } from "../math/vector";
import { Layer } from "./layer";


export class InputLayer extends Layer {

    protected calculateResult(input: Vector): Vector {
        return input;
    }
}