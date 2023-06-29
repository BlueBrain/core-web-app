import {
  Object3D as ThreeObject3D,
  Color as ThreeColor,
  MeshPhongMaterial as ThreeMeshPhongMaterial,
  DoubleSide as ThreeDoubleSide,
  Box3 as ThreeBox3,
  Sphere as ThreeSphere,
  Vector3 as ThreeVector3,
} from 'three';

import { ConvexBufferGeometry } from './ConvexGeometry';
import WormBufferGeometry from './WormBufferGeometry';
import simplify from './simplify';

// const CELL_PART_NAMES = {
//   AXON: 'axon',
//   BASAL_DENDRITE: 'basal_dendrite',
//   APICAL_DENDRITE: 'apical_dendrite',
// }

/**
 * This is the base class for `MorphologyPolyline` and `MorphologyPolycylinder`.
 * It handles the common features, mainly related to soma creation
 */
export default class MorphologyHybrid extends ThreeObject3D {
  /**
   * @constructor
   * Builds a moprho as a polyline
   * @param {Object} morpho - raw object that describes a morphology (usually straight from a JSON file)
   * @param {object} options - the option object
   * @param {Number} options.color - the color of the polyline.
   * If provided, the whole neurone will be of the given color, if not provided,
   * the axon will be green, the basal dendrite will be red and the apical dendrite will be green
   */
  constructor(morpho, options = {}) {
    super();

    this._smoothSections = new ThreeObject3D();
    this._polylineSections = new ThreeObject3D();
    this._polylineSimpleSections = new ThreeObject3D();
    this._boundingSphere = null;

    this.add(this._polylineSections);
    this.add(this._smoothSections);
    this.add(this._polylineSimpleSections);

    this.userData.morphologyName = options.name;
    this._morpho = morpho;
    this._pointToTarget = this._morpho.getSoma().getCenter();

    // fetch the optional color
    const color = options.color ? options.color : null;

    // simple color lookup, so that every section type is shown in a different color
    this._sectionColors = {
      soma: new ThreeColor(color || 0x888888),
      axon: new ThreeColor(color || 0x1111ff),
      basal_dendrite: new ThreeColor(color || 0xff1111),
      apical_dendrite: new ThreeColor(color || 0xf442ad),
    };

    const shininess = 100;
    this._sectionTubeMaterials = {
      soma: new ThreeMeshPhongMaterial({
        color: this._sectionColors.soma,
        transparent: true,
        side: ThreeDoubleSide,
        shininess,
      }),
      axon: new ThreeMeshPhongMaterial({
        color: this._sectionColors.axon,
        transparent: true,
        side: ThreeDoubleSide,
        shininess,
      }),
      basal_dendrite: new ThreeMeshPhongMaterial({
        color: this._sectionColors.basal_dendrite,
        transparent: true,
        side: ThreeDoubleSide,
        shininess,
      }),
      apical_dendrite: new ThreeMeshPhongMaterial({
        color: this._sectionColors.apical_dendrite,
        transparent: true,
        side: ThreeDoubleSide,
        shininess,
      }),
    };

    if (options.neuriteMode) {
      this.enableMode(options.neuriteMode);
    } else {
      this.enableMode('simple');
    }

    // adding the soma (even when there is no soma data)
    this._somaFromModel = this._buildSomaFromModel();
    this.add(this._somaFromModel);
    this._somaFromOrphanSections = this._buildSomaFromOrphanSections();
    this.add(this._somaFromOrphanSections);

    if (options.somaMode) {
      this.enableSomaMode(options.somaModel);
    } else {
      this.enableSomaMode('fromModel');
    }

    // compute the bounding box, useful for further camera targeting
    this.box = new ThreeBox3().setFromObject(this);
  }

  get boundingSphere() {
    if (this._boundingSphere) {
      return this._boundingSphere;
    }

    let somaCenter = null;
    try {
      somaCenter = this._morpho.getSoma().getCenter();
    } catch (e) {
      return null;
    }
    const maxDistance = this._morpho.getRadiusFromSoma();

    this._boundingSphere = new ThreeSphere(new ThreeVector3(...somaCenter), maxDistance);
    return this._boundingSphere;
  }

