  

// calculating risk from 23 and me----------------------

//const { title } = require("process")

riskCalc = function() {

    riskArr = []
    riskData = []
    risk.pgs_rsids.forEach((element,pgs_idx) => { // skip first row column names (ie rsid)
      pgsDat = risk.pgsDataArray.slice(1) // remove first row with pgs colummn names
      _23Data =  risk.genomDataArray.slice(1)
      //get the index of the 23and me rsids that are also in PGS
                    var data_idx = risk.genom_rsids.indexOf(element)
                    if (data_idx!=-1){
                      var effect_allele = pgsDat[pgs_idx][2]
                      effect_allele_homozyg = effect_allele+effect_allele
                      data_alleles = _23Data[data_idx][3]
                      console.log(pgsDat[pgs_idx])
                      console.log(_23Data[data_idx])

                      // find allele matches then seperatte homo v hetero matches
                      results = data_alleles.match(RegExp(effect_allele,'g'))
                      console.log(results)
                      if(results!=null){
                        if( results.length==2){
                          riskArr.push((pgsDat[pgs_idx][4])*2)
                          riskData.push(pgsDat[pgs_idx])
                          }
                        else if(results.length==1){
                            riskArr.push((pgsDat[pgs_idx][4])*1)
                            riskData.push(pgsDat[pgs_idx])
                        }
                      }else{
                        riskArr.push(0)
                        riskData.push(pgsDat[pgs_idx])
                      }
                   }
                   variantMatches.innerHTML = `${riskArr.length} PGS variants found in 23andMe file`

                 })
  return math.exp(math.sum(riskArr))
}

// chart---------------------------------------------------------
const PGSplot = async () => {

  // display pgs scores as beta or odds ratio with rsids or chr and position on the x axis
  // some rsids are only the position (use chr and position)
  oddsRatio = {};
  if (risk.pgs_rsids[1].match("rs")==null && risk.pgs_rsids[1].length>0){
    risk.pgs_or.forEach((or,i)=>{
      oddsRatio["chr_"+risk.pgs_chr[i]+"_pos_"+risk.pgs_pos[i]] = or;
    })
  // some rsids are not included in the pgs (use chr and position)
  } else if (risk.pgs_rsids[1]=='' && risk.pgs_rsids[1].length==0){
    risk.pgs_b.forEach((b,i)=>{
      oddsRatio["chr_"+risk.pgs_chr[i]+"_pos_"+risk.pgs_pos[i]] = math.exp(b);
    })
  // Here, rsids are available
  } else {
   risk.pgs_or.forEach((or,i)=>{
    oddsRatio[risk.pgs_rsids[i]] = or;
  })}
//sort or/beta object
  oddsRatioSorted = Object.entries(oddsRatio)
    .sort(([,a],[,b]) => a-b)
    .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});
  
  var trace1 = {
    type: 'scatter',
    x: Object.values(oddsRatioSorted),// odds ratios
    y: Object.keys(oddsRatioSorted),// rsids
    mode: 'markers',
    name: 'legend1',
    marker: {
      color: 'rgba(156, 165, 196, 0.95)',
      line: {
        color: 'rgba(156, 165, 196, 1.0)',
        width: 1,
      },
      symbol: 'circle',
      size: 5
    }
  };
var data = [trace1];
//risk.pgsDataArray.pop()

var pgsTrait = risk.pgsData.substring( // pgs disease from metadata
    risk.pgsData.indexOf("#trait_reported=") + 16, 
    risk.pgsData.lastIndexOf("#trait_mapped")
);
var pgsVariants = risk.pgsData.substring(  // # of pgs variants from metadata
    risk.pgsData.indexOf("#variants_number=") + 17, 
    risk.pgsData.lastIndexOf("#weight_type")
);
var layout = {
  title: `Odds Ratios for PGS ${pgsTrait}Variants`,
 
  xaxis: {
    showgrid: false,
    showline: true,
    linecolor: 'rgb(102, 102, 102)',
    titlefont: {
      font: {
        size: 10,
        color: 'rgb(204, 204, 204)'
      }
    },
    tickfont: {
      font: {
        size: 10,
        color: 'rgb(102, 102, 102)'
      }
    },
    autotick: true,
    dtick: 10,
    ticks: 'outside',
    tickcolor: 'rgb(102, 102, 102)'
  },
  margin: {
    l: 140,r: 40,b: 50,t: 50
  },
  legend: {
    font: {
      size: 10,
    },
    yanchor: 'middle',xanchor: 'right'
  },
  shapes:[{
    type: 'line',
    x0: 1,
    y0: 0,
    x1: 1,
    y1: Object.values(oddsRatio).length,
    line: {
      color: 'grey',
      width: 1.5,
      dash: 'dot'
    }}],
  width: 600,
  height: 600,
  //paper_bgcolor: 'rgb(99,99,100)',
  plot_bgcolor: 'rgb(254, 247, 234)',
  hovermode: 'closest'
};

Plotly.newPlot('pgsDiv', data, layout)
}

// hide pgs plot
// var pgsbutton = document.getElementById('pgsbutton'); // Assumes element with id='button'

// pgsbutton.onclick = function() {
//     var div = document.getElementById('pgsDiv');
//     if (div.style.display !== 'none') {
//         div.style.display = 'none';
//     }
//     else {
//         div.style.display = 'block';
//     }
// };
// 23andMe beta plot-------------------------------------

// beta = {};
// for( var i=0,n=risk.pgs_pos.length; i<n; i++){
//   beta[risk.pgs_or[i]] = "chr_"+risk.pgs_chr[i]+"_"+risk.pgs_pos[i];
// }