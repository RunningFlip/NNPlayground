import { NeuronInfo } from "../network/layer";
import { Neuron } from "../network/neuron";

// --------------------------------------------------------------------------------

const neuronRadius: number = 20;

// --------------------------------------------------------------------------------

export function drawLine(source: Neuron, target: Neuron, weight: number, svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>): void {

    svg.append('line')
        .attr('class', 'link')
        .attr('x1', source.pos[0])
        .attr('y1', source.pos[1])
        .attr('x2', target.pos[0])
        .attr('y2', target.pos[1])
        .attr('stroke', 'black');

    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 5) // Center the arrowhead
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', 'black');

    svg.append('line')
        .attr('class', 'arrowhead')
        .attr('x1', source.pos[0] + 5 * (target.pos[0] - source.pos[0]) / 6)
        .attr('y1', source.pos[1] + 5 * (target.pos[1] - source.pos[1]) / 6)
        .attr('x2', source.pos[0] + 5 * (target.pos[0] - source.pos[0]) / 6 + (target.pos[0] - source.pos[0]) / 60) // Small offset to show the arrowhead
        .attr('y2', source.pos[1] + 5 * (target.pos[1] - source.pos[1]) / 6 + (target.pos[1] - source.pos[1]) / 60) // Small offset to show the arrowhead
        .attr('stroke', 'black')
        .attr('marker-end', 'url(#arrowhead)');

    const link = svg.append('g')
        .attr('class', 'link-group')
        .attr('transform', () => {
            const x = source.pos[0] + (target.pos[0] - source.pos[0]) / 4;
            const y = source.pos[1] + (target.pos[1] - source.pos[1]) / 4;
            return `translate(${x},${y})`;
        });

    link.append('rect')
        .attr('x', -15) // Adjust these values as needed to fit the text
        .attr('y', -7.5)
        .attr('width', 30)
        .attr('height', 15)
        .attr('fill', 'white')
        .attr('stroke', 'black');

    link.append('text')
        .attr('class', 'link-text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em') // Center the text vertically
        .text(weight.toFixed(3))
        .style('font-size', '10px') // Set the desired font size
        .style('font-weight', 'bold'); // Make the text bold
}

// --------------------------------------------------------------------------------

export function drawNode(info: NeuronInfo, svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>): void {

    svg.append('circle')
        .attr('class', 'node')
        .attr('cx', info.neuron.pos[0])
        .attr('cy', info.neuron.pos[1])
        .attr('r', neuronRadius)
        .attr('fill', info.color)
        .attr('stroke', 'black');

    svg.append('text')
        .attr('class', 'text')
        .attr('x', info.neuron.pos[0])
        .attr('y', info.neuron.pos[1] - 5 - neuronRadius)
        .attr('text-anchor', 'middle')
        .text(info.neuron.id);

    svg.append('text')
        .attr('class', 'text')
        .attr('x', info.neuron.pos[0])
        .attr('y', info.neuron.pos[1] + 5)
        .attr('text-anchor', 'middle')
        .text(info.neuron.value.toFixed(3));
}
