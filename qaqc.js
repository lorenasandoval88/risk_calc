console.log('qaqc.js loaded')
qaqc = {}
qaqc.ui = (target = 'qaqcDiv') => {
    if (typeof (target) == 'string') {
        target = document.getElementById(target)
    }
    let h = '<p style="color:navy">Load a <button id="loadFile" onclick="qaqc.load(this)">file</button>,<button id="loadBQ" onclick="qaqc.load(this)">BQtable</button>, <button id="loadURL" onclick="qaqc.load(this)">URL</button>, <button id="loadBox" onclick="qaqc.load(this)">Box id</button>, or <button id="loadTxt" onclick="qaqc.load(this)">paste data as text</button></p>'
    h += '<div id="loadQAQC" style="color:blue"></div>'
    target.innerHTML = h
}

qaqc.openFile = (ev) => { // inspired by https://www.javascripture.com/FileReader
    var input = ev.target;
    fileInfo.innerText = new Date(input.files[0].lastModified)
    var reader = new FileReader();
    reader.onload = function () {
        qaqc.dataTxt = reader.result.trim(); // qaqc.dataTxt is defined here, it will be undefined by default
        qaqc.tabulateTxt()
        qaqc.dataAnalysis()
    };
    reader.readAsText(input.files[0]);
}

qaqc.loadURL = async (url = inputURL.value) => {
    qaqc.dataTxt = (await (await fetch(url)).text()).trim()
    qaqc.tabulateTxt()
    qaqc.dataAnalysis()
}

//----------load textbox
function getFile(event, textarea) {
    const input = event.target
    if ('files' in input && input.files.length > 0) {
        placeFileContent(
            document.getElementById(textarea),
            input.files[0])
    }
}

function placeFileContent(target, file) {
    readFileContent(file).then(content => {
        target.value = content
        console.log("place", content[1])
    }).catch(error => console.log(error))
}

function readFileContent(file) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target.result)
        reader.onerror = error => reject(error)
        reader.readAsText(file.slice(0,2000))
    })
}
//---------

qaqc.load = el => {
    let h = `${el.id} under development`
    switch (el.id) {
        case 'loadFile':
            h =
                `
            <pre id="fileInfo">Select file</pre>
            <input type="file" id="readButton" value={this.state.text} 
            onchange="qaqc.openFile(event);getFile(event, 'textbox')">
            <textarea id="textbox"></textarea>
            `
            loadQAQC.innerHTML = h;
            setTimeout(function () {
                readButton.click()
            }, 1000)
            break
        case 'loadBQ':
            h = `
            <pre id="fileInfo">upload file from BigQuery</pre>
            <form id="formResponse" method="post">
            <label>projectID: </label>
            <input type="text" id="projectID_input" name="projectID_input"><br><br>
            <button type="submit">Submit</button><br><br>
            <label>clientID: </label>
            <input type="text" id="clientID_input" name="clientID_input"><br><br>
            <button type="submit">Submit</button><br><br>
            <label>query: </label>
            <input type="text" id="query_input" name="query_input"><br><br>
            <button type="submit">Submit</button><br><br>
            </form>
            
            
            <button id="auth_button" onclick="auth();">Authorize</button>
            <div id="client_initiated"></div>
            <button id="dataset_button" style="display:none;" onclick="listDatasets();">Show datasets</button>
            <div id="result_box"></div>`
            loadQAQC.innerHTML = h;
            break
        case 'loadURL':
            h = `URL: <input id="inputURL"> <i id="loadFileFromURL" style="font-size:xx-large;color:green;cursor:pointer;vertical-align:bottom" class="fa fa-cloud-download" data-toggle="tooltip" data-placement="left" title="Load file from url" onclick="qaqc.loadURL()"></i> <i style="cursor:pointer" class="fa fa-external-link" data-toggle="tooltip" data-placement="left" title="open file in new tab"
 onclick="window.open(document.getElementById('inputURL').value)"></i>`
            break
        case 'loadBox':
            h = `<pre id="epibox_msg"></pre>
            <button onclick="epibox.checkToken()">Session</button>
            <button onclick="epibox.refreshToken()">Refresh</button>
            <button onclick="(async function(){await epibox.getUser();epibox.msg(JSON.stringify(epibox.oauth.user,null,3))})()">User</button>
            <button onclick="epibox.logout()">Logout</button>
            file id: <input id="boxInput" style="color:green">(enter)`
            setTimeout(async _ => {
                let ip = document.getElementById('boxInput')
                ip.focus()
                ip.onkeyup = evt => {
                    if (evt.keyCode == 13) { // if enter, for the iris.csv demo use 602505986610
                        epibox.msg('reading file ...')
                        epibox.getText(`https://api.box.com/2.0/files/${ip.value}/content`).then(txt => {
                            epibox.msg('... done')
                            qaqc.dataTxt = txt
                            qaqc.tabulateTxt()
                            qaqc.dataAnalysis()
                        })
                        /*
                        fetch(`https://api.box.com/2.0/files/${ip.value}/content`,{
                            method:'GET',
                            headers:{
                                Authorization:"Bearer "+epibox.oauth.token.access_token
                            }
                        }).then(x=>{
                            x.text().then(txt=>{
                                debugger
                            })
                        })
                        */
                    }
                    //debugger
                }
                epibox.checkToken()
            }, 1000)
            break
        default:
            console.warn(`button with id "${el.id}" not found`)
            break
    }
    loadQAQC.innerHTML = h
}


