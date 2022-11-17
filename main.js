
// read file -------------------------------------
function getFile(event, text) {
  const input = event.target
  if ('files' in input && input.files.length > 0) {
          placeFileContent(
      document.getElementById(text),
      input.files[0])
  }
}
function placeFileContent(target, file) {
    readFileContent(file).then(content => {
        target.value = content
        data = content  // full data is defined here
        dt = formatData(data)
    }).catch(error => console.log(error))
}
function readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(
            event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file.slice(0,2011)) //file.slice(0,2011)      
    })
}
