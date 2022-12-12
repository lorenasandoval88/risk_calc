
helper = {}

/* Read local fle chosen by the user */
helper.getFileContent = (file) => {
    const reader = new FileReader()
    return new Promise( (resolve, reject) => {
        reader.onload = event => resolve(
            event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file) //file.slice(0,2011)      
    });
};

/* Process tabulated file contents, filters the comment lines marked with # character and returns as a datatable */
helper.getDatatable = (dataArray) => {
    dataArray = dataArray.split(/[\n\r]+/).filter(r=>r[0]!='#').map(r=>r.split(/\t/));
    return dataArray;
}

/* Get the values of a specific column of a datatable */
helper.getColumnData = (data, colIndex) => {
    var arr = []
    data.forEach( (row, index) => { arr.push(data[index][colIndex]) } );
    return arr;
};



