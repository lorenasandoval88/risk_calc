risk = {}
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
        genomData = content  // full genomData (inc. meta genomData) is defined here
        genomDataArray = formatData(genomData) // genomData array defined here
        risk.genomData = genomData
        risk.genomDataArray = genomDataArray
        console.log(genomDataArray)
        if (!document.getElementById("resultDiv")){
            resDiv= document.createElement("div")
            resDiv.id = "resultDiv"
            document.body.appendChild(resDiv)
        }
        resDiv.innerHTML = "<h2>Risk results</h2>"
        resDiv.innerHTML += `<p>results: ${genomDataArray.length}</p>`
        doeverythingelse()
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

doeverythingelse = ()=>{console.log("new risk",risk.genomDataArray[3], risk.pgsDataArray[3])}

