risk = {}
// read file -------------------------------------
function getFile(event, text) {
  input = event.target
  if ('files' in input && input.files.length > 0) {
          placeFileContent(
      document.getElementById(text),
      input.files[0])
  }
}
function placeFileContent(target, file) {
    readFileContent(file).then(content => {
        risk.genomData = content
        risk.genomDataArray = formatData(content)
        var genomeColNames = ["hm_rsID","hm_chr","hm_pos","genotype"]
        risk.genomDataArray.unshift(genomeColNames)
        risk.genom_rsids = getColumn(risk.genomDataArray,'hm_rsID')

        target.innerHTML = content.slice(0,10000) //display 23 and me lines on page
        risk.results = riskCalc() // calculate risk

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
        reader.readAsText(file) //file.slice(0,2011)      
    })
}

// Get PGS data from Rest API--------------
getColumn = (data,colName)=>{
    var arr = []
    idx = data[0].indexOf(colName)
    pgsData = data.slice(1)
    pgsData.forEach((row, index)=> {(arr).push(pgsData[index][idx])})
    var array = arr
    return array
  }

formatData = ((dataArray) => {
    dataArray = dataArray.split(/[\n\r]+/).filter(r=>r[0]!='#').map(r=>r.split(/\t/));
    return dataArray
})
const getPGSdata = async () => {
    const entry = document.getElementById("pgsInput").value
    const request = await fetch(`https://www.pgscatalog.org/rest/score/${entry}`);
    const url = (await request.json()).ftp_harmonized_scoring_files.GRCh37.positions;
    const range=[0,6005]
    txt= await pgs.pako.inflate(await (await fetch(url,{
        headers:{
            'content-type': 'multipart/byteranges',
            'range': `bytes=${range.join('-')}`,
        }
    })).arrayBuffer(),{to:'string'})
    return txt;
};
const getPGSdata2 = async () => {
    getPGSdata().then(pgsData => {
document.getElementById("pgsArea").innerHTML = pgsData;
risk.pgsData = pgsData
risk.pgsDataArray = formatData(pgsData) // define pgs data array here
risk.pgsDataArray.pop()

risk.pgs_rsids = getColumn((risk.pgsDataArray),'hm_rsID')
risk.pgs_or = getColumn((risk.pgsDataArray),'OR')
risk.pgs_or.forEach(function(item, i) {
  risk.pgs_or[i] = Number(item);
});
//risk.pgsDataArray = risk.pgsDataArray.slice(1)
var pgsTrait = risk.pgsData.substring( // pgs disease from metadata
    risk.pgsData.indexOf("#trait_reported=") + 16, 
    risk.pgsData.lastIndexOf("#trait_mapped")
);
var pgsVariants = risk.pgsData.substring(  // # of pgs variants from metadata
    risk.pgsData.indexOf("#variants_number=") + 17, 
    risk.pgsData.lastIndexOf("#weight_type")
);
pgsFileInfo.innerHTML = `${pgsVariants} ${pgsTrait} variants`
});

}
getPGSdata2() // should I call this function here to display scores at loading the page?