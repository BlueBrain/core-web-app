import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';
import * as d3Zoom from 'd3-zoom';

function intern(value) {
  return value !== null && typeof value === 'object' ? value.valueOf() : value;
}

/**
 * Returns a zoom event callback.
 * @param {HTMLElement} g - The SVG "group" to apply the zoom to.
 */
function getZoomed(g) {
  return (event) => {
    const { transform } = event;

    g.attr('transform', transform);
    g.attr('stroke-width', 1 / transform.k);

    return transform.k;
  };
}

// https://observablehq.com/@d3/sankey
// Modified to use a React.refObject.
export default function sankey(
  ref,
  onZoom,
  {
    links, // an iterable of node objects (typically [{id}, …]); implied by links if missing
    nodes, // an iterable of link objects (typically [{source, target}, …])
  },
  {
    format = ',', // a function or format specifier for values in titles
    align = 'justify', // convenience shorthand for nodeAlign
    nodeColorScale,
    nodeId = (d) => d.id, // given d in nodes, returns a unique identifier (string)
    nodeGroups = (d) => d.id, // an array of ordinal values representing the node groups
    nodeLabel, // given d in (computed) nodes, text to label the associated rect
    nodeTitle = (d) => `${d.id}\n${format(d.value)}`, // given d in (computed) nodes, hover text
    nodeAlign = align, // Sankey node alignment strategy: left, right, justify, center
    nodeWidth = 15, // width of node rects
    nodePadding = 10, // vertical separation between adjacent nodes
    nodeLabelPadding = 6, // horizontal separation between node and label
    nodeStroke = 'currentColor', // stroke around node rects
    nodeStrokeWidth, // width of stroke around node rects, in pixels
    nodeStrokeOpacity, // opacity of stroke around node rects
    nodeStrokeLinejoin, // line join for stroke around node rects
    linkSource = ({ source }) => source, // given d in links, returns a node identifier string
    linkTarget = ({ target }) => target, // given d in links, returns a node identifier string
    linkValue = ({ value }) => value, // given d in links, returns the quantitative value
    linkPath = d3Sankey.sankeyLinkHorizontal(), // given d in (computed) links, returns the SVG path
    linkTitle = (d) => `${d.source.id} → ${d.target.id}\n${format(d.value)}`, // given d in (computed) links
    linkColor = 'source-target', // source, target, source-target, or static color
    linkStrokeOpacity = 0.5, // link stroke opacity
    linkMixBlendMode = 'multiply', // link blending mode
    colors = d3.schemeTableau10, // array of colors
    width = 640, // outer width, in pixels
    height = 300, // outer height, in pixels
    marginTop = 5, // top margin, in pixels
    marginRight = 1, // right margin, in pixels
    marginBottom = 5, // bottom margin, in pixels
    marginLeft = 1, // left margin, in pixels
  }
) {
  // Convert nodeAlign from a name to a function (since d3-sankey is not part of core d3).
  if (typeof nodeAlign !== 'function')
    nodeAlign = // eslint-disable-line no-param-reassign
      {
        left: d3Sankey.sankeyLeft,
        right: d3Sankey.sankeyRight,
        center: d3Sankey.sankeyCenter,
      }[nodeAlign] ?? d3Sankey.sankeyJustify;

  // Compute values.
  const LS = d3.map(links, linkSource).map(intern);
  const LT = d3.map(links, linkTarget).map(intern);
  const LV = d3.map(links, linkValue);
  if (nodes === undefined) nodes = Array.from(d3.union(LS, LT), (id) => ({ id })); // eslint-disable-line no-param-reassign
  const N = d3.map(nodes, nodeId).map(intern);

  // Replace the input nodes and links with mutable objects for the simulation.
  nodes = d3.map(nodes, ({ id, label }) => ({ id, label })); // eslint-disable-line no-param-reassign
  links = d3.map(links, (_, i) => ({ source: LS[i], target: LT[i], value: LV[i] })); // eslint-disable-line no-param-reassign

  // Ignore a group-based linkColor option if no groups are specified.
  if (!['source', 'target', 'source-target'].includes(linkColor)) linkColor = 'currentColor'; // eslint-disable-line no-param-reassign

  // Construct the scales.
  const color = nodeColorScale ? nodeColorScale : d3.scaleOrdinal(nodeGroups, colors);

  // Compute the Sankey layout.
  d3Sankey
    .sankey()
    .nodeId(({ index: i }) => N[i])
    .nodeAlign(nodeAlign)
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    .extent([
      [marginLeft, marginTop],
      [width - marginRight, height - marginBottom],
    ])({ nodes, links });

  // Compute titles and labels using layout nodes, so as to access aggregate values.
  if (typeof format !== 'function') format = d3.format(format); // eslint-disable-line no-param-reassign
  const Tl = nodeLabel === undefined ? N : nodeLabel == null ? null : d3.map(nodes, nodeLabel); // eslint-disable-line no-nested-ternary
  const Tt = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
  const Lt = linkTitle == null ? null : d3.map(links, linkTitle);

  const uid = `O-${Math.random().toString(16).slice(2)}`;

  const svg = d3
    .select(ref.current)
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    /*
      The `will-change: opacity` is applied here to move the SVG element into its own layer
      in order to fix page flickering in Chrome on devices using Apple silicon,
      see https://bbpteam.epfl.ch/project/issues/browse/BBPP134-109.

      The root cause is still unknown.
    */
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic; will-change: opacity;');

  const zoomWrapper = svg.append('g');

  const node = zoomWrapper
    .append('g')
    .attr('stroke', nodeStroke)
    .attr('stroke-width', nodeStrokeWidth)
    .attr('stroke-opacity', nodeStrokeOpacity)
    .attr('stroke-linejoin', nodeStrokeLinejoin)
    .selectAll('rect')
    .data(nodes)
    .join('rect')
    .attr('x', (d) => d.x0)
    .attr('y', (d) => d.y0)
    .attr('height', (d) => d.y1 - d.y0)
    .attr('width', (d) => d.x1 - d.x0);

  node.attr('fill', ({ id }) => color(id));

  if (Tt) node.append('title').text(({ index: i }) => Tt[i]);

  const link = zoomWrapper
    .append('g')
    .attr('fill', 'none')
    .attr('stroke-opacity', linkStrokeOpacity)
    .selectAll('g')
    .data(links)
    .join('g')
    .style('mix-blend-mode', linkMixBlendMode);

  if (linkColor === 'source-target')
    link
      .append('linearGradient')
      .attr('id', (d) => d.id)
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', (d) => d.source.x1)
      .attr('x2', (d) => d.target.x0)
      .call((gradient) =>
        gradient
          .append('stop')
          .attr('offset', '0%')
          .attr('stop-color', ({ source: { id } }) => color(id))
      )
      .call((gradient) =>
        gradient
          .append('stop')
          .attr('offset', '100%')
          .attr('stop-color', ({ target: { id } }) => color(id))
      );

  link
    .append('path')
    .attr('d', linkPath)
    .attr(
      'stroke',
      linkColor === 'source-target' // eslint-disable-line no-nested-ternary
        ? (d) => `url(#${uid}-link-${d.index})`
        : linkColor === 'source' // eslint-disable-line no-nested-ternary
        ? ({ source: { id } }) => color(id)
        : linkColor === 'target'
        ? ({ target: { id } }) => color(id)
        : linkColor
    )
    .attr('stroke-width', ({ width: strokeWidth }) => Math.max(1, strokeWidth))
    .call(Lt ? (path) => path.append('title').text(({ index: i }) => Lt[i]) : () => {});

  if (Tl)
    zoomWrapper
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', (d) => (d.x0 < width / 2 ? d.x1 + nodeLabelPadding : d.x0 - nodeLabelPadding))
      .attr('y', (d) => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d) => (d.x0 < width / 2 ? 'start' : 'end'))
      .text(({ index: i }) => Tl[i]);

  const zoomed = getZoomed(zoomWrapper);
  const zoom = d3Zoom
    .zoom()
    .scaleExtent([1, 10])
    .on('zoom', (x) => {
      const k = zoomed(x); // Perform zoom, then return the zoom value.

      onZoom(k);
    });

  svg.call(zoom);

  return Object.assign(svg.node(), {
    reset: () => {
      svg
        .transition()
        .duration(750)
        .call(
          zoom.transform,
          d3.zoomIdentity,
          d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
        );
    },
    scales: { color },
    zoom: (value) => svg.transition().call(zoom.scaleTo, value),
  });
}
