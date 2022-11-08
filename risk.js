
console.log(`risk.js loaded at ${Date()}`)


runQAQC = function (data) {
    console.log(`runQAQC function ran at ${Date()}`)
    console.log("pgsData:")

    res = ''
    scoreLocation=''

    scoreLocation = await (pgs.loadScore(4))
    async function foo(data) {
        // RETURN the promise
        return fetch(data).then(function(response){
            res = response.text();
            console.log(res)

            return res; // Process it inside the `then`
        });}

    
    scores = foo(scoreLocation)
    //pgsData = fetch(pgs.loadScore(4))//.replaceAll('\t','   ','g')


    // define genomic data
    var fulldt = qaqc.dataTxt.split('\r\n').map(function(ln){
        return ln.split('\t');
    });
    // remove meta data rows 0-19
    dt = fulldt.slice(19) // data is defined as dt
    
    //clean up first row
    var cleantext = dt[0].map(x => x.replace(/# /g,""));
    dt[0] = cleantext

    //define header and remove from dt
    var colnames = dt[0]
    var dat = dt.slice(1)

    // display data dimensions
    let h = `<p>Successfully read: table with 
    ${Object.keys(dt).length} columns x ${dt[Object.keys(dt)[0]].length} rows</p>`
    h += '</p>'
    return h
}


