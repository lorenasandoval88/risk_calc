console.log("risk.js loaded");

PGS_rsids = ()=>{
    var arr = []
    risk.pgsDataArray.forEach((row, index)=> {(arr).push(risk.pgsDataArray[index][0])})
    return arr.slice(1)
  }
  riskCalc = ()=>{
    console.log("PGS_rsids",PGS_rsids())
    var indexArr = []
    var risk = []
}


// calculating risk from 23 and me----------------------

//function() {


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
