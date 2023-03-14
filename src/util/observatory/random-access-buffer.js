/* eslint-disable no-undef */
import pako from 'pako';
import yaml from 'js-yaml';

const IO_MODE = {
  READ: 'READ',
  WRITE: 'WRITE',
};

const MAGIC_NUMBER = 'rab';
const TYPES = {
  BUFFER: 'bytes',
  OBJECT: 'object',
  TEXT: 'text',
  NUMERICALS: [
    'bool',
    'int8',
    'uint8',
    'int16',
    'uint16',
    'int32',
    'uint32',
    'int64',
    'uint64',
    'float16',
    'float32',
    'float64',
    'complex64',
    'complex128',
  ],
};

const BYTES_PER_TYPE = {
  bool: 1,
  int8: 1,
  uint8: 1,
  int16: 2,
  uint16: 2,
  int32: 4,
  uint32: 4,
  int64: 8,
  uint64: 8,
  float16: 2,
  float32: 4,
  float64: 8,
  complex64: 8,
  complex128: 16,
};

// DataViews in JS expose method such as getUint8(), getUint16(), setUint8(), setUint16()...
const DATAVIEW_GETTERS_PER_TYPE = {
  bool: 'getUint8',
  int8: 'getInt8',
  uint8: 'getUint8',
  int16: 'getInt16',
  uint16: 'getUint16',
  int32: 'getInt32',
  uint32: 'getUint32',
  int64: 'getBigInt64',
  uint64: 'getBigUint64',
  float16: null,
  float32: 'getFloat32',
  float64: 'getFloat64',
  complex64: null,
  complex128: null,
};

const TYPED_ARRAYS_PER_TYPE = {
  bool: Uint8Array,
  int8: Int8Array,
  uint8: Uint8Array,
  int16: Int16Array,
  uint16: Uint16Array,
  int32: Int32Array,
  uint32: Uint32Array,
  int64: null,
  uint64: null,
  float16: null,
  float32: Float32Array,
  float64: Float64Array,
  complex64: null,
  complex128: null,
};

try {
  TYPED_ARRAYS_PER_TYPE.int64 = BigInt64Array;
  TYPED_ARRAYS_PER_TYPE.uint64 = BigUint64Array;
} catch (e) {
  console.error('This platform is not compatible with 64 bits integers.');
}

// endianness flags as they are used in RAB files
const ENDIANNESS_FLAG = {
  LITTLE: 'little',
  BIG: 'big',
};

// get the endianness of the current platform
function getPlatformEndianness() {
  let a = new Uint32Array([0x12345678]);
  let b = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
  return b[0] != 0x12 ? ENDIANNESS_FLAG.LITTLE : ENDIANNESS_FLAG.BIG;
}

/**
 * An instance of RandomAccessBuffer is used to decode RandomAccessBuffer files (usually with extension .rab)
 * @class
 */
class RandomAccessBuffer {
  constructor() {
    this._ioMode = null;
    this._rawBuff = null;
    this._dataView = null;
    this._rabIndex = [];
    this._dataByteOffset = null;
    this._filepath = null; // for reading
    this._onDone = null;
  }

  onDone(cb) {
    if (typeof cb === 'function') {
      this._onDone = cb;
    }
  }

  /**
   * Parse the raw buffer of a RAB file.
   * Note: in the original Python version as well as in the (future) Node version, the parse()
   * method is replaced by a read() method because of the easy capability for those two to access
   * the file system directly.
   *
   * @param {ArrayBuffer} buff - The buffer of a RAB file
   */
  parse(buff) {
    if (this._ioMode === IO_MODE.WRITE) {
      throw new Error('This RandomAccessBuffer instance is accessible only in WRITE mode.');
    }

    // checking the magic number
    if (String.fromCharCode.apply(null, new Uint8Array(buff, 0, 3)) !== MAGIC_NUMBER) {
      throw new Error('The buffer provided is not from a valid RandomAccessBuffer file.');
    }

    // init some basics
    this._ioMode = IO_MODE.READ;
    this._rawBuff = buff;
    this._dataView = new DataView(buff);

    let headerBytelength = this._dataView.getUint32(3, true);
    let headerByteOffset = 4 + MAGIC_NUMBER.length; // the 4 is because the header length is a uint32

    const textIndex = new TextDecoder().decode(
      new Uint8Array(buff, headerByteOffset, headerBytelength)
    );

    // parsing as yaml, though RAB was originally using JSON so we back on that if yaml fails
    // (it should not cause yaml 1.2 is a superset of JSON, minus the tabs)
    try {
      this._rabIndex = yaml.load(textIndex);
    } catch (e) {
      this._rabIndex = JSON.parse(textIndex);
    }
    this._dataByteOffset = headerByteOffset + headerBytelength;
  }