qaqc.tabulateTxt = (txt = qaqc.dataTxt) => {
    if (txt.slice(0, 1) == '[') {
        txt = '{' + txt + '}'
    }
    if (txt.slice(0, 1) == '{') {
        qaqc.data = JSON.parse(txt)
        qaqc.buildArray()
    } else {
        let arr = txt.split(/[\r\n]+/g).map(row => { // data array
            //if(row[0]=='    '){row='undefined   '+row}
            return row.replace(/"/g, '').split(/[,\t]/g) // split csv and tsv alike
        })
        if (arr.slice(-1).toLocaleString() == "") {
            arr.pop()
        }
        qaqc.data = {} // qaqc.data is defined here, it will be undefined by default
        qaqc.dataArray = [] // same for array
        labels = arr[0]
        labels.forEach((label) => {
            qaqc.data[label] = []
        })
        arr.slice(1).forEach((row, i) => {
            labels.forEach((label, j) => {
                qaqc.data[label][i] = row[j]
            })
        })
        labels.forEach(label => {
            qaqc.data[label] = qaqc.numberType(qaqc.data[label])
        })
        qaqc.buildArray()
    }

}

qaqc.numberType = aa => { // try to fit numeric typing
    let tp = 'number'
    aa.forEach(a => {
        if (!((a == parseFloat(a)) || (a == 'undefined') || (a == ''))) {
            tp = 'string'
        }
    })
    if (tp == 'number') {
        aa = aa.map(a => {
            if (a == 'undefined' || a == '') {
                a = undefined
            } else {
                a = parseFloat(a)
            }
            return a
        })
    }
    return aa
}

qaqc.saveFile = (txt, fileName) => {
    if (fileName) {
        const bb = new Blob([txt]);
        const url = URL.createObjectURL(bb);
        let a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        //return a
    } else {
        //let h=`filename:<input>
        //      <button onclick="qaqc.saveFile(decodeURIComponent('${encodeURIComponent(txt)}'),this.parentElement.querySelector('input').value)" txt="${txt}">Save as JSON Object</button>
        //      <button onclick="qaqc.saveFile(decodeURIComponent('${encodeURIComponent(txt)}'),this.parentElement.querySelector('input').value)" txt="${txt}">Save as JSON Array</button>`
        let h = `filename:<input value="file${Date.now().toString().slice(3)}.json">
              <button onclick="qaqc.saveFile(decodeURIComponent('${encodeURIComponent(JSON.stringify(qaqc.data))}'),this.parentElement.querySelector('input').value)" >Save as JSON Object</button>
              <button onclick="qaqc.saveFile(decodeURIComponent('${encodeURIComponent(JSON.stringify(qaqc.dataArray,null,3))}'),this.parentElement.querySelector('input').value)" >Save as JSON Array</button>`
        //<button onclick="qaqc.saveFile(decodeURIComponent('${encodeURIComponent(JSON.stringify(qaqc.data))}'),this.parentElement.querySelector('input').value)" >Save as JSON Object</button>
        //<button onclick="qaqc.saveFile(decodeURIComponent('${encodeURIComponent(JSON.stringify(qaqc.dataArray,null,3))}'),this.parentElement.querySelector('input').value)" txt="${txt}">Save as JSON Array</button>`
        return h
    }
}

qaqc.saveQC = (txt, fileName) => {
    if (fileName) {
        const bb = new Blob([txt]);
        const url = URL.createObjectURL(bb);
        let a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        //return a
    } else {
        let h = `filename:<input value="QC_script_${Date.now().toString().slice(3)}.txt">
             <button onclick="qaqc.saveQC(decodeURIComponent('${encodeURIComponent(txt)}'),this.parentElement.querySelector('input').value)" >Save QC script</button>`

        //<button onclick="qaqc.saveQC(decodeURIComponent('${txt}'),this.parentElement.querySelector('input1').value)" >Save QC script as txt</button>`
        return h
    }
}

qaqc.csvJSON = (csv) => {

    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
        var obj = {};
        var currentline = lines[i].split(",");

        for (var j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result; //JavaScript object
    //return JSON.stringify(JSON.parse(json),null,2); //JSON
}


qaqc.buildArray = () => {
    let labels = Object.keys(qaqc.data)
    let arr = []
    qaqc.data[labels[0]].forEach((v, i) => {
        arr[i] = {}
        labels.forEach(L => {
            arr[i][L] = qaqc.data[L][i]
        })
    })
    qaqc.dataArray = arr
    return arr
}


qaqc.dataAnalysis = (div = "dataAnalysisDiv") => {
    console.log(`qaqc analysis triggered at ${Date()}`)
    if (typeof (div) == 'string') {
        div = document.getElementById(div)
    }
    if (qaqc.data) {
        if (typeof (runQAQC) != 'undefined') {
            div.innerHTML = `<h2>Report</h2>
            <p style="font-size:small;color:green">[${Date()}]</p>
            <div id="qaqcReport">${runQAQC(qaqc.data)}</div>
            <hr>`
        } else {
            div.innerHTML = '<h3 style="color:red">no runQAQC function found ...</h3><p style="color:red">... please chose one from the Script List above</p>'
        }
    }
}

// processing url composition

qaqc.getParms = function () {
    if (localStorage.qaqcParms) {
        qaqc.parms = JSON.parse(localStorage.qaqcParms)
    } else {
        qaqc.parms = {}
    }
    let pp = location.hash.slice(1) + location.search.slice(1)
    pp.split('&').forEach(av => {
        av = av.split('=')
        qaqc.parms[av[0]] = av[1]
    })

    // actions
    if (qaqc.parms.url) {
        setTimeout(_ => {
            let loadURL = document.getElementById('loadURL')
            loadURL.click()
            inputURL.value = qaqc.parms.url
            setTimeout(function () {
                loadFileFromURL.click()
            }, 500)
        }, 2000)
    }
    if (qaqc.parms.script) {
        setTimeout(_ => {
            if (document.querySelectorAll('.runScript').length > 0) {
                document.querySelectorAll('.runScript')[qaqc.parms.script - 1].click()
            } else {
                setTimeout(_ => {
                    document.querySelectorAll('.runScript')[qaqc.parms.script - 1].click()
                }, 2000)
            }
        }, 100)
    }
    if (qaqc.parms.boxid) {
        setTimeout(_ => {
            document.getElementById('loadBox').click()
            setTimeout(_ => {
                boxInput.value = ''
                qaqc.parms.boxid.split('').forEach((_, i) => {
                    setTimeout(_ => {
                        boxInput.value += qaqc.parms.boxid[i]
                    }, i * 100)
                })
                epibox.getText(`https://api.box.com/2.0/files/${qaqc.parms.boxid}/content`).then(txt => {
                    //epibox.msg('... done')
                    qaqc.dataTxt = txt
                    qaqc.tabulateTxt()
                    qaqc.dataAnalysis()
                })
            }, 2000)
            //document.querySelectorAll('.runScript')[qaqc.parms.script-1].click()
        }, 3000)
    }



    //debugger
}
qaqc.getParms()

// bigquery

const a = document.getElementById('formResponse')
var newValue;
var clientId;
var query;

a.addEventListener('submit', e => {
    e.preventDefault()
    newValue = document.getElementById('projectID_input').value;
    clientId = document.getElementById('clientID_input').value;
    query = document.getElementById('query_input').value;
})
//(fixing BQtable with Lorena)

var config = {
    'client_id': clientId,
    'scope': 'https://www.googleapis.com/auth/bigquery'
};
// client side access to google bigquery https://download.huihoo.com/google/gdgdevkit/DVD1/developers.google.com/bigquery/authorization.html
function auth() {
    gapi.auth.authorize(config, function () {
        gapi.client.load('bigquery', 'v2');
        $('#client_initiated').html('BigQuery client authorized');
        $('#auth_button').fadeOut();
        $('#dataset_button').fadeIn();
        $('#query_button').fadeIn();
    });
}
//////////////////////////////////////////////////////////////////////////
function convertBQToMySQLResults(schema, rows) {
    var resultRows = []

    function recurse(schemaCur, rowsCur, colName) {
        if (Array.isArray(schemaCur) && !Array.isArray(result[colName])) {
            for (var i = 0, l = schemaCur.length; i < l; i++) {
                if (colName === "")
                    recurse(schemaCur[i], rowsCur.f[i], colName + schemaCur[i].name)
                else
                    recurse(schemaCur[i], rowsCur.f[i], colName + "." + schemaCur[i].name)
            }
        }

        if (schemaCur.type && schemaCur.type === "RECORD") {
            if (schemaCur.mode !== "REPEATED") {
                var valIndex = 0
                for (var p in schemaCur.fields) {
                    if (rowsCur.v === null) {
                        recurse(schemaCur.fields[p], rowsCur, colName + "." + schemaCur.fields[p].name)
                    } else {
                        recurse(schemaCur.fields[p], rowsCur.v.f[valIndex], colName + "." + schemaCur.fields[p]
                            .name)
                    }

                    valIndex++
                }
            }

            if (schemaCur.mode === "REPEATED") {
                result[colName] = []
                for (var x in rowsCur.v) {
                    recurse(schemaCur.fields, rowsCur.v[x], colName)
                }
            }
        } else {
            if (schemaCur.mode === "REPEATED") {
                if (rowsCur.v !== null) {
                    result[colName] = rowsCur.v.map((value, index) => {
                        return value.v
                    })
                } else {
                    result[colName] = [null]
                }

            } else if (Array.isArray(result[colName])) {
                let nextRow = {}
                for (var j in schemaCur) {
                    nextRow[colName + "." + schemaCur[j].name] = rowsCur.v.f[j].v
                }
                result[colName].push(nextRow)
            } else {
                if (colName !== "")
                    result[colName] = rowsCur.v
            }
        }
    }

    for (var r = 0, rowsCount = rows.length; r < rowsCount; r++) {
        var result = {};
        recurse(schema, rows[r], "")
        resultRows.push(result)
    }

    return resultRows
}

var objArray = [] //data
var items = {}
// Query function
function runQuery(projectNumber) {
    var request = gapi.client.bigquery.jobs.query({
        'projectId': projectNumber,
        'timeoutMs': '30000',
        'query': query //'SELECT * FROM [bigquery-public-data:samples.github_timeline]'
    });
    request.execute(function (response) {
        //$('#result_box').html(JSON.stringify(output, null)); // JSON original format with v, f

        // transfrom results from big query with v's and f's to JSON
        items = convertBQToMySQLResults(response.schema.fields, response.rows)
        // convert JSON to csv format and save. https://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
        const replacer = (key, value) => value === null ? '' :
            value // specify how you want to handle null values here
        const header = Object.keys(items[0])
        const csv = [
            header.join(',').replace(/d_/g, ""), // header row first, remove extra characters: "d_"
            ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer))
                .join(','))
        ].join('\r\n')

        // save items and csv version globally
        for ([key, val] of Object.entries(items)) {
            for ([key2, val2] of Object.entries(items[key])) {
                objArray.push(val2)
                break
            }
        }
        // view csv data in browser and console
        $('#result_box').html(csv);

        // download as csv https://stackoverflow.com/questions/17836273/export-javascript-data-to-csv-file-without-server-interaction
        var a = document.createElement('a');
        a.href = 'data:attachment/csv,' + encodeURIComponent(csv);
        a.target = '_blank';
        a.download = 'myFile.csv';
        document.body.appendChild(a);
        a.click();
    });

}


