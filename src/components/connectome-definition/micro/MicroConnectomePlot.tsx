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
  Selection as D3Selection,
  ScaleBand,
  scaleLinear,
  max,
  pointer,
} from 'd3';
import { AggregatedParamViewEntry, AggregatedVariantViewEntry } from './micro-connectome-worker';
import { VariantLabel, PathwaySideSelection as Selection } from './types';
import { variantLabel } from './constants';
import { getSelectionLabel } from './utils';
import { textColor } from '@/util/color';
import { formatNumber } from '@/util/common';

const layout = {
  axisBar: {
    height: '38px',
    borderRadius: '5px',
  },
  navUpBar: {
    width: '71px',
    hight: '24px',
  },
};

// TODO
// * Add proper types.
// * Use constants instead of "magic" numbers (e.g. all the margins in subplots, gaps, etc.)
// * Deduplicate logic
// * Add comments to explain what each plotting code block does.
// * Refactor and clean up.

type MicroConnectomePlotBaseProps = {
  srcSelections: Selection[];
  dstSelections: Selection[];
  brainRegionNotationTitleMap: Map<string, string>;
  onEntryClick: (srcSelection: Selection | null, dstSelection: Selection | null) => void;
  navUpDisabled: { src: boolean; dst: boolean };
  onNavUpClick: (src: boolean, dst: boolean) => void;
  colorScale: (value: number) => string;
  brainRegionNotationColorMap: Map<string, string>;
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
  return !!entry.srcSelection.mtype && !!entry.dstSelection.mtype;
}

