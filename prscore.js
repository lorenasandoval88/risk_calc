
prscore = { pgsDataArray: [], genomDataArray: [], variants: "", trait: "", score: "", type: ""}

/* ************* PGS information module ************* */

/* Load traits */
prscore.loadTraits = async () => {
    next="https://www.pgscatalog.org/rest/trait/all?format=json&limit=250&offset=0";
    select_options="";
    while (next != null){
        await fetch( next ).then( (response) => response.json() ).then( (traits) => {
            traitsItems = traits.results;
            traitsItems.forEach( (item) => { select_options+=`<option value='${item.id}'>${item.label}</option>` } )
            next=traits.next;
            if(next==null){
                traitName.innerHTML = select_options;
                traitName.value="EFO_0000305";
                $('#traitName').selectpicker('refresh');
            }
        });
    } 
};

/* Load data from the pgs catalog */
prscore.loadPGSFile = async () => {
    const entry = document.getElementById("pgsInput").value;
    
    const request = await fetch(`https://www.pgscatalog.org/rest/score/${entry}`);
    const url = (await request.json()).ftp_harmonized_scoring_files.GRCh37.positions;
    const range=[0, 6005];
    txt= await pgs.pako.inflate(await (await fetch(url,{
        headers:{
            'content-type': 'multipart/byteranges',
            'range': `bytes=${range.join('-')}`,
        }
    })).arrayBuffer(),{to:'string'});
    return txt;
};

/* Get disease name (trait) of the scoring file */
prscore.getTrait = (pgsData) => {
    prscore.trait = pgsData.substring( pgsData.indexOf("#trait_reported=") + 16,  pgsData.lastIndexOf("#trait_mapped") );
};

/* Get number of variants described in the scoring file */
prscore.getVariants = (pgsData) => {
    prscore.variants = pgsData.substring( pgsData.indexOf("#variants_number=") + 17,  pgsData.lastIndexOf("#weight_type") );
};

/* Extract data from the scoring file for the snps and description information */
prscore.processPGSEntry = async () => {
    prscore.loadPGSFile().then( pgsData => {
        document.getElementById("pgsArea").innerHTML = pgsData;
        
        prscore.pgsDataArray = helper.getDatatable(pgsData);
        prscore.pgsDataArray = prscore.pgsDataArray.slice(1);
        prscore.pgsDataArray.pop();
        
        prscore.getTrait(pgsData);
        prscore.getVariants(pgsData);
        
        pgsFileInfo.innerHTML = `${prscore.variants} ${prscore.trait} variants`
    });
}

/* Get PGS id from the name a certain trait searching in the PGS API by the EFO ontology ID of this trait */
prscore.loadPGSfromEFO = async () => {
    efo = traitName.value;
    pgsFileInfo.innerHTML="Loading ..."
    pgsButton.disabled=true;
    
    await fetch( `https://www.pgscatalog.org/rest/score/search?format=json&trait_id=${efo}`).then( (response) => response.json() ).then( (pgsData) => {
        pgsIds = [];
        pgsData.results.forEach( (pgs) => { pgsIds.push(pgs.id) } )
        pgsInput.value=pgsIds[0]; // Set up the first PGS scoring file from the EFO id trait, but in later versions I suggest personalize the scoring file according to other information from the user such as age and ethnicity.
        
        prscore.processPGSEntry();
        
        pgsButton.disabled=false;
    });
};

/* ************* User Genotype Data information module ************* */

prscore.processUserFile = (event, domElement) => {
    input = event.target;
    if ('files' in input && input.files.length > 0) {
        target = document.getElementById(domElement);
        file = input.files[0];
        
        helper.getFileContent(file).then(content => {
            prscore.genomDataArray = helper.getDatatable(content)
            if( prscore.genomDataArray[0].length == 4 ){
                prscore.type="23AndMe";   
            }
            if( prscore.genomDataArray[0].length == 5 ){
                prscore.type="Ancestry";
            }    
            
            target.innerHTML = content.slice(0,10000) //display 23 and me lines on page
            
            prscore.showScoreResult();
        }).catch(error => console.log(error))
    }
    else{
        resDiv.className="result-empty";
        resDiv.innerHTML="Please load genomic file...";
    }
}

prscore.showScoreResult = () => {
    if( prscore.pgsDataArray.length > 0 && prscore.genomDataArray.length > 0){
        prscore.score = prscore.calculatePrs() // calculate risk
                
        resDiv.className="result-ok";
        resDiv.innerHTML = `<p>Results: ${prscore.score}</p>`
    }
    else{
        alert('Lod PGS data and input a valid user file!')
    }
};

/* ************* Polygenic Risk Score Calculation module ************* */

prscore.calculatePrs = () => {
    // Initialize snps for the trait from PGS Catalog
    prscore.pgs_snps = helper.getColumnData( prscore.pgsDataArray, 0)
    
    // Initialize snps from User data
    prscore.user_snps = helper.getColumnData( prscore.genomDataArray, 0)
    
    riskArr = []
    prscore.pgs_snps.forEach( (element, pgs_idx) => { // skip first row column names (ie rsid)
        //get the index of the 23and me rsids that are also in PGS
        var data_idx = prscore.user_snps.indexOf(element)
        if (data_idx != -1){
            var effect_allele = prscore.pgsDataArray[pgs_idx][2];
                      
            effect_allele_homozyg = effect_allele+effect_allele;
            
            data_alleles = prscore.genomDataArray[data_idx][3];
            if(prscore.type=="Ancestry"){
                data_alleles += prscore.genomDataArray[data_idx][4];
            }
    
            // find allele matches then seperatte homo v hetero matches
            results = data_alleles.match( RegExp(effect_allele, 'g') )

            if(results!=null){
                effect_weight = prscore.pgsDataArray[pgs_idx][4];
                
                if( results.length==2){
                    dosage = 2;
                }
                else if(results.length==1){
                    dosage = 1;
                }
                riskArr.push( effect_weight * dosage );
            }
            else{
                riskArr.push(0)
                console.log("no match!",0)
            }
        }
        variantMatches.innerHTML = `${riskArr.length+1} PGS variants found in ${prscore.type} file`
    })
    
    return math.sum(riskArr);
}

  