  _createTubularSections() {
    if (this._smoothSections.children.length > 0) {
      return;
    }

    const sections = this._morpho.getArrayOfSections();

    // creating a tubular mesh for each section
    for (let i = 0; i < sections.length; i += 1) {
      const sectionSmooth = this._buildWormSection(sections[i]);
      if (sectionSmooth) {
        this._smoothSections.add(sectionSmooth);
      }
    }
  }

  _createLineSections(model) {
    const lookup = {
      polyline: { store: this._polylineSections, simplify: false },
      line: { store: this._polylineSections, simplify: false },
      simple: { store: this._polylineSimpleSections, simplify: true },
    };
    const sectionInfo = lookup[model.trim().toLowerCase()];

    if (!sectionInfo) {
      return;
    }

    const sectionArray = sectionInfo.store;

    if (sectionArray.children.length > 0) {
      return;
    }

    const sections = this._morpho.getArrayOfSections();

    // creating a polyline for each section
    for (let i = 0; i < sections.length; i += 1) {
      const sectionSimplePolyline = this._buildLineSection(sections[i], {
        simplify: sectionInfo.simplify,
      });
      if (sectionSimplePolyline) {
        sectionArray.add(sectionSimplePolyline);
      }
    }
  }

  /**
   * @private
   * The method to build a soma mesh using the 'default' way, aka using simply the
   * data from the soma.
   * @return {ThreeMesh} the soma mesh
   */
  _buildSomaFromModel() {
    const soma = this._morpho.getSoma();
    const somaPoints = soma.getPoints();

    // case when soma is a single point
    if (somaPoints.length === 1) {
      const somaSphere = new ThreeMesh(
        new ThreeSphereGeometry(soma.getRadius(), 32, 32),
        new ThreeMeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
      );

      somaSphere.position.set(somaPoints[0][0], somaPoints[0][1], somaPoints[0][2]);
      return somaSphere;

      // this is a 3-point soma, probably colinear
    }
    if (somaPoints.length === 3) {
      const somaSphere = new ThreeMesh(
        new ThreeSphereGeometry(soma.getRadius(), 32, 32),
        new ThreeMeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 })
      );

      somaSphere.position.set(somaPoints[0][0], somaPoints[0][1], somaPoints[0][2]);
      return somaSphere;

