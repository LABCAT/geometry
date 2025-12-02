export const sketchMetadata = {
  'number-1': {
    title: '#GeometryNo1',
    description: 'An exploration of sacred geometry and colour theory through generative art.',
    sketch: 'Geometry.js',
  },
};

export function getAllSketches() {
  return Object.keys(sketchMetadata).map(id => ({
    id,
    ...sketchMetadata[id]
  }));
}

export function getSketchById(id) {
  return sketchMetadata[id] || null;
}