function listDatasets(projectNumber) {
    var request = gapi.client.bigquery.datasets.list({
        'projectId': projectNumber
    });
    request.execute(function (response) {
        $('#result_box').html(JSON.stringify(response.result.datasets, null));
        let datasets = JSON.stringify(response.result.datasets, null)
        console.log("datasets: ", datasets)
    });
}



const ab = document.getElementById('formResponse')
var newValue;
var clientId;
var query;

ab.addEventListener('submit', e => {
    e.preventDefault()
    newValue = document.getElementById('projectID_input').value;
    clientId = document.getElementById('clientID_input').value;
    query = document.getElementById('query_input').value;
})

var config = {
    'client_id': clientId,
    'scope': 'https://www.googleapis.com/auth/bigquery'
};
// client side access to google bigquery https://download.huihoo.com/google/gdgdevkit/DVD1/developers.google.com/bigquery/authorization.html
function auth() {
    gapi.auth.authorize(config, function () {
        gapi.client.load('bigquery', 'v2');
        $('#client_initiated').html('BigQuery client authorized');
        $('#auth_button').fadeOut();
        $('#dataset_button').fadeIn();
        $('#query_button').fadeIn();
    });
}
/////////////////////////////////// BIGQUERY
function convertBQToMySQLResults(schema, rows) {
    var resultRows = []

    function recurse(schemaCur, rowsCur, colName) {
        if (Array.isArray(schemaCur) && !Array.isArray(result[colName])) {
            for (var i = 0, l = schemaCur.length; i < l; i++) {
                if (colName === "")
                    recurse(schemaCur[i], rowsCur.f[i], colName + schemaCur[i].name)
                else
                    recurse(schemaCur[i], rowsCur.f[i], colName + "." + schemaCur[i].name)
            }
        }
        if (schemaCur.type && schemaCur.type === "RECORD") {
            if (schemaCur.mode !== "REPEATED") {
                var valIndex = 0
                for (var p in schemaCur.fields) {
                    if (rowsCur.v === null) {
                        recurse(schemaCur.fields[p], rowsCur, colName + "." + schemaCur.fields[p].name)
                    } else {
                        recurse(schemaCur.fields[p], rowsCur.v.f[valIndex], colName + "." + schemaCur.fields[p]
                            .name)
                    }
                    valIndex++
                }
            }
            if (schemaCur.mode === "REPEATED") {
                result[colName] = []
                for (var x in rowsCur.v) {
                    recurse(schemaCur.fields, rowsCur.v[x], colName)
                }
            }
        } else {
            if (schemaCur.mode === "REPEATED") {
                if (rowsCur.v !== null) {
                    result[colName] = rowsCur.v.map((value, index) => {
                        return value.v
                    })
                } else {
                    result[colName] = [null]
                }

            } else if (Array.isArray(result[colName])) {
                let nextRow = {}
                for (var j in schemaCur) {
                    nextRow[colName + "." + schemaCur[j].name] = rowsCur.v.f[j].v
                }
                result[colName].push(nextRow)
            } else {
                if (colName !== "")
                    result[colName] = rowsCur.v
            }
        }
    }

    for (var r = 0, rowsCount = rows.length; r < rowsCount; r++) {
        var result = {};
        recurse(schema, rows[r], "")
        resultRows.push(result)
    }

    return resultRows
}