      // when soma is multiple points
    }
    if (somaPoints.length > 1) {
      // compute the average of the points
      const center = soma.getCenter();
      const centerV = new ThreeVector3(center[0], center[1], center[2]);
      const geometry = new ThreeGeometry();

      for (let i = 0; i < somaPoints.length; i += 1) {
        geometry.vertices.push(
          new ThreeVector3(somaPoints[i][0], somaPoints[i][1], somaPoints[i][2]),
          new ThreeVector3(
            somaPoints[(i + 1) % somaPoints.length][0],
            somaPoints[(i + 1) % somaPoints.length][1],
            somaPoints[(i + 1) % somaPoints.length][2]
          ),
          centerV
        );
        geometry.faces.push(new ThreeFace3(3 * i, 3 * i + 1, 3 * i + 2));
      }

      const somaMesh = new ThreeMesh(
        geometry,
        new ThreeMeshBasicMaterial({
          color: 0x000000,
          transparent: true,
          opacity: 0.3,
          side: ThreeDoubleSide,
        })
      );
      return somaMesh;
    }
    console.warn('No soma defined');
    return null;
  }

  /**
   * @private
   * Here we build a soma convex polygon based on the 1st points of the orphan
   * sections + the points available in the soma description
   * @return {ThreeMesh} the soma mesh
   */
  _buildSomaFromOrphanSections() {
    const somaPoints = this._morpho.getSoma().getPoints();
    let somaMesh = null;

    try {
      const somaPolygonPoints = this._morpho.getNeuriteStarts().map((p) => new ThreeVector3(...p));

      // adding the points of the soma (adds values mostly if we a soma polygon)
      for (let i = 0; i < somaPoints.length; i += 1) {
        somaPolygonPoints.push(new ThreeVector3(...somaPoints[i]));
      }

      const geometry = new ConvexBufferGeometry(somaPolygonPoints);
      const material = new ThreeMeshPhongMaterial({
        color: 0x555555,
        transparent: true,
        opacity: 0.7,
        side: ThreeDoubleSide,
      });
      somaMesh = new ThreeMesh(geometry, material);
      return somaMesh;
    } catch (e) {
      return null;
    }
  }

  /**
   * Get the point to target when using the method lookAt. If the soma is valid,
   * this will be the center of the soma. If no soma is valid, it will be the
   * center of the box
   * @return {Array} center with the shape [x: Number, y: Number, z: Number]
   */
  getTargetPoint() {
    if (this._pointToTarget) {
      // rotate this because Allen needs it (just like the sections)
      const lookat = new ThreeVector3(
        this._pointToTarget[0],
        this._pointToTarget[1],
        this._pointToTarget[2]
      );
      lookat.applyAxisAngle(new ThreeVector3(1, 0, 0), Math.PI);
      lookat.applyAxisAngle(new ThreeVector3(0, 1, 0), Math.PI);
      return lookat;
    }
    const center = new ThreeVector3();
    this.box.getCenter(center);
    return center;
  }

  /**
   * Get the morphology object tied to _this_ mesh
   * @return {morphologycorejs.Morphology}
   */
  getMorphology() {
    return this._morpho;
  }

  _buildWormSection(section) {
    const material = this._sectionTubeMaterials[section.getTypename()];
    const sectionPoints = section.getPoints();
    const sectionRadius = section.getRadiuses().slice();
    const startIndex = section.getParent() ? 0 : 1;

    if (sectionPoints.length - startIndex < 2) return null;

    const positions = sectionPoints.map((arr) => new ThreeVector3(arr[0], arr[1], arr[2]));

    const parentSection = section.getParent();

    if (parentSection) {
      const parentSectionPoints = parentSection.getPoints();
      if (parentSectionPoints.length > 2) {
        const lastPoint = parentSectionPoints[parentSectionPoints.length - 2];
        const parentSectionRadiuses = parentSection.getRadiuses();
        const lastRadius = parentSectionRadiuses[parentSectionRadiuses.length - 2];

        positions.unshift(new ThreeVector3(...lastPoint));
        sectionRadius.unshift(lastRadius);
      }
    }

    const sectionGeom = new WormBufferGeometry(positions, sectionRadius);
    const sectionMesh = new ThreeMesh(sectionGeom, material);

    // adding some metadata as it can be useful for raycasting
    sectionMesh.name = section.getId();
    sectionMesh.userData.sectionId = section.getId();
    sectionMesh.userData.typevalue = section.getTypevalue();
    sectionMesh.userData.typename = section.getTypename();

    return sectionMesh;
  }

  _buildLineSection(section, options = {}) {
    const mustSimplify = 'simplify' in options ? !!options.simplify : false;
    const sectionColor = this._sectionColors[section.getTypename()];
    const material = new ThreeLineBasicMaterial({
      color: 0xffffff,
      vertexColors: true,
    });

    const sectionPoints = mustSimplify
      ? simplify(section.getPoints(), 10, true)
      : section.getPoints();

    if (sectionPoints.length < 2) return null;

    const geometry = new ThreeBufferGeometry();
    const vertices = [];
    const colors = [];
    const neuriteColors = [];

    for (let i = 0; i < sectionPoints.length; i += 1) {
      vertices.push(
        sectionPoints[i][0], // x
        sectionPoints[i][1], // y
        sectionPoints[i][2] // z
      );
      colors.push(sectionColor.r, sectionColor.g, sectionColor.b);
      neuriteColors.push(sectionColor.r, sectionColor.g, sectionColor.b);
    }

    geometry.setAttribute('position', new ThreeBufferAttribute(new Float32Array(vertices), 3));
    geometry.setAttribute('color', new ThreeBufferAttribute(new Float32Array(colors), 3));
    geometry.setAttribute(
      'neuriteColors',
      new ThreeBufferAttribute(new Float32Array(neuriteColors), 3)
    );

    const line = new ThreeLine(geometry, material);

    // adding some metadata as it can be useful for raycasting
    line.name = section.getId();
    line.userData.sectionId = section.getId();
    line.userData.typevalue = section.getTypevalue();
    line.userData.typename = section.getTypename();

    return line;
  }

  updateLineColors(model, colorFunction) {
    const lookup = {
      polyline: this._polylineSections,
      line: this._polylineSections,
      simple: this._polylineSimpleSections,
    };

    const sectionArray = lookup[model.trim().toLowerCase()];

    if (!sectionArray) {
      return;
    }

    for (let i = 0; i < sectionArray.children.length; i += 1) {
      const line = sectionArray.children[i];
      const rgbArray = line.geometry.attributes.color.array;
      const xyzArray = line.geometry.attributes.position.array;
      for (let j = 0; j < rgbArray.length; j += 3) {
        const c = rgbArray.subarray(j, j + 3);
        colorFunction(c, xyzArray.subarray(j, j + 3));
      }
      line.geometry.attributes.color.needsUpdate = true;
    }
  }

  applyNeuriteColors(model) {
    const lookup = {
      polyline: this._polylineSections,
      line: this._polylineSections,
      simple: this._polylineSimpleSections,
    };
    const sectionArray = lookup[model.trim().toLowerCase()];

    if (!sectionArray) {
      return;
    }

    for (let i = 0; i < sectionArray.children.length; i += 1) {
      const line = sectionArray.children[i];
      const colors = line.geometry.attributes.color.array;
      const neuriteColors = line.geometry.attributes.neuriteColors.array;
      colors.set(neuriteColors);

      line.geometry.attributes.color.needsUpdate = true;
    }
  }

  setSmoothOpacity(a) {
    this._smoothSections.children.forEach((mesh) => {
      mesh.material.opacity = a;
    });
  }

  setSmoothVisibility(v) {
    this._smoothSections.visible = v;
  }

  setPolylineVisibility(v) {
    this._polylineSections.visible = v;
  }

  /**
   * Select the display mode for the neurite
   * @param {string} mode - can be 'line' (or 'polyline') and 'smooth'
   */
  enableMode(mode) {
    this._neuriteModeName = mode;
    if (mode === 'smooth') {
      this._createTubularSections();
      this._smoothSections.visible = true;
      this._polylineSections.visible = false;
      this._polylineSimpleSections.visible = false;
    } else if (mode === 'polyline' || mode === 'line') {
      // this._createPolylineSections()
      this._createLineSections(mode);
      this._smoothSections.visible = false;
      this._polylineSections.visible = true;
      this._polylineSimpleSections.visible = false;
    } else if (mode === 'simple') {
      // this._createSimplifiedSections()
      this._createLineSections(mode);
      this._smoothSections.visible = false;
      this._polylineSections.visible = false;
      this._polylineSimpleSections.visible = true;
    }
  }

  getNeuriteModename() {
    return this._neuriteModeName;
  }

  /**
   * Select the display mode for the soma
   * @param {sting} mode - can be 'fromOrphanSections', 'fromModel' or 'hidden'
   */
  enableSomaMode(mode) {
    this._somaModeName = mode;
    if (mode === 'fromOrphanSections') {
      try {
        this._somaFromOrphanSections.visible = true;
      } catch (e) {}
      try {
        this._somaFromModel.visible = false;
      } catch (e) {}
    } else if (mode === 'fromModel') {
      try {
        this._somaFromOrphanSections.visible = false;
      } catch (e) {}
      try {
        this._somaFromModel.visible = true;
      } catch (e) {}
    } else if (mode === 'hidden') {
      try {
        this._somaFromOrphanSections.visible = false;
      } catch (e) {}
      try {
        this._somaFromModel.visible = false;
      } catch (e) {}
    }
  }

  getSomaModeName() {
    return this._somaModeName;
  }
}
