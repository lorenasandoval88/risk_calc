getVar = (data,col_idx)=>{
    var arr = []
    data.forEach((row, index)=> {(arr).push(data[index][col_idx])})
    return arr.slice(1)
  }
getVar2 = ()=>{
    risk.pgs_rsids = getVar((risk.pgsDataArray),0)
    risk.genom_rsids = getVar(risk.genomDataArray,0)
}
// calculating risk from 23 and me----------------------

riskCalc = function() {
    getVar2()
    indexArr = []
    riskArr = []
    risk.pgs_rsids.forEach((element,idx) => {
        console.log(element)
        console.log(risk.genom_rsids[idx])

                 //get the index of the 23and me rsids that are also in PGS
                    var data_idx = risk.genom_rsids.indexOf(element)
                    if (data_idx!=-1){
                      indexArr.push(data_idx);

                      var effect_allele = risk.genomDataArray[idx][2]
                      var effect_allele_homozyg = effect_allele+effect_allele
                      var data_alleles = risk.genomDataArray[data_idx][3]
                      console.log("math.sum(risk)");

                      if(effect_allele_homozyg==data_alleles){
                        console.log("alleles match!", effect_allele_homozyg, "at ", risk.genomDataArray[idx][0])
                                              //console.log("pgs row:",risk.genomDataArray[idx]); 
                                              //console.log("23me row:",risk.genomDataArray[data_idx]); 
                                              //console.log("pgs beta *2:",(risk.genomDataArray[idx][4])*2);
                                              riskArr.push((risk.genomDataArray[idx][4])*2)
                          }
                   }
                 })  
  return math.sum(riskArr)
}