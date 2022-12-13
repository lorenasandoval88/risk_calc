getColumn = (data,colName)=>{
    var arr = []
    idx = data[0].indexOf(colName)
    pgsData = data.slice(1)
    pgsData.forEach((row, index)=> {(arr).push(pgsData[index][idx])})
    var array = arr
    return array
  }
getVar2 = ()=>{
    risk.pgs_rsids = getColumn((risk.pgsDataArray),'hm_rsID')
    risk.genom_rsids = getColumn(risk.genomDataArray,'hm_rsID')
}
// calculating risk from 23 and me----------------------

riskCalc = function() {
    getVar2()
    indexArr = []
    riskArr = []
    count = 1
    risk.pgs_rsids.forEach((element,pgs_idx) => { // skip first row column names (ie rsid)

                 //get the index of the 23and me rsids that are also in PGS
                    var data_idx = risk.genom_rsids.indexOf(element)
                    if (data_idx!=-1){
                      indexArr.push(data_idx);

                      var effect_allele = risk.pgsDataArray[pgs_idx][2]
                      effect_allele_homozyg = effect_allele+effect_allele
                      data_alleles = risk.genomDataArray[data_idx][3]
                      // console.log("effect_allele",effect_allele);
                      // console.log("data_alleles",data_alleles)

                      // find allele matches then seperatte homo v hetero matches
                      results = data_alleles.match(RegExp(effect_allele,'g'))

                      if(results!=null){
                        if( results.length==2){
                          riskArr.push((risk.pgsDataArray[pgs_idx][4])*2)
                          count = count+1
                          }
                        else if(results.length==1){
                            riskArr.push((risk.pgsDataArray[pgs_idx][4])*1)
                            count = count+1
                        }
                      }else{
                        riskArr.push(0)
                        console.log("no match!",0)
                        count = count+1
                      }
                   }
                   variantMatches.innerHTML = `${riskArr.length+1} PGS variants found in 23andMe file`

                 })
  return math.sum(riskArr)
}