import { Selection } from "d3";
import { IDrawable } from "../drawing/drawable";
import { NetworkResult } from "../network/network";

// --------------------------------------------------------------------------------

export class Log implements IDrawable {

    private results: NetworkResult[] = [];

    // --------------------------------------------------------------------------------
    
    public log(result: NetworkResult): void {
        this.results.push(result);
    } 

    // --------------------------------------------------------------------------------
    
    public draw(svg: Selection<SVGSVGElement, unknown, HTMLElement, any>): void {
        throw new Error("Method not implemented.");
    }
}