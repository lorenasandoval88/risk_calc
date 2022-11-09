
// use document.getElementById or onchange
//document.getElementById('input-file')
  //.addEventListener('change', getFile)
data = ''
dt = ''


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
        data = content  // data is defined here
        dt = cleanData(data)
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

// format data -------------------------------------
function cleanData(data) {
data = data.split('\r\n').map(function(ln){
    return ln.split('\t'); // split text
});
data = data.slice(19) // remove meta data
var cleantext = data[0].map(x => x.replace(/# /g,"")); //clean up first row
data[0] = cleantext
return data
}

// calculate risk -------------------------------------
// function riskCalc(data) {
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