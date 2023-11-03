// // entry file for the application

// // components
// export {default as MRZCamera} from './components/MRZCamera';
// export {default as MRZScanner} from './components/MRZScanner';
// // types.ts
// export type {MRZProperties} from './types/mrzProperties';
// export type {
//   BoundingFrame,
//   Dimensions,
//   MRZCameraProps,
//   MRZFrame,
//   MRZScannerProps,
//   OCRElement,
//   Point,
//   Rect,
//   Size,
//   Text,
//   TextBlock,
//   TextElement,
//   TextLine,
// } from './types/types';
// export {boundingBoxAdjustToView} from './util/boundingBoxAdjustToView';
// // resolutions.ts
// export {sortFormatsByResolution} from './util/generalUtil';
// // wrapper.ts
// export {default as scanMRZ} from './util/wrapper';

import {default as MRZCamera} from './src/components/MRZCamera';
import {default as MRZScanner} from './src/components/MRZScanner';
import type {MRZProperties} from './src/types/mrzProperties';
import type {
  BoundingFrame,
  Dimensions,
  MRZCameraProps,
  MRZFrame,
  MRZScannerProps,
  OCRElement,
  Point,
  Rect,
  Size,
  Text,
  TextBlock,
  TextElement,
  TextLine,
} from './src/types/types';
import {boundingBoxAdjustToView} from './src/util/boundingBoxAdjustToView';
// // types.ts
// // resolutions.ts
import {sortFormatsByResolution} from './src/util/generalUtil';
import {default as scanMRZ} from './src/util/wrapper';

declare module 'diva-mobile-vision-camera-mrz-scanner' {
  export {MRZScanner};
  export {MRZProperties};
  export {MRZCamera};
  export {BoundingFrame};
  export {Dimensions};
  export {MRZCameraProps};
  export {MRZFrame};
  export {OCRElement};
  export {MRZScannerProps};
  export {Rect};
  export {Size};
  export {Text};
  export {TextBlock};
  export {TextElement};
  export {TextLine};
  export {Point};
  export {boundingBoxAdjustToView};
  export {sortFormatsByResolution};
  export {scanMRZ};
}
