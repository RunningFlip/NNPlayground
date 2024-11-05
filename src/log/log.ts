import { Selection } from "d3";
import { IDrawable } from "../drawing/drawable";
import { drawLog } from "../drawing/draw";
import { NetworkResult } from "../network/network";
import { Vector } from "../math/vector";

// --------------------------------------------------------------------------------

export class Log implements IDrawable {

    private results: string[] = [];

    // --------------------------------------------------------------------------------
    
    public log(result: NetworkResult): void {
        let input = this.getVectorString("Input", result.input);
        let output = this.getVectorString("--Output", result.output);
        let expected = this.getVectorString("--Expected", result.expected);
        let satisfied = `--Satisfied: ${result.satisfied}`

        this.results.push(input);
        this.results.push(output);
        this.results.push(expected);
        this.results.push(satisfied);
    } 

    // --------------------------------------------------------------------------------
    
    public draw(svg: Selection<SVGSVGElement, unknown, HTMLElement, any>): void {
        drawLog(this.results, svg);
    }

    // --------------------------------------------------------------------------------

    private getVectorString(name: string, vec: Vector) : string {

        let vecString = `${name}: `;

        for (let i = 0; i < vec.size; i++) {
            vecString += `${vec.getValue(i).toFixed(4)}`;

            if (i < vec.size - 1) {
                vecString += ", ";
            }
        }

        return vecString;
    }
}