  // TODO with encoder
  // deleteDataset(datasetName){ throw Error('This feature is not implemented yet.')}

  // TODO with encoder
  // addObject(datasetName, data, options)

  // TODO with encoder
  // addNumericalDataset(datasetName, data, options)
  // /!\ Numpy strides are in bytes

  // TODO with encoder
  // addBuffer(datasetName, data, options)

  // TODO with encoder
  // addText(datasetName, data, options)

  // TODO with encoder
  // addDataset(datasetName, data, options)

  // TODO with encoder
  // _computeStrides(codecMeta)

  // TODO with encoder
  // _updateOffsets()

  // TODO with encoder, though most likely replace by a prepare/build method
  // write()

  /**
   * Tells whether a dataset exists or not
   * @param {string} datasetName - The name of a dataset that may or may not exist
   * @return {boolean}
   */
  hasDataset(datasetName) {
    try {
      this._getEntry(datasetName);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * List all the datasets IDs present in this RAB.
   * @return {Array<string>}
   */
  listDatasets() {
    return this._rabIndex.map((entry) => entry.name);
  }

  /**
   * Get the total byte size of all the cumulated datasets in this RAB
   * @return {number}
   */
  getTotalByteSize() {
    let total = 0;
    this._rabIndex.forEach((entry) => (total += entry.codecMeta.byteLength));
    return total;
  }

  /**
   * @private
   * Get a copy of the bytes that corresponds to a dataset.
   * @param {Object} codecMeta
   * @return {ArrayBuffer}
   */
  _getDatasetAsByte(codecMeta) {
    let byteOffset = this._dataByteOffset + codecMeta.byteOffset;
    let subBuffer = this._rawBuff.slice(byteOffset, byteOffset + codecMeta.byteLength);

    if ('compression' in codecMeta && codecMeta.compression === 'gzip') {
      subBuffer = pako.inflate(subBuffer).buffer;
    }

    return subBuffer;
  }

  /**
   * @private
   * Extract a numerical dataset from the RAB, including the the numerical data, the array of sizes (even if 1D)
   * and the array of strides (even if 1D).
   * Note that the size and strides are relevant only if the dataset is multidimensional, Then, the values are
   * arranged from the slowest varying (first) to the fastest varying (last), which is the native C order and
   * also the default in Numpy.
   * @param {Object} codecMeta
   * @return {Object} Of shape {numericalData: TypedArray, shape: Array, strides: Array}
   */
  _getNumericalDataset(codecMeta) {
    if (!TYPED_ARRAYS_PER_TYPE[codecMeta.type]) {
      throw new Error(
        `The datatype to be decoded (${codecMeta.type}) is not availble on this platform.`
      );
    }

    let buffer = this._getDatasetAsByte(codecMeta);
    let numericalData = null;

    // If the platform has the same endianness as what is encoded in this dataset,
    // then we can leverage the convenience of simply getting the buffer and
    // instanciate a typed array with it.
    if (getPlatformEndianness() === codecMeta.endianness) {
      numericalData = new TYPED_ARRAYS_PER_TYPE[codecMeta.type](buffer);
    }

    // Otherwise, if platform endianness is different from the dataset, we have to
    // use the view to force read in the non-native endianess.
    // This copies the buffer another time so it's not the best, but most platform
    // are little endian (Intel) so this should not happen too often.
    else {
      let isLittleEndian = codecMeta.endianness === ENDIANNESS_FLAG.LITTLE;
      let bytesPerElement = BYTES_PER_TYPE[codecMeta.type];
      let numberOfElements = codecMeta.byteLength / bytesPerElement;
      numericalData = new TYPED_ARRAYS_PER_TYPE[codecMeta.type](numberOfElements);
      let view = new DataView(buffer);
      let viewGetterName = DATAVIEW_GETTERS_PER_TYPE[codecMeta.type];
      for (let i = 0; i < numberOfElements; i++) {
        numericalData[i] = view[viewGetterName](i * bytesPerElement, isLittleEndian);
      }
    }

    return {
      numericalData: numericalData,
      shape: codecMeta.shape,
      strides: codecMeta.strides,
    };
  }

  /**
   * @private
   * Get the content of a text dataset
   * @param {Object} codecMeta
   * @return {string}
   */
  _getText(codecMeta) {
    let buffer = this._getDatasetAsByte(codecMeta);
    let text = new TextDecoder().decode(buffer);
    return text;
  }

  /**
   * @private
   * Get the content of an object dataset
   * @param {Object} codecMeta
   * @return {Object}
   */
  _getObject(codecMeta) {
    let text = this._getText(codecMeta);
    let obj = null;
    try {
      obj = yaml.load(text);
    } catch (e) {
      obj = JSON.parse(text);
    }
    return obj;
  }

  /**
   * Get a dataset by its name. This includes the data and the metadata.
   *
   * For numerical datasets, note that the size and strides are relevant only if the dataset is multidimensional, Then, the values are
   * arranged from the slowest varying (first) to the fastest varying (last), which is the native C order and
   * also the default in Numpy.
   *
   * @throws If `datasetName` does not exist
   * @param {string} codecMeta - The name of the metadata
   * @return {Object} Of the shape {data, metadata}
   */
  getDataset(datasetName) {
    let entry = this._getEntry(datasetName);

    let codecMeta = entry.codecMeta;
    let data = null;

    if (TYPES.NUMERICALS.includes(codecMeta.type)) {
      data = this._getNumericalDataset(codecMeta);
    } else if (codecMeta.type === TYPES.BUFFER) {
      data = this._getDatasetAsByte(codecMeta);
    } else if (codecMeta.type === TYPES.TEXT) {
      data = this._getText(codecMeta);
    } else if (codecMeta.type === TYPES.OBJECT) {
      data = this._getObject(codecMeta);
    }

    return {
      data: data,
      //metadata: JSON.parse(JSON.stringify(entry.metadata)) // A copy is shared so that no modification of the returned data alters the original dataset
      metadata: yaml.load(yaml.dump(entry.metadata)), // make a copy using yaml codec to conserve more than with JSON (Infinity, type, etc.)
    };
  }

  // TODO
  digNumericalDataset(datasetName, position) {}

  // TODO
  digInBuffer(datasetName, byteOffset, byteLength) {}

  /**
   * @private
   * Get the entry of a given dataset.
   * An "entry" is composed of the set of user metadata as well as the codec (system) metadata.
   * @throws If `datasetName` does not exist
   * @param {string} datasetName
   * @return {Object}
   */
  _getEntry(datasetName) {
    let dataset = this._rabIndex.filter((entry) => entry.name === datasetName);
    if (dataset.length === 0) {
      throw new Error(`There is no dataset "${datasetName}" in this RandomAccessBuffer.`);
    }
    return dataset[0];
  }

  /**
   * Get the user metadata of a given dataset.
   * @throws If `datasetName` does not exist
   * @param {string} datasetName
   * @return {Object}
   */
  getMetadata(datasetName) {
    let entry = this._getEntry(datasetName); // will throw if don't exist
    return entry.metadata;
  }

  /**
   * Get the type of dataset as a string.
   * @throws If `datasetName` does not exist
   * @param {string} datasetName
   * @return {string}
   */
  getDatasetType(datasetName) {
    let entry = this._getEntry(datasetName); // will throw if don't exist
    return entry.codecMeta.type;
  }
}

export default RandomAccessBuffer;