var objArray = [] //data
var items = {}
// Query function
function runQuery(projectNumber) {
    var request = gapi.client.bigquery.jobs.query({
        'projectId': projectNumber,
        'timeoutMs': '30000',
        'query': query //'SELECT * FROM [bigquery-public-data:samples.github_timeline]'
    });
    request.execute(function (response) {
        //$('#result_box').html(JSON.stringify(output, null)); // JSON original format with v, f

        // transfrom results from big query with v's and f's to JSON
        items = convertBQToMySQLResults(response.schema.fields, response.rows)
        // convert JSON to csv format and save. https://stackoverflow.com/questions/8847766/how-to-convert-json-to-csv-format-and-store-in-a-variable
        const replacer = (key, value) => value === null ? '' :
            value // specify how you want to handle null values here
        const header = Object.keys(items[0])
        const csv = [
            header.join(',').replace(/d_/g, ""), // header row first, remove extra characters: "d_"
            ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer))
                .join(','))
        ].join('\r\n')

        // save items and csv version globally
        for ([key, val] of Object.entries(items)) {
            for ([key2, val2] of Object.entries(items[key])) {
                objArray.push(val2)
                break
            }
        }
        // view csv data in browser and console
        $('#result_box').html(csv);

        // download as csv https://stackoverflow.com/questions/17836273/export-javascript-data-to-csv-file-without-server-interaction
        var a = document.createElement('a');
        a.href = 'data:attachment/csv,' + encodeURIComponent(csv);
        a.target = '_blank';
        a.download = 'myFile.csv';
        document.body.appendChild(a);
        a.click();
    });

}

//(fixing BQtable with Lorena)
function listDatasets(projectNumber) {
    var request = gapi.client.bigquery.datasets.list({
        'projectId': projectNumber
    });
    request.execute(function (response) {
        $('#result_box').html(JSON.stringify(response.result.datasets, null));
        let datasets = JSON.stringify(response.result.datasets, null)
        console.log("datasets: ", datasets)
    });
}