/*
 (c) 2013, Vladimir Agafonkin
 Simplify.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js
*/

// to suit your point format, run search/replace for '[0]', '[1]' and '[2]';
// (configurability would draw significant performance overhead)

// square distance between 2 points
function getSquareDistance(p1, p2) {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  const dz = p1[2] - p2[2];

  return dx * dx + dy * dy + dz * dz;
}

// square distance from a point to a segment
function getSquareSegmentDistance(p, p1, p2) {
  let x = p1[0];
  let y = p1[1];
  let z = p1[2];
  let dx = p2[0] - x;
  let dy = p2[1] - y;
  let dz = p2[2] - z;

  if (dx !== 0 || dy !== 0 || dz !== 0) {
    const t = ((p[0] - x) * dx + (p[1] - y) * dy + (p[2] - z) * dz) / (dx * dx + dy * dy + dz * dz);

    if (t > 1) {
      [x, y, z] = p2;
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
      z += dz * t;
    }
  }

  dx = p[0] - x;
  dy = p[1] - y;
  dz = p[2] - z;

  return dx * dx + dy * dy + dz * dz;
}
// the rest of the code doesn't care for the point format

// basic distance-based simplification
function simplifyRadialDistance(points, sqTolerance) {
  let prevPoint = points[0];
  const newPoints = [prevPoint];
  let point;

  for (let i = 1, len = points.length; i < len; i += 1) {
    point = points[i];

    if (getSquareDistance(point, prevPoint) > sqTolerance) {
      newPoints.push(point);
      prevPoint = point;
    }
  }

  if (prevPoint !== point) {
    newPoints.push(point);
  }

  return newPoints;
}

// simplification using optimized Douglas-Peucker algorithm with recursion elimination
function simplifyDouglasPeucker(points, sqTolerance) {
  const len = points.length;
  const MarkerArray = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
  const markers = new MarkerArray(len);
  let first = 0;
  let last = len - 1;
  const stack = [];
  const newPoints = [];
  let i;
  let maxSqDist;
  let sqDist;
  let index;

  markers[first] = 1;
  markers[last] = 1;

  while (last) {
    maxSqDist = 0;

    for (i = first + 1; i < last; i += 1) {
      sqDist = getSquareSegmentDistance(points[i], points[first], points[last]);

      if (sqDist > maxSqDist) {
        index = i;
        maxSqDist = sqDist;
      }
    }

    if (maxSqDist > sqTolerance) {
      markers[index] = 1;
      stack.push(first, index, index, last);
    }

    last = stack.pop();
    first = stack.pop();
  }

  for (i = 0; i < len; i += 1) {
    if (markers[i]) {
      newPoints.push(points[i]);
    }
  }

  // const firstOriginal = points[0]
  // const firstSimplified = newPoints[0]
  // if (firstOriginal[0] === firstSimplified[0]
  // && firstOriginal[1] === firstSimplified[1]
  // && firstOriginal[2] === firstSimplified[2] ) {
  //   console.log('SAME')
  // } else {
  //   console.log('NOT SAME')
  // }
  // newPoints.unshift(points[0])
  return newPoints;
}

// both algorithms combined for awesome performance
export default function simplify(points, tolerance, highestQuality) {
  const sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;
  let newPoints = points;

  newPoints = highestQuality ? points : simplifyRadialDistance(points, sqTolerance);
  newPoints = simplifyDouglasPeucker(points, sqTolerance);

  return newPoints;
}
