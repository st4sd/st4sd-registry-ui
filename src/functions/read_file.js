export default function readFile(file) {
  return new Promise((resolve, reject) => {
    try {
      var fileReader = new FileReader();
      fileReader.onload = (f) => {
        const contents = f.target.result;
        resolve(contents);
      };
      fileReader.readAsText(file);
    } catch (error) {
      reject(error);
    }
  });
}
