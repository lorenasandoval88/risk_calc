console.log("risk.js loaded")

risk={}

cleanScores = ((dt) => {
    dt = dt.split(/[\n\r]+/).filter(r=>r[0]!='#').map(r=>r.split(/\t/))
})

scores = async ()=> {
    console.log('calling');
    await pgs.loadScore(4);
} 
  
sc=scores()

