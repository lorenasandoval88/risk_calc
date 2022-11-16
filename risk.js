

console.log("risk.js loaded");

// Get data from Rest API--------------
cleanScores = ((dt) => {
    dt = dt.split(/[\n\r]+/).filter(r=>r[0]!='#').map(r=>r.split(/\t/));
    return dt
})
const getPGSdata = async () => {
    const entry = document.getElementById("inputbox").value
    console.log(" Processing...");
    const request = await fetch(`https://www.pgscatalog.org/rest/score/${entry}`);
    const url = (await request.json()).ftp_scoring_file;
    const range=[0,20000]
    txt= pgs.pako.inflate(await (await fetch(url,{
        headers:{
            'content-type': 'multipart/byteranges',
            'range': `bytes=${range.join('-')}`,
        }
    })).arrayBuffer(),{to:'string'})
    //txt= cleanScores(txt).join(',')
    return txt;
};

getPGSdata().then(pgsData => {
console.log("PGS data", pgsData);
document.getElementById("pgsText").innerText =pgsData;
});
