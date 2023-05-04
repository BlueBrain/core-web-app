import * as d3 from 'd3';
import { removeChildren } from './dom';

const min = 0;

export default class ScaleViewer {
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;

  private scale: d3.ScaleLinear<number, number>;

  private axis: d3.Axis<d3.NumberValue>;

  constructor(private div: HTMLDivElement, max: number) {
    const { clientWidth: width, clientHeight: height } = div;
    const margins = {
      top: 20,
      bottom: 20,
    };

    const data = [min, max];
    this.svg = d3.select(div).append('svg').attr('width', width).attr('height', height);

    this.scale = d3
      .scaleLinear()
      .range([height - margins.top, margins.bottom])
      .domain([d3.min(data) || min, d3.max(data) || max]);

    this.axis = d3.axisRight(this.scale);

    this.svg.append('g').call(this.axis);

    this.onScaleChange(max);
  }

  onScaleChange(max: number) {
    this.scale.domain([min, max]);
    this.svg.call(d3.axisRight(this.scale).tickFormat((x) => `${x} μm`));
  }

  destroy() {
    this.svg.remove();
    removeChildren(this.div);
  }
}