function getAggregatedVariantEntryTooltipHtml(
  entry: AggregatedVariantViewEntry,
  brainRegionNotationTitleMap: Map<string, string>
) {
  const srcBrainRegionTitle = brainRegionNotationTitleMap.get(
    entry.srcSelection.brainRegionNotation
  );
  const srcHeader = `Pre-synaptic: ${srcBrainRegionTitle}`;

  const dstBrainRegionTitle = brainRegionNotationTitleMap.get(
    entry.dstSelection.brainRegionNotation
  );
  const dstHeader = `Post-synaptic: ${dstBrainRegionTitle}`;

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
  brainRegionNotationTitleMap: Map<string, string>
) {
  const srcBrainRegionTitle = brainRegionNotationTitleMap.get(
    entry.srcSelection.brainRegionNotation
  );
  const srcHeader = `Pre-synaptic: ${srcBrainRegionTitle}`;

  const dstBrainRegionTitle = brainRegionNotationTitleMap.get(
    entry.dstSelection.brainRegionNotation
  );
  const dstHeader = `Post-synaptic: ${dstBrainRegionTitle}`;

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

function createPlotBase(
  container: HTMLDivElement
): D3Selection<SVGGElement, unknown, null, unknown> {
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
  plotBase: D3Selection<SVGGElement, unknown, null, undefined>,
  srcSelections: Selection[],
  dstSelections: Selection[],
  navUpDisabled: { src: boolean; dst: boolean },
  brainRegionNotationTitleMap: Map<string, string>,
  onEntryClick: (srcLabel: string | null, dstLabel: string | null) => void,
  onNavUpClick: (src: boolean, dst: boolean) => void,
  brainRegionNotationColorMap: Map<string, string>
): { x: ScaleBand<string>; y: ScaleBand<string> } {
  const { width, height } = getPlotSize(container);

  const srcLabels = srcSelections.map((selection) => getSelectionLabel(selection));
  const dstLabels = dstSelections.map((selection) => getSelectionLabel(selection));

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

  const srcLabelsContainer: D3Selection<SVGGElement, unknown, null, undefined> = plotBase
    .select('.srcLabels')
    .node()
    ? plotBase.select('.srcLabels')
    : plotBase.append('g').attr('class', 'srcLabels');

  srcLabelsContainer
    .selectAll()
    .data(srcSelections)
    .enter()
    .append('rect')
    .attr('x', () => -50)
    .attr('y', (srcSelection) => y(getSelectionLabel(srcSelection)) as number)
    // .attr('rx', 10)
    .attr('width', 50)
    .attr('height', y.bandwidth())
    .attr('title', 'test')
    .style(
      'fill',
      (srcSelection) => brainRegionNotationColorMap.get(srcSelection.brainRegionNotation) ?? 'grey'
    )
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
    .text(
      (srcSelection) => brainRegionNotationTitleMap.get(srcSelection.brainRegionNotation) as string
    );

  srcLabelsContainer
    .selectAll()
    .data(srcSelections)
    .enter()
    .append('text')
    .html((srcSelection) => {
      const { brainRegionNotation, mtype } = srcSelection;
      return mtype
        ? `<tspan x="0" dy="-0.4em">${brainRegionNotation}</tspan><tspan x="0" dy="1.2em">${mtype}</tspan>`
        : brainRegionNotation;
    })
    .attr(
      'transform',
      (srcSelection) => `translate(-25, ${y(getSelectionLabel(srcSelection)) + y.bandwidth() / 2})`
    )
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('fill', (srcSelection) =>
      textColor(brainRegionNotationColorMap.get(srcSelection.brainRegionNotation) ?? 'grey')
    )
    .style('font-size', '12px')
    .style('pointer-events', 'none');

  const dstLabelsContainer: D3Selection<SVGGElement, unknown, null, undefined> = plotBase
    .select('.dstLabels')
    .node()
    ? plotBase.select('.dstLabels')
    : plotBase.append('g').attr('class', 'dstLabels');

  dstLabelsContainer
    .selectAll()
    .data(dstSelections)
    .enter()
    .append('rect')
    .attr('x', (dstSelection) => x(getSelectionLabel(dstSelection)) as number)
    .attr('y', () => height + 1)
    // .attr('rx', 10)
    .attr('width', x.bandwidth())
    .attr('height', 50)
    .attr('title', 'test')
    .style(
      'fill',
      (dstSelection) => brainRegionNotationColorMap.get(dstSelection.brainRegionNotation) ?? 'grey'
    )
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
    .text(
      (dstSelection) => brainRegionNotationTitleMap.get(dstSelection.brainRegionNotation) as string
    );

  dstLabelsContainer
    .selectAll()
    .data(dstSelections)
    .enter()
    .append('text')
    .html((dstSelection) => {
      const { brainRegionNotation, mtype } = dstSelection;
      return mtype
        ? `<tspan x="0" dy="-0.4em">${brainRegionNotation}</tspan><tspan x="0" dy="1.2em">${mtype}</tspan>`
        : brainRegionNotation;
    })
    .attr(
      'transform',
      (dstSelection) =>
        `translate(${x(getSelectionLabel(dstSelection)) + x.bandwidth() / 2}, ${height + 25})`
    )
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .style('fill', (dstSelection) =>
      textColor(brainRegionNotationColorMap.get(dstSelection.brainRegionNotation) ?? 'grey')
    )
    .style('font-size', '12px')
    .style('pointer-events', 'none');

  return { x, y };
}

function renderVariantPlotContent(
  container: HTMLDivElement,
  plotBase: D3Selection<SVGGElement, unknown, null, undefined>,
  viewData: AggregatedVariantViewEntry[],
  brainRegionNotationTitleMap: Map<string, string>,
  scaleBand: {
    x: ScaleBand<string>;
    y: ScaleBand<string>;
  },
  onEntryClick: (srcSelection: Selection | null, dstSelection: Selection | null) => void,
  colorScale: (variantIdx: number) => string
): void {
  const tooltip: D3Selection<HTMLDivElement, unknown, null, undefined> = select(container)
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

  const hasData = (d: AggregatedVariantViewEntry): boolean =>
    Object.values(d.variantCount).reduce((sum, count) => sum + count, 0) !== 0;

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
          brainRegionNotationTitleMap
        )
      );
  };

  const onMouseleave = function onMouseleave(d) {
    tooltip.style('opacity', 0);

    select(this).style('stroke', 'none').style('opacity', 0.85);
  };

  const onEntryClickLocal = (
    srcSelection: D3Selection | null,
    dstSelection: D3Selection | null
  ) => {
    tooltip.style('opacity', 0);
    onEntryClick(srcSelection, dstSelection);
  };

  const { x, y } = scaleBand;

  const contentContainer: D3Selection<SVGGElement, unknown, null, undefined> = plotBase
    .select('.content')
    .node()
    ? plotBase.select('.content')
    : plotBase.append('g').attr('class', 'content');

  const getTreeMapData = (dataEntry: AggregatedVariantViewEntry) =>
    treemap()
      .size([x.bandwidth(), y.bandwidth()])
      .padding(0)
      .tile(treemapSlice)(
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
    .attr('transform', (d) => {
      const xVal = x(getSelectionLabel(d.dstSelection));
      const yVal = y(getSelectionLabel(d.srcSelection));

      return `translate(${xVal},${yVal})`;
    })
    .style('cursor', 'pointer')
    .on('click', (d) =>
      onEntryClickLocal(
        d.currentTarget.__data__.srcSelection,
        d.currentTarget.__data__.dstSelection
      )
    );

  primaryLevelGroupEnterSelection
    .filter((d) => !hasData(d))
    .append('rect')
    .attr('width', () => x.bandwidth())
    .attr('height', () => y.bandwidth())
    .style('opacity', 0.85)
    .style('fill', 'darkslategray');

  primaryLevelGroupEnterSelection
    .filter((d) => !hasData(d))
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
    .filter(hasData)
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
    .filter(hasData)
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
    .attr('fill', (d) => textColor(d.data.color ?? 'gray'))
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
  plotBase: D3Selection<SVGGElement, unknown, null, undefined>,
  viewData: AggregatedParamViewEntry[],
  scaleBand: {
    x: ScaleBand<string>;
    y: ScaleBand<string>;
  },
  brainRegionNotationTitleMap: Map<string, string>,
  onEntryClick: (srcSelection: Selection | null, dstSelection: Selection | null) => void,
  colorScale: (paraValue: number) => string
) {
  const { x, y } = scaleBand;

  const tooltip: D3Selection<HTMLDivElement, unknown, null, undefined> = select(container)
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
          brainRegionNotationTitleMap
        )
      );
  };

  const onMouseleave = function onMouseleave(d) {
    tooltip.style('opacity', 0);

    select(this).style('stroke', 'none').style('opacity', 0.85);
  };

  const onEntryClickLocal = (srcSelection: Selection | null, dstSelection: Selection | null) => {
    tooltip.style('opacity', 0);
    onEntryClick(srcSelection, dstSelection);
  };

  const contentContainer: D3Selection<SVGGElement, unknown, null, undefined> = plotBase
    .select('.content')
    .node()
    ? plotBase.select('.content')
    : plotBase.append('g').attr('class', 'content');

  const primaryLevelGroupEnterSelection = contentContainer
    .selectAll()
    .data(viewData)
    .enter()
    .append('g')
    .attr('transform', (d) => {
      const xVal = x(getSelectionLabel(d.dstSelection));
      const yVal = y(getSelectionLabel(d.srcSelection));

      return `translate(${xVal},${yVal})`;
    })
    .style('cursor', 'pointer')
    .on('click', (d) =>
      onEntryClickLocal(
        d.currentTarget.__data__.srcSelection,
        d.currentTarget.__data__.dstSelection
      )
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
  srcSelections,
  dstSelections,
  navUpDisabled,
  brainRegionNotationTitleMap,
  viewData,
  colorScale,
  onEntryClick,
  onNavUpClick,
  brainRegionNotationColorMap,
}: RenderVariantPlotArg) {
  const plotBase = createPlotBase(container);

  const { x, y } = createPlotAxis(
    container,
    plotBase,
    srcSelections,
    dstSelections,
    navUpDisabled,
    brainRegionNotationTitleMap,
    onEntryClick,
    onNavUpClick,
    brainRegionNotationColorMap
  );

  renderVariantPlotContent(
    container,
    plotBase,
    viewData,
    brainRegionNotationTitleMap,
    { x, y },
    onEntryClick,
    colorScale
  );
}

