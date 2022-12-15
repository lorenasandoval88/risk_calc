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
    risk.pgs_or = getColumn((risk.pgsDataArray),'OR')
    risk.pgs_or.forEach(function(item, i) {
      risk.pgs_or[i] = Number(item);
   });
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

country = ['rs132390', 'rs6001930', 'rs4245739', 'rs6678914', 'rs12710696'];//risk.pgs_rsids;


var votingPop = [2,3,4,5,6];//risk.pgs_or;

var regVoters = [3,4,5,6,7];//risk.pgs_or;

var trace1 = {
  type: 'scatter',
  x: votingPop,
  y: country,
  mode: 'markers',
  name: 'legend1',
  marker: {
    color: 'rgba(156, 165, 196, 0.95)',
    line: {
      color: 'rgba(156, 165, 196, 1.0)',
      width: 1,
    },
    symbol: 'circle',
    size: 16
  }
};

var trace2 = {
  x: regVoters,
  y: country,
  mode: 'markers',
  name: 'legend2',
  marker: {
    color: 'rgba(204, 204, 204, 0.95)',
    line: {
      color: 'rgba(217, 217, 217, 1.0)',
      width: 1,
    },
    symbol: 'circle',
    size: 16
  }
};
// chart---------------------------------------------------------
const myPlot = async () => {
var data = [trace1, trace2];
risk.pgsDataArray.pop()

var pgsTrait = risk.pgsData.substring( // pgs disease from metadata
    risk.pgsData.indexOf("#trait_reported=") + 16, 
    risk.pgsData.lastIndexOf("#trait_mapped")
);
var pgsVariants = risk.pgsData.substring(  // # of pgs variants from metadata
    risk.pgsData.indexOf("#variants_number=") + 17, 
    risk.pgsData.lastIndexOf("#weight_type")
);
var layout = {
  title: `${pgsVariants} ${pgsTrait} variants`,
  xaxis: {
    showgrid: false,
    showline: true,
    linecolor: 'rgb(102, 102, 102)',
    titlefont: {
      font: {
        color: 'rgb(204, 204, 204)'
      }
    },
    tickfont: {
      font: {
        color: 'rgb(102, 102, 102)'
      }
    },
    autotick: false,
    dtick: 10,
    ticks: 'outside',
    tickcolor: 'rgb(102, 102, 102)'
  },
  margin: {
    l: 140,
    r: 40,
    b: 50,
    t: 80
  },
  legend: {
    font: {
      size: 10,
    },
    yanchor: 'middle',
    xanchor: 'right'
  },
  width: 600,
  height: 600,
  paper_bgcolor: 'rgb(254, 247, 234)',
  plot_bgcolor: 'rgb(254, 247, 234)',
  hovermode: 'closest'
};

Plotly.newPlot('chartDiv', data, layout)
}