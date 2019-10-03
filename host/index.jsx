function getActiveLayerId() {
  const doc = app.activeDocument;
  var activelayer = doc.activeLayer;
  return  activelayer.id;
}

function getAllLayersLength() {
  const doc = app.activeDocument;
  var allLayersLength = doc.layers.length;
  return allLayersLength;
}

function getLayerName(index) {
  const doc = app.activeDocument;
  var layer = doc.layers[index];
  return layer.name;
}

function getLayerId(index) {
  const doc = app.activeDocument;
  const layer = doc.layers[index];
  return layer.id;
}

function pasteImage(filename, layerName) {
  var fileRef = new File(filename);
  var doc = app.activeDocument;
  var currentLayer = doc.activeLayer;
  var curr_file = app.open(fileRef);
  curr_file.selection.selectAll();
  curr_file.selection.copy();
  curr_file.close();
  doc.paste();
  doc.activeLayer.name = layerName;
  doc.activeLayer.translate(currentLayer.bounds[0] - doc.activeLayer.bounds[0], currentLayer.bounds[1] - doc.activeLayer.bounds[1]);
  doc.activeLayer.move(doc.layers[0], ElementPlacement.PLACEBEFORE);
}

function saveLayerById(id, mimeType) {
  var layers = app.activeDocument.layers;
  // fallback to active layer
  var layer = app.activeDocument.activeLayer;
  // select layer by id
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].id === id) layer = layers[i];
  }
  layer.copy();
  var docRef = app.documents.add(layer.bounds[2] - layer.bounds[0], layer.bounds[3] - layer.bounds[1], app.activeDocument.resolution);
  docRef.paste();
  var filename = '/tmp/rw_' + Math.random() + (mimeType === 'image/png' ? '.png' : '.jpg');
  var saveFile = new File(filename);
  if (mimeType === 'image/jpeg') {
    saveJPG(docRef, saveFile, 10);
  } else {
    savePNG(docRef, saveFile);
  }
  docRef.close(SaveOptions.DONOTSAVECHANGES);
  return filename;
}

function saveJPG(doc, saveFile, jpegQuality) {
  var jpgSaveOptions = new JPEGSaveOptions();
  jpgSaveOptions.embedColorProfile = true;
  jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE;
  jpgSaveOptions.matte = MatteType.NONE;
  jpgSaveOptions.quality = jpegQuality;
  doc.saveAs(saveFile, jpgSaveOptions, true, Extension.LOWERCASE);
};

function savePNG(doc, saveFile) {
  var pngSaveOptions = new PNGSaveOptions();
  pngSaveOptions.compression = 0;
  pngSaveOptions.interlaced = false;
  doc.saveAs(saveFile, pngSaveOptions, true, Extension.LOWERCASE);
}

function readTextLayer() {
  try {
    return app.activeDocument.activeLayer.textItem.contents;
  }
  catch (err) {
    return false;
  }
}