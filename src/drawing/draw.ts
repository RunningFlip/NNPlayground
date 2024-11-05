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
        .attr('refX', 5) 
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
        .attr('x', -15) 
        .attr('y', -7.5)
        .attr('width', 30)
        .attr('height', 15)
        .attr('fill', 'white')
        .attr('stroke', 'black');

    link.append('text')
        .attr('class', 'link-text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em') 
        .text(weight.toFixed(3))
        .style('font-size', '10px') 
        .style('font-weight', 'bold'); 
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
        .style('font-size', '9px') 
        .text(info.neuron.id);

    svg.append('text')
        .attr('class', 'text')
        .attr('x', info.neuron.pos[0])
        .attr('y', info.neuron.pos[1] + 5)
        .attr('text-anchor', 'middle')
        .text(info.neuron.value.toFixed(3));
}

// --------------------------------------------------------------------------------

export function drawLog(logs: string[], svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>): void {

    const boxWidth = 600;
    const boxHeight = 205;
    const boxX = 50;
    const boxY = 50;

    svg.append('clipPath')
    .attr('id', 'clip-box')
    .append('rect')
    .attr('x', boxX)
    .attr('y', boxY)
    .attr('width', boxWidth)
    .attr('height', boxHeight);

    // Create a box
    svg.append('rect')
    .attr('x', boxX)
    .attr('y', boxY)
    .attr('width', boxWidth)
    .attr('height', boxHeight)
    .attr('fill', '#f3f3f3')
    .attr('stroke', '#000');

    // Create a group that will hold the text, and apply the clip-path
    const textGroup = svg.append('g')
    .attr('clip-path', 'url(#clip-box)')  
    .attr('transform', `translate(0, 0)`);  

    const MAX_LOGS = 10;  
    const textPaddingX = 10;
    const textPaddingY = 15;
    const lineHeight = 20;

    const visibleLogs = logs.slice(-MAX_LOGS);
    const textSelection = textGroup.selectAll<SVGTextElement, string>('text').data(visibleLogs);

    textSelection.exit().remove();

    textSelection.enter()
    .append('text')
    .merge(textSelection)
    .attr('x', boxX + textPaddingX)
    .attr('y', (d, i) => boxY + textPaddingY + (i * lineHeight)) // Position logs from the top
    .attr('font-size', '14px')
    .attr('fill', '#333')
    .text(d => d);
}