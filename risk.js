

console.log("risk.js loaded");

// Get data from Rest API--------------
formatData = ((dt) => {
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
    //txt= formatData(txt).join(',')
    console.log("PGS file read in!");
    console.log("----------------");
    return txt;
};

getPGSdata().then(pgsData => {
document.getElementById("pgsText").innerText =pgsData;
});


// calculating risk from 23 and me----------------------
function makeHeader() {
    const header = document.createElement("h2");
    header.append("Risk");
    return header
}
function makeRiskOutput() {
    let risk = 99.8
    const para = document.createElement("p");
    para.append(document.createTextNode(risk));
    console.log("Function for calculating risk ")
    return para
}

//makeheader
var textareaElement = document.createElement("Div")
document.body.appendChild(textareaElement);    

document.getElementById("content-target")
.addEventListener("input", e => console.log('input'))
//function() {
    //textareaElement.appendChild(document.createTextNode("Lololo"));//makeHeader()
    //textareaElement.appendChild(makeRiskOutput());
    //console.log("add text to resultsDiv")
    //});

//     //return rsids.diff(breast_cancer_PGS[0])
//   var indexArr = []
//   var risk = []
//   // set pgs rsids as the matches to look for
//   PGS_rsids.forEach((element,idx) => {
//                  //get the index of the 23and me rsids that are also in PGS
//                     var data_idx = all_23me_rsids.indexOf(element)
//                     if (data_idx!=-1){
//                       indexArr.push(data_idx);

//                       var effect_allele = breast_cancer_PGS[idx][2]
//                       var effect_allele_homozyg = effect_allele+effect_allele
//                       var data_alleles = data_arr[data_idx][3]
//                       console.log("----------");
//                       // console.log("23 idx:",data_idx);
//                       // console.log("23me row:",data_arr[data_idx]); 
//                       // console.log("23 alleles:",data_arr[data_idx][3]);
//                       // console.log("pgs index:",idx); 
//                       // console.log("pgs row:",breast_cancer_PGS[idx]); 
//                       // console.log("pgs allele:",breast_cancer_PGS[idx][2]);
//                       // console.log("pgs allele * 2:",effect_allele_homozyg);
//                       // console.log("pgs beta:",breast_cancer_PGS[idx][4]);
//                       if(effect_allele_homozyg==data_alleles){
//                         console.log("alleles match!", effect_allele_homozyg, "at ", breast_cancer_PGS[idx][0])
//                                               //console.log("pgs row:",breast_cancer_PGS[idx]); 
//                                               //console.log("23me row:",data_arr[data_idx]); 
//                                               console.log("pgs beta *2:",(breast_cancer_PGS[idx][4])*2);
//                                               risk.push((breast_cancer_PGS[idx][4])*2)

//                           }
//                    }
//                  })  
//   return math.sum(risk)
// }
