import CSInterface from "./csInterface";

const csInterface = new CSInterface();

// PHOTOSHOP INTERFACE FUNCTIONS

export const evalScriptPromise = (func) => {
  return new Promise((resolve, reject) => {
    csInterface.evalScript(func, (response) => {
      if (response === 'EvalScript error.') reject();
      resolve(response);
    });
  });
};

export const getActiveLayerId = async () => {
  return await evalScriptPromise("getActiveLayerId()")
};

export const layerContentToBase64 = async (layerId, mimeType = 'image/jpeg') => {
  const inputImage =  await evalScriptPromise(`saveLayerById(${layerId}, "${mimeType}")`)
    .then((filename: string) => {
      const result = new Image();
      result.src = filename;
      return new Promise(resolve => {
        result.onload = () => {
          // del file again. we don't need it anymore
          window.cep.fs.deleteFile(filename);
          // return img
          resolve(result);
        };
      });
    })
    .then(async result => {
      const img64 = await imgToBase64(result, mimeType);
      return img64;
    });
  return inputImage;
};

export const getAllLayers = async () => {
  const layers = [];
  const allLayersLength = await evalScriptPromise("getAllLayersLength()");
  for (let i = 0; i < allLayersLength; i++) {
    layers.push({
      name: await evalScriptPromise(`getLayerName(${i})`),
      id: await evalScriptPromise(`getLayerId(${i})`)
    });
  }
  layers.reverse();
  return layers;
};

export const placeOutput = async (modelName, outputName, img) => {
  const filename = "/tmp/rw_" + Math.random() + (img.indexOf("jpeg") !== -1 ? ".jpg" : ".png");
  window.cep.fs.writeFile(
    filename,
    img.replace(/^data:image\/[a-z]+;base64,/, ""),
    window.cep.encoding.Base64
  );
  const layerName = `${modelName} - ${outputName}`;
  return evalScriptPromise(`pasteImage("${filename}", "${layerName}")`);
};

// CONVERT IMG TO BASE64 ENCODING

export const imgToBase64 = (img, mimeType) => {
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  c.width = img.width;
  c.height = img.height;
  ctx.drawImage(img, 0, 0);
  return c.toDataURL(mimeType);
};