type RenderParamPlotArg = RenderFnBaseArgs & Omit<MicroConnectomeParamPlotProps, 'type'>;

function renderParamPlot({
  container,
  srcSelections,
  dstSelections,
  navUpDisabled,
  brainRegionNotationTitleMap,
  viewData,
  colorScale,
  onEntryClick,
  onNavUpClick,
  brainRegionNotationColorMap,
}: RenderParamPlotArg): void {
  const plotBase = createPlotBase(container);

  const { x, y } = createPlotAxis(
    container,
    plotBase,
    srcSelections,
    dstSelections,
    navUpDisabled,
    brainRegionNotationTitleMap,
    onEntryClick,
    onNavUpClick,
    brainRegionNotationColorMap
  );

  renderParamPlotContent(
    container,
    plotBase,
    viewData,
    { x, y },
    brainRegionNotationTitleMap,
    onEntryClick,
    colorScale
  );
}

export default function MicroConnectomePlot({
  type,
  srcSelections,
  dstSelections,
  navUpDisabled,
  brainRegionNotationTitleMap,
  viewData,
  colorScale,
  onEntryClick,
  onNavUpClick,
  brainRegionNotationColorMap,
}: MicroConnectomePlotProps) {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!srcSelections?.length || !dstSelections?.length || !viewData) return;

    const container = plotRef.current as HTMLDivElement;

    const renderPlotArg = {
      container,
      srcSelections,
      dstSelections,
      navUpDisabled,
      brainRegionNotationTitleMap,
      viewData,
      colorScale,
      onEntryClick,
      onNavUpClick,
      brainRegionNotationColorMap,
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
    srcSelections,
    dstSelections,
    brainRegionNotationTitleMap,
    viewData,
    colorScale,
    onEntryClick,
    type,
    brainRegionNotationColorMap,
    onNavUpClick,
    navUpDisabled,
  ]);

  return <div className="h-full" ref={plotRef} />;
}
