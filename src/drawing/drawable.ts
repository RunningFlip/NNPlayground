
export interface IDrawable {
    draw(svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>): void;
}