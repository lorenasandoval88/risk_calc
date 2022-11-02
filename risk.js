
console.log(`Lore.js loaded at ${Date()}`)



runQAQC = function (data) {
    console.log(`runQAQC function ran at ${Date()}`)
  
    let h = `<p>Successfully uploaded: table with ${Object.keys(data).length} columns x ${qaqc.data[Object.keys(data)[0]].length} rows</p>`
    h += '</p>'
    return h
}
