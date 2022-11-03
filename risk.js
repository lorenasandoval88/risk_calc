
console.log(`risk.js loaded at ${Date()}`)



runQAQC = function (data) {
    console.log(`runQAQC function ran at ${Date()}`)
  
    // define genomic data
    var fulldt = qaqc.dataTxt.split('\r\n').map(function(ln){
        return ln.split('\t');
    });
    // remove meta data rows 0-19
    var dt = fulldt.slice(19) // data is defined as dt
    
    //clean up first row
    var cleantext = dt[0].map(x => x.replace(/# /g,""));
    dt[0] = cleantext

    //define header and remove from dt
    var colnames = dt[0]
    dt = dt.slice(1)

    // display data dimensions
    let h = `<p>Successfully uploaded: table with 
    ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
    h += '</p>'
    return h
}
