
// hide button, then display button after loading 23 and me file
document.getElementById('23button').style.visibility = 'hidden';
var hidden = false;
function plotRisk() {
  console.log("hide button")
    hidden = !hidden;
    if(hidden) {
        document.getElementById('23button').style.visibility = 'visible';
    } else {
        document.getElementById('23button').style.visibility = 'hidden';
    }
}
//-------------------------------------
const riskplot = async () => {

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

// map our commands to the classList methods
// const fnmap = {
//     'toggle': 'toggle',
//       'show': 'add',
//       'hide': 'remove'
//   };
//   const collapse = (selector, cmd) => {
//     const targets = Array.from(document.querySelectorAll(selector));
//     targets.forEach(target => {
//       target.classList[fnmap[cmd]]('show');
//     });
//   }
  
//   // Grab all the trigger elements on the page
//   const triggers = Array.from(document.querySelectorAll('[data-toggle="collapse2"]'));
//   // Listen for click events, but only on our triggers
//   window.addEventListener('click', (ev) => {
//     const elm = ev.target;
  
//     if (triggers.includes(elm)) {
//       const selector = elm.getAttribute('data-target');
//       collapse(selector, 'toggle');
//     }
//   } );
  
//   document.getElementById("pgsbutton").addEventListener("click", (e) => {
//       let textContent = e.target.textContent;
//       if (textContent == `plot ${pgsInput.value} scores`) {
//           e.target.textContent = `hide ${pgsInput.value} scores`;
//        }
//        else {
//          e.target.textContent = `plot ${pgsInput.value} scores`;
  
//        }
//    });
  
//   //when scores are updated, plot button should reset----->
//   // Grab all the trigger elements on the page
//   //https://medium.com/dailyjs/mimicking-bootstraps-collapse-with-vanilla-javascript-b3bb389040e7
//   const triggers2 = Array.from(document.querySelectorAll('[data-toggle="collapse1"]'));
//   // Listen for click events, but only on our triggers
//   window.addEventListener('click', (ev) => {
//     const elm = ev.target;
  
//     if (triggers2.includes(elm)) {
//       const selector = elm.getAttribute('data-target');
//       collapse(selector, 'hide');
//     }
//   } );
  
//   document.getElementById("pgs_scores_button").addEventListener("click", (e) => {
//       let textContent = document.getElementById("pgsbutton").innerHTML;
//       if (textContent == `hide ${pgsInput.value} scores`) {
//           document.getElementById("pgsbutton").innerHTML = `plot ${pgsInput.value} scores`;
//        }
//        else {
//           document.getElementById("pgsbutton").innerHTML = `plot ${pgsInput.value} scores`;
  
//        }
//    });