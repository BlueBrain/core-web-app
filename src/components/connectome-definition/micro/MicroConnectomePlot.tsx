/* eslint-disable */
// @ts-nocheck
import { useEffect, useRef } from 'react';
import {
  select,
  scaleBand,
  axisBottom,
  axisLeft,
  stratify,
  treemap,
  treemapSlice,
  Selection,
  ScaleBand,
  scaleLinear,
  max,
  pointer,
} from 'd3';
import { AggregatedParamViewEntry, AggregatedVariantViewEntry } from './micro-connectome-worker';
import { VariantLabel } from './types';
import { variantLabel } from './constants';
import { textColor } from '@/util/color';
import { formatNumber } from '@/util/common';

// TODO
// * Add proper types.
// * Use constants instead of "magic" numbers (e.g. all the margins in subplots, gaps, etc.)
// * Deduplicate logic
// * Add comments to explain what each plotting code block does.
// * Refactor and clean up.

type MicroConnectomePlotBaseProps = {
  srcLabels: string[];
  dstLabels: string[];
  labelDescriptionMap: Map<string, string>;
  onEntryClick: (srcLabel: string | null, dstLabel: string | null) => void;
  navUpDisabled: { src: boolean; dst: boolean };
  onNavUpClick: (src: boolean, dst: boolean) => void;
  colorScale: (value: number) => string;
  labelColorMap: Map<string, string>;
};

type MicroConnectomeVariantPlotProps = MicroConnectomePlotBaseProps & {
  type: 'variant';
  viewData: AggregatedVariantViewEntry[];
};

type MicroConnectomeParamPlotProps = MicroConnectomePlotBaseProps & {
  type: 'param';
  viewData: AggregatedParamViewEntry[];
};

type MicroConnectomePlotProps = MicroConnectomeVariantPlotProps | MicroConnectomeParamPlotProps;

type RenderFnBaseArgs = {
  container: HTMLDivElement;
};

export const margin = { top: 0, right: 30, bottom: 74, left: 74 };

function isLeafNode(entry: AggregatedParamViewEntry): boolean {
  const [, srcMtype] = entry.srcLabel.split('.');
  const [, dstMtype] = entry.dstLabel.split('.');

  return !!srcMtype && !!dstMtype;
}

function getAggregatedVariantEntryTooltipHtml(
  entry: AggregatedVariantViewEntry,
  labelDescriptionMap: Map<string, string>
) {
  const srcHeader = `Pre-synaptic: ${labelDescriptionMap.get(entry.srcLabel)}`;
  const dstHeader = `Post-synaptic: ${labelDescriptionMap.get(entry.dstLabel)}`;

  const nPathwaysTotal = Object.values(entry.variantCount).reduce((sum, count) => sum + count, 0);

  const info = Object.entries(entry.variantCount).reduce((infoStr, [variantName, nPathways]) => {
    if (nPathways === 0) return infoStr;

    const label = variantLabel[variantName] ?? variantName;
    const nPathwaysFormatted = formatNumber(nPathways);
    const nPathwaysRelative = formatNumber((nPathways / nPathwaysTotal) * 100);

    const variantInfoStr = `${label}: ${nPathwaysFormatted} (${nPathwaysRelative}%)`;

    return `${infoStr}<br/>${variantInfoStr}`;
  }, '');

  return `
    <h3>${srcHeader}</h3>
    <h3>${dstHeader}</h3>

    <p>${info}</p>
  `;
}

function getAggregatedParamEntryTooltipHtml(
  entry: AggregatedParamViewEntry,
  labelDescriptionMap: Map<string, string>
) {
  const srcHeader = `Pre-synaptic: ${labelDescriptionMap.get(entry.srcLabel)}`;
  const dstHeader = `Post-synaptic: ${labelDescriptionMap.get(entry.dstLabel)}`;

  return `
    <h3>${srcHeader}</h3>
    <h3>${dstHeader}</h3>
  `;
}

function removePlot(container: HTMLDivElement) {
  select(container).select('svg').remove();
}

function getPlotSize(container: HTMLDivElement): { width: number; height: number } {
  const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();

  const width = containerWidth - margin.left - margin.right;
  const height = containerHeight - margin.top - margin.bottom;

  return { width, height };
}

function createPlotBase(container: HTMLDivElement): Selection<SVGGElement, unknown, null, unknown> {
  const { width, height } = getPlotSize(container);

  return select(container)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .attr('class', 'main');
}

function createPlotAxis(
  container: HTMLDivElement,
  plotBase: Selection<SVGGElement, unknown, null, undefined>,
  srcLabels: string[],
  dstLabels: string[],
  navUpDisabled: { src: boolean; dst: boolean },
  labelDescriptionMap: Map<string, string>,
  onEntryClick: (srcLabel: string | null, dstLabel: string | null) => void,
  onNavUpClick: (src: boolean, dst: boolean) => void,
  labelColorMap: Map<string, string>
): { x: ScaleBand<string>; y: ScaleBand<string> } {
  const { width, height } = getPlotSize(container);

  // Build X scales and axis:
  const x = scaleBand().range([0, width]).domain(dstLabels).padding(0.01);

  // Build X scales and axis:
  const y = scaleBand().range([height, 0]).domain(srcLabels).padding(0.01);

  const srcDstNavUpDisabled = navUpDisabled.src || navUpDisabled.dst;

  const onNavUpClickLocal = (src: boolean, dst: boolean) => {
    // Do not propagate action if navUp is disabled for a given direction (src and/or dst).
    if ((src && navUpDisabled.src) || (dst && navUpDisabled.dst)) return;

    onNavUpClick(src, dst);
  };

  if (!plotBase.select('.srcDstBackBar').node()) {
    const srcDstBackBar = plotBase.append('g').attr('class', 'srcDstBackBar');

    srcDstBackBar
      .append('rect')
      .attr('x', -74)
      .attr('y', height + 6)
      .attr('width', 68)
      .attr('height', 68)
      .style('fill', 'grey')
      .style('opacity', 0.5)
      .style('cursor', () => (!srcDstNavUpDisabled ? 'pointer' : 'not-allowed'))
      .on('mouseover', function mouseOverHandler() {
        if (srcDstNavUpDisabled) return;
        this.style.opacity = '1';
      })
      .on('mouseleave', function mouseLeaveHandler() {
        if (srcDstNavUpDisabled) return;
        this.style.opacity = '0.5';
      })
      .on('click', () => onNavUpClickLocal(true, true))
      .append('title')
      .text(
        'Navigate one level of the brain hierarchy up for both: pre-synaptic and post-synaptic selections'
      );

    srcDstBackBar
      .append('text')
      .style('fill', () => (!srcDstNavUpDisabled ? 'white' : 'darkgray'))
      .attr('x', -44)
      .attr('y', height + 44)
      .style('pointer-events', 'none')
      .text('↙');
  }

  if (!plotBase.select('.srcBackBar').node()) {
    const srcBackBar = plotBase.append('g').attr('class', 'srcBackBar');

    srcBackBar
      .append('rect')
      .attr('x', -74)
      .attr('y', 3)
      .attr('width', 20)
      .attr('height', height - 6)
      .style('fill', 'grey')
      .style('opacity', 0.5)
      .style('cursor', () => (!navUpDisabled.src ? 'pointer' : 'not-allowed'))
      .on('mouseover', function mouseOverHandler() {
        if (navUpDisabled.src) return;
        this.style.opacity = '1';
      })
      .on('mouseleave', function mouseLeaveHandler() {
        if (navUpDisabled.src) return;
        this.style.opacity = '0.5';
      })
      .on('click', () => onNavUpClickLocal(true, false))
      .append('title')
      .text('Navigate one level of the brain hierarchy up for the pre-synaptic selection');

    srcBackBar
      .append('text')
      .style('fill', () => (!navUpDisabled.src ? 'white' : 'darkgray'))
      .attr('x', -70)
      .attr('y', height / 2)
      .style('pointer-events', 'none')
      .text('<');
  }

  if (!plotBase.select('.dstBackBar').node()) {
    const dstBackBar = plotBase.append('g').attr('class', 'dstBackBar');

    dstBackBar
      .append('rect')
      .attr('x', 3)
      .attr('y', height + 53)
      .attr('width', width - 6)
      .attr('height', 20)
      .style('fill', 'grey')
      .style('opacity', 0.5)
      .style('cursor', () => (!navUpDisabled.dst ? 'pointer' : 'not-allowed'))
      .on('mouseover', function mouseOverHandler() {
        if (navUpDisabled.dst) return;
        this.style.opacity = '1';
      })
      .on('mouseleave', function mouseLeaveHandler() {
        if (navUpDisabled.dst) return;
        this.style.opacity = '0.5';
      })
      .on('click', () => onNavUpClickLocal(false, true))
      .append('title')
      .text('Navigate one level of the brain hierarchy up for the post-synaptic selection');

    dstBackBar
      .append('text')
      .style('fill', () => (!navUpDisabled.dst ? 'white' : 'darkgray'))
      .attr('x', width / 2)
      .attr('y', height + 66)
      .style('pointer-events', 'none')
      .text('∨');
  }

  const srcLabelsContainer: Selection<SVGGElement, unknown, null, undefined> = plotBase
    .select('.srcLabels')
    .node()
    ? plotBase.select('.srcLabels')
    : plotBase.append('g').attr('class', 'srcLabels');

  srcLabelsContainer
    .selectAll()
    .data(srcLabels)
    .enter()
    .append('rect')
    .attr('x', () => -50)
    .attr('y', (srcLabel) => y(srcLabel) as number)
    .attr('width', 50)
    .attr('height', y.bandwidth())
    .attr('title', 'test')
    .style('fill', (label) => labelColorMap.get(label.split('.')[0]) ?? 'grey')
    .style('opacity', '0.85')
    .style('cursor', 'pointer')
    .on('mouseover', function mouseOverHandler() {
      this.style.opacity = '1';
    })
    .on('mouseleave', function mouseLeaveHandler() {
      this.style.opacity = '0.85';
    })
    .on('click', (e: any) => onEntryClick(e.target.__data__, null))
    .append('title')
    .text((label) => labelDescriptionMap.get(label) as string);

  const dstLabelsContainer: Selection<SVGGElement, unknown, null, undefined> = plotBase
    .select('.dstLabels')
    .node()
    ? plotBase.select('.dstLabels')
    : plotBase.append('g').attr('class', 'dstLabels');

  dstLabelsContainer
    .selectAll()
    .data(dstLabels)
    .enter()
    .append('rect')
    .attr('x', (dstLabel) => x(dstLabel) as number)
    .attr('y', () => height + 1)
    .attr('width', x.bandwidth())
    .attr('height', 50)
    .attr('title', 'test')
    .style('fill', (label) => labelColorMap.get(label.split('.')[0]) ?? 'grey')
    .style('opacity', '0.85')
    .style('cursor', 'pointer')
    .on('mouseover', function mouseOverHandler() {
      this.style.opacity = '1';
    })
    .on('mouseleave', function mouseLeaveHandler() {
      this.style.opacity = '0.85';
    })
    .on('click', (e: any) => onEntryClick(null, e.target.__data__))
    .append('title')
    .text((label) => labelDescriptionMap.get(label) as string);

  const srcAxisContainer: Selection<SVGGElement, unknown, null, undefined> =
    plotBase.select('.srcAxis');

  if (srcAxisContainer.node()) {
    srcAxisContainer.call(axisLeft(y));
  } else {
    plotBase
      .append('g')
      .attr('class', 'srcAxis')
      .style('pointer-events', 'none')
      .call(axisLeft(y))
      .call((g) =>
        g
          .selectAll<SVGGElement, string>('.tick')
          .style('color', (label) => textColor(labelColorMap.get(label.split('.')[0]) ?? 'grey'))
          .select('text')
          .html((label: string) => {
            const [brainRegionNotation, mtype] = label.split('.');
            return mtype
              ? `<tspan x="-9" dy="-0.2em">${brainRegionNotation}</tspan><tspan x="-9" dy="1.2em">${mtype}</tspan>`
              : brainRegionNotation;
          })
      );
  }

  const dstAxisContainer: Selection<SVGGElement, unknown, null, undefined> =
    plotBase.select('.dstAxis');

  if (dstAxisContainer.node()) {
    dstAxisContainer.call(axisBottom(x));
  } else {
    plotBase
      .append('g')
      .attr('class', 'dstAxis')
      .attr('transform', `translate(0, ${height})`)
      .style('pointer-events', 'none')
      .call(axisBottom(x))
      .call((g) =>
        g
          .selectAll<SVGGElement, string>('.tick')
          .style('color', (label) => textColor(labelColorMap.get(label.split('.')[0]) ?? 'grey'))
          .select('text')
          .html((label: string) => {
            const [brainRegionNotation, mtype] = label.split('.');
            return mtype
              ? `<tspan x="0" dy="0.8em">${brainRegionNotation}</tspan><tspan x="0" dy="1.2em">${mtype}</tspan>`
              : brainRegionNotation;
          })
      );
  }

  return { x, y };
}

function renderVariantPlotContent(
  container: HTMLDivElement,
  plotBase: Selection<SVGGElement, unknown, null, undefined>,
  viewData: AggregatedVariantViewEntry[],
  labelDescriptionMap: Map<string, string>,
  scaleBand: {
    x: ScaleBand<string>;
    y: ScaleBand<string>;
  },
  onEntryClick: (srcLabel: string | null, dstLabel: string | null) => void,
  colorScale: (variantIdx: number) => string
): void {
  const tooltip: Selection<HTMLDivElement, unknown, null, undefined> = select(container)
    .select('.tooltip')
    .node()
    ? select(container).select('.tooltip')
    : select(container)
        .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip')
        .style('background-color', 'black')
        .style('border', 'solid')
        .style('border-radius', '2px')
        .style('border-width', '1px')
        .style('border-color', 'white')
        .style('padding', '8px')
        .style('white-space', 'nowrap')
        .style('position', 'absolute')
        .style('pointer-events', 'none');

  const onMouseover = function onMouseover(d) {
    tooltip.style('opacity', 1);

    select(this).style('stroke', 'black').style('opacity', 1);
  };

  const onMousemove = function onMousemove(e) {
    const [x, y] = pointer(e, container);

    tooltip
      .style('left', `${x + 24}px`)
      .style('top', `${y}px`)
      .html(
        getAggregatedVariantEntryTooltipHtml(
          e.currentTarget.__data__ as AggregatedVariantViewEntry,
          labelDescriptionMap
        )
      );
  };

  const onMouseleave = function onMouseleave(d) {
    tooltip.style('opacity', 0);

    select(this).style('stroke', 'none').style('opacity', 0.85);
  };

  const onEntryClickLocal = (srcLabel: string | null, dstLabel: string | null) => {
    tooltip.style('opacity', 0);
    onEntryClick(srcLabel, dstLabel);
  };

  const { x, y } = scaleBand;

  const contentContainer: Selection<SVGGElement, unknown, null, undefined> = plotBase
    .select('.content')
    .node()
    ? plotBase.select('.content')
    : plotBase.append('g').attr('class', 'content');

  const getTreeMapData = (dataEntry: AggregatedVariantViewEntry) =>
    treemap()
      .size([x.bandwidth(), y.bandwidth()])
      .tile(treemapSlice)(
        // .padding(1)
        stratify()(
          Object.entries(dataEntry.variantCount)
            .map(([variantName, value]) => ({
              id: variantName,
              value,
              parentId: 'root',
              color: colorScale(variantName),
            }))
            .concat({ id: 'root' })
        ).sum((d) => d.value)
      )
      .leaves();

  const primaryLevelGroupEnterSelection = contentContainer
    .selectAll()
    .data(viewData)
    .enter()
    .append('g')
    .attr('transform', (d) => `translate(${x(d.dstLabel)},${y(d.srcLabel)})`)
    .style('cursor', 'pointer')
    .on('click', (d) =>
      onEntryClickLocal(d.currentTarget.__data__.srcLabel, d.currentTarget.__data__.dstLabel)
    );

  primaryLevelGroupEnterSelection
    .filter((d) => Object.values(d.variantCount).reduce((sum, count) => sum + count, 0) === 0)
    .append('rect')
    .attr('width', () => x.bandwidth())
    .attr('height', () => y.bandwidth())
    .style('opacity', 0.85)
    .style('fill', 'darkslategray');

  primaryLevelGroupEnterSelection
    .filter((d) => Object.values(d.variantCount).reduce((sum, count) => sum + count, 0) === 0)
    .append('text')
    .text('No data')
    .attr('x', x.bandwidth() / 2)
    .attr('y', y.bandwidth() / 2)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('pointer-events', 'none')
    .style('font-size', '12px')
    .style('fill', 'white')
    .style('opacity', 0.24);

  primaryLevelGroupEnterSelection
    .append('g')
    .style('opacity', 0.85)
    .on('mouseover', onMouseover)
    .on('mouseleave', onMouseleave)
    .on('mousemove', onMousemove)
    .selectAll()
    .data(getTreeMapData)
    .enter()
    .append('rect')
    .attr('x', (d) => d.x0)
    .attr('y', (d) => d.y0)
    .attr('width', (d) => d.x1 - d.x0)
    .attr('height', (d) => d.y1 - d.y0)
    .style('stroke', 'black')
    .style('fill', (d) => d.data.color);

  primaryLevelGroupEnterSelection
    .selectAll()
    .data(getTreeMapData)
    .enter()
    .append('text')
    .attr('x', (d) => d.x0 + 10) // +10 to adjust position (more right)
    .attr('y', (d) => d.y0 + 18) // +20 to adjust position (lower)
    .text((d) =>
      d.value !== 1
        ? `${variantLabel[d.id as keyof VariantLabel] ?? d.id}: ${formatNumber(d.value as number)}`
        : ''
    )
    .attr('font-size', '12px')
    .attr('fill', (d) => textColor(d.data.color))
    .style('opacity', function getTextOpacity(d) {
      const sufficientHeight = d.y1 - d.y0 > 22;
      if (!sufficientHeight) return 0;

      const textWidth = select(this).node()?.getComputedTextLength() ?? 0;
      if (textWidth + 10 > x.bandwidth()) return 0;

      return 1;
    })
    .style('pointer-events', 'none');
}

function renderParamPlotContent(
  container: HTMLDivElement,
  plotBase: Selection<SVGGElement, unknown, null, undefined>,
  viewData: AggregatedParamViewEntry[],
  scaleBand: {
    x: ScaleBand<string>;
    y: ScaleBand<string>;
  },
  labelDescriptionMap: Map<string, string>,
  onEntryClick: (srcLabel: string | null, dstLabel: string | null) => void,
  colorScale: (paraValue: number) => string
) {
  const { x, y } = scaleBand;

  const tooltip: Selection<HTMLDivElement, unknown, null, undefined> = select(container)
    .select('.tooltip')
    .node()
    ? select(container).select('.tooltip')
    : select(container)
        .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip')
        .style('background-color', 'black')
        .style('border', 'solid')
        .style('border-radius', '2px')
        .style('border-width', '1px')
        .style('border-color', 'white')
        .style('padding', '8px')
        .style('white-space', 'nowrap')
        .style('position', 'absolute')
        .style('pointer-events', 'none');

  const onMouseover = function onMouseover(d) {
    tooltip.style('opacity', 1);

    select(this).style('stroke', 'black').style('opacity', 1);
  };

  const onMousemove = function onMousemove(e) {
    const [x, y] = pointer(e, container);

    tooltip
      .style('left', `${x + 24}px`)
      .style('top', `${y}px`)
      .html(
        getAggregatedParamEntryTooltipHtml(
          e.currentTarget.__data__ as AggregatedVariantViewEntry,
          labelDescriptionMap
        )
      );
  };

  const onMouseleave = function onMouseleave(d) {
    tooltip.style('opacity', 0);

    select(this).style('stroke', 'none').style('opacity', 0.85);
  };

  const onEntryClickLocal = (srcLabel: string | null, dstLabel: string | null) => {
    tooltip.style('opacity', 0);
    onEntryClick(srcLabel, dstLabel);
  };

  const contentContainer: Selection<SVGGElement, unknown, null, undefined> = plotBase
    .select('.content')
    .node()
    ? plotBase.select('.content')
    : plotBase.append('g').attr('class', 'content');

  const primaryLevelGroupEnterSelection = contentContainer
    .selectAll()
    .data(viewData)
    .enter()
    .append('g')
    .attr('transform', (d) => `translate(${x(d.dstLabel)},${y(d.srcLabel)})`)
    .style('cursor', 'pointer')
    .on('click', (d) =>
      onEntryClickLocal(d.currentTarget.__data__.srcLabel, d.currentTarget.__data__.dstLabel)
    );

  primaryLevelGroupEnterSelection
    .append('rect')
    .attr('width', () => x.bandwidth())
    .attr('height', () => y.bandwidth())
    .style('opacity', 0.85)
    .style('fill', (d) => (d.noData ? '#213838' : 'darkslategray'))
    .on('mouseover', onMouseover)
    .on('mouseleave', onMouseleave)
    .on('mousemove', onMousemove);

  const subMargin = {
    left: 52,
    top: 28,
    right: 28,
    bottom: 28,
  };

  const subMarginX = subMargin.left + subMargin.right;
  const subMarginY = subMargin.top + subMargin.bottom;

  const subPlotAxesVisible = x.bandwidth() - subMarginX > 86 && y.bandwidth() - subMarginX > 48;

  primaryLevelGroupEnterSelection
    .append('g')
    .attr('class', 'subplot-axes')
    .style('pointer-events', 'none')
    .each(function (d) {
      if (!subPlotAxesVisible || d.noData) return;

      const subX = scaleLinear()
        .domain([0, d.max])
        .range([0, x.bandwidth() - subMarginX]);
      const subY = scaleLinear()
        .range([y.bandwidth() - subMarginY, 0])
        .domain([0, max(d.bins, (d) => d.count) as number]);

      select(this)
        .append('g')
        .attr('transform', `translate(${subMargin.left}, ${y.bandwidth() - subMargin.top})`)
        .call(axisBottom(subX));

      select(this)
        .append('g')
        .attr('transform', `translate(${subMargin.left}, ${subMargin.top})`)
        .call(axisLeft(subY));
    });

  primaryLevelGroupEnterSelection
    .filter((d) => d.noData)
    .append('text')
    .text('No data')
    .attr('x', x.bandwidth() / 2)
    .attr('y', y.bandwidth() / 2)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('pointer-events', 'none')
    .style('font-size', '12px')
    .style('fill', 'white')
    .style('opacity', 0.24);

  primaryLevelGroupEnterSelection
    .filter((d) => !d.noData && isLeafNode(d))
    .append('rect')
    .attr('x', 4)
    .attr('y', 4)
    .attr('width', x.bandwidth() - 8)
    .attr('height', y.bandwidth() - 8)
    .style('fill', (d) => colorScale(d.bins.find((bin) => bin.count === 1)?.x1 as number)) // TODO move value getter into a separate function.
    .style('pointer-events', 'none');

  const secondaryLevelGroupEnterSelection = primaryLevelGroupEnterSelection
    .filter((d) => !isLeafNode(d))
    .selectAll()
    .data((d) => {
      const subX = scaleLinear()
        .domain([0, d.max])
        .range([0, x.bandwidth() - (subPlotAxesVisible ? subMarginX : 8)]);
      const subY = scaleLinear()
        .range([y.bandwidth() - (subPlotAxesVisible ? subMarginY : 8), 0])
        .domain([0, max(d.bins, (d) => d.count) as number]);
      return d.bins.map((bin) => ({ ...bin, subX, subY, noData: d.noData }));
    })
    .enter()
    .filter((d) => !d.noData);

  secondaryLevelGroupEnterSelection
    .append('rect')
    .attr('x', 1)
    .attr(
      'transform',
      (d) =>
        `translate(${d.subX(d.x0) + (subPlotAxesVisible ? subMargin.left : 4)},${
          d.subY(d.count) + (subPlotAxesVisible ? subMargin.top : 4)
        })`
    )
    .attr('width', (d) => d.subX(d.x1) - d.subX(d.x0) - 1)
    .attr('height', (d) => y.bandwidth() - d.subY(d.count) - (subPlotAxesVisible ? subMarginY : 8))
    .style('pointer-events', 'none')
    .style('fill', (d) => colorScale(d.x1))
    .style('opacity', 0.85);
}

type RenderVariantPlotArg = RenderFnBaseArgs & Omit<MicroConnectomeVariantPlotProps, 'type'>;

function renderVariantPlot({
  container,
  srcLabels,
  dstLabels,
  navUpDisabled,
  labelDescriptionMap,
  viewData,
  colorScale,
  onEntryClick,
  onNavUpClick,
  labelColorMap,
}: RenderVariantPlotArg) {
  const plotBase = createPlotBase(container);

  const { x, y } = createPlotAxis(
    container,
    plotBase,
    srcLabels,
    dstLabels,
    navUpDisabled,
    labelDescriptionMap,
    onEntryClick,
    onNavUpClick,
    labelColorMap
  );
  renderVariantPlotContent(
    container,
    plotBase,
    viewData,
    labelDescriptionMap,
    { x, y },
    onEntryClick,
    colorScale
  );
}

type RenderParamPlotArg = RenderFnBaseArgs & Omit<MicroConnectomeParamPlotProps, 'type'>;

function renderParamPlot({
  container,
  srcLabels,
  dstLabels,
  navUpDisabled,
  labelDescriptionMap,
  viewData,
  colorScale,
  onEntryClick,
  onNavUpClick,
  labelColorMap,
}: RenderParamPlotArg): void {
  const plotBase = createPlotBase(container);

  const { x, y } = createPlotAxis(
    container,
    plotBase,
    srcLabels,
    dstLabels,
    navUpDisabled,
    labelDescriptionMap,
    onEntryClick,
    onNavUpClick,
    labelColorMap
  );
  renderParamPlotContent(
    container,
    plotBase,
    viewData,
    { x, y },
    labelDescriptionMap,
    onEntryClick,
    colorScale
  );
}

export default function MicroConnectomePlot({
  type,
  srcLabels,
  dstLabels,
  navUpDisabled,
  labelDescriptionMap,
  viewData,
  colorScale,
  onEntryClick,
  onNavUpClick,
  labelColorMap,
}: MicroConnectomePlotProps) {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!srcLabels?.length || !dstLabels?.length || !viewData) return;

    const container = plotRef.current as HTMLDivElement;

    const renderPlotArg = {
      container,
      srcLabels,
      dstLabels,
      navUpDisabled,
      labelDescriptionMap,
      viewData,
      colorScale,
      onEntryClick,
      onNavUpClick,
      labelColorMap,
    };

    if (type === 'variant') {
      renderVariantPlot(renderPlotArg as RenderVariantPlotArg);
    } else {
      renderParamPlot(renderPlotArg as RenderParamPlotArg);
    }

    // eslint-disable-next-line consistent-return
    return () => {
      removePlot(container);
    };
  }, [
    srcLabels,
    dstLabels,
    labelDescriptionMap,
    viewData,
    colorScale,
    onEntryClick,
    type,
    labelColorMap,
    onNavUpClick,
  ]);

  return <div className="h-full" ref={plotRef} />;
}
