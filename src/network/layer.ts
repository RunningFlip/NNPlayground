import { drawLine, drawNode } from "../drawing/draw";
import { IDrawable } from "../drawing/drawable";
import { Vector } from "../math/vector"
import { Link } from "./link";
import { getNodeById, Neuron } from "./neuron";

// --------------------------------------------------------------------------------

export type NeuronInfo = {
    color: string,
    neuron: Neuron,
    incomingLink?: Link[]
}

// --------------------------------------------------------------------------------

export abstract class Layer implements IDrawable {

    // --------------------------------------------------------------------------------
    // Fields
    // --------------------------------------------------------------------------------
    
    protected readonly info: NeuronInfo[];

    // --------------------------------------------------------------------------------
    // Properties
    // --------------------------------------------------------------------------------
    
    public get count() { return this.info.length; }

    // --------------------------------------------------------------------------------
    // Constructor
    // --------------------------------------------------------------------------------

    public constructor(info: NeuronInfo[]) {
        this.info = info;
    }

    // --------------------------------------------------------------------------------
    // Methods
    // --------------------------------------------------------------------------------
    
    public abstract backPropagate(expectedOutput: Vector): Vector;
    protected abstract calculateResult(input: Vector) : Vector;

    // --------------------------------------------------------------------------------

    public calculate(input: Vector): Vector {

        const result: Vector = this.calculateResult(input);

        for (let i = 0; i < this.info.length; i++) {
            this.info[i].neuron.value = result.getValue(i);
        }

        return result;
    }

    // --------------------------------------------------------------------------------
    
    public draw(svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>): void {
        
        for (let i = 0; i < this.info.length; i++) {
            
            const info: NeuronInfo = this.info[i];
            
            if (info.incomingLink) {
                this.drawLink(info, svg);
            }

            drawNode(info, svg);
        }
    }

    // --------------------------------------------------------------------------------

    private drawLink(info: NeuronInfo, svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>): void {

        if (info.incomingLink) {

            for (let j = 0; j < info.incomingLink.length; j++) {
            
                const link: Link = info.incomingLink[j]
                const previous: Neuron = getNodeById(link.id);

                drawLine(previous, info.neuron, link.weight, svg);
            }
        }
    }
}