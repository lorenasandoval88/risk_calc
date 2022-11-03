
console.log(`risk.js loaded at ${Date()}`)



runQAQC = function (data) {
    console.log(`runQAQC function ran at ${Date()}`)
  
    // define genomic data
    fulldt = qaqc.dataTxt.split('\r\n').map(function(ln){
        return ln.split('\t');
    });
    // remove meta data
    dt = fulldt.slice(19)
    
    //clean up first row
    cleantext = text.map(x => x.replace(/# /g,""));
    dt[0] = cleantext

    // display data dimensions
    let h = `<p>Successfully uploaded: table with 
    ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
    h += '</p>'
    return h
}
