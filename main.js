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
        risk.results = riskCalc()
        // if (!document.getElementById("resultDiv")){
        //     resDiv= document.createElement("div")
        //     resDiv.id = "resultDiv"
        //     document.body.insertBefore(resDiv, endDiv)
        // }
        //resDiv.innerHTML = "<h2>Risk results</h2>"
        //resDiv.innerHTML += `<p>results: ${genomDataArray.length}</p>`
        resDiv.style.color = "blue"
        resDiv.style.borderColor = "green"
        resDiv.innerHTML = `<p>results: ${risk.results}</p>`
    }).catch(error => console.log(error))
}
function readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(
            event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file.slice(0,90000011)) //file.slice(0,2011)      
    })
}

// Get PGS data from Rest API--------------
formatData = ((dataArray) => {
    dataArray = dataArray.split(/[\n\r]+/).filter(r=>r[0]!='#').map(r=>r.split(/\t/));
    return dataArray
})
const getPGSdata = async () => {
    const entry = document.getElementById("pgsInput").value
    const request = await fetch(`https://www.pgscatalog.org/rest/score/${entry}`);
    const url = (await request.json()).ftp_harmonized_scoring_files.GRCh37.positions;
    const range=[0,3005]
    txt= await pgs.pako.inflate(await (await fetch(url,{
        headers:{
            'content-type': 'multipart/byteranges',
            'range': `bytes=${range.join('-')}`,
        }
    })).arrayBuffer(),{to:'string'})
    console.log("getPGSdata function ran!");
    return txt;
};
const getPGSdata2 = async () => {
    getPGSdata().then(pgsData => {
document.getElementById("pgsArea").innerText =pgsData;
risk.pgsData = pgsData
risk.pgsDataArray = formatData(pgsData)
console.log("getPGSdata2:PGS scores displayed in text area")
});
}

getPGSdata2() // should I call this function here to display scores at loading the page?