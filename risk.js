getVar = (data,col_idx)=>{
    var arr = []
    data.forEach((row, index)=> {(arr).push(data[index][col_idx])})
    return arr//.slice(1,-1)
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
    risk.pgs_rsids.forEach((element,pgs_idx) => { // skip first row column names (ie rsid)
        //console.log(element)
        //console.log(risk.genom_rsids[idx])

                 //get the index of the 23and me rsids that are also in PGS
                    var data_idx = risk.genom_rsids.indexOf(element)
                    if (data_idx!=-1){
                      indexArr.push(data_idx);

                      var effect_allele = risk.pgsDataArray[pgs_idx][2]
                      effect_allele_homozyg = effect_allele+effect_allele
                      data_alleles = risk.genomDataArray[data_idx][3]
                      console.log("effect_allele",effect_allele);
                      console.log("data_alleles",data_alleles)

                      // find allele matches then seperatte homo v hetero matches
                      results = data_alleles.match(RegExp(effect_allele,'g'))
                      console.log("results",results)
                      //console.log("results length",results.length)

                      console.log("data_idx",data_idx)
                      console.log("pgs_idx",pgs_idx)

                      console.log("risk.genom_rsids[data_idx]",risk.genom_rsids[data_idx])
                      console.log("risk.pgsDataArray[pgs_idx][4]",risk.pgsDataArray[pgs_idx][4])

                      console.log("element",element)
                      if(results!=null){
                        if( results.length==2){
                          riskArr.push((risk.pgsDataArray[pgs_idx][4])*2)
                          }
                        else if(results.length==1){
                            riskArr.push((risk.pgsDataArray[pgs_idx][4])*1)
                        }
                      }else{
                        riskArr.push((risk.pgsDataArray[pgs_idx][4])*0)
                        console.log("no match!",0)
                      }
                        // if(results.length==1){
                        // riskArr.push((risk.pgsDataArray[pgs_idx][4])*1)
                        // }
                   }
                 })
  return math.sum(riskArr)
}