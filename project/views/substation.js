function createSubstations(i) {
    createSubstation(1);
}
function createSubstation(i) {
    var substationName = sReader.statesArrays[0][i][0];
    var ownerName = sReader.statesArrays[0][i][1];
    var voltage = sReader.statesArrays[0][i][2];
    if (substationName == undefined || substationName == null || substationName.trim() == "") {
        WriteLineConsole("Encountered a blank substation name at row " + i);
        return
    }
    if (voltage == undefined || voltage == null || voltage.trim() == "") {
        WriteLineConsole("Encountered a blank voltage level at row " + i + ". So this row insertion is skipped");
        return;
    }
    //WriteLineConsole("Creating (" + substationName + ", " + ownerName + ", " + voltage + ")");
    //Insert into the substation table
    //window.setTimeout(forceCreateASubstation, i * 100, substationName, ownerName, voltage);
    forceCreateASubstation(substationName, ownerName, voltage, i);
}

function forceCreateASubstation(substationName, ownerName, voltage, iter, callback) {
    //WriteLineConsole("Creating (" + substationName + ", " + ownerName + ", " + voltage + ")");
    var successFunction = (function (substationName, iter) {
        return function (data) {
            if (data["Error"]) {
                WriteLineConsole("Substation " + substationName + "couldn't be inserted, Error: " + JSON.stringify(data.Error));
            } else {
                console.log(data);
                if (true) {
                    WriteLineConsole("The Substation " + substationName + " is created :-)");
                } else {
                    WriteLineConsole("The Substation " + substationName + " is not created :-(");
                }
            }
            createSubstation(iter + 1);
        };
    })(substationName, iter);
    var errorFunction = (function (substationName, iter) {
        return function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            WriteLineConsole("The substationName " + substationName + " is not created :-(");
            createSubstation(iter + 1);
        };
    })(substationName, iter);
    $.ajax({
            //create owner through post request
            url: "http://localhost:3000/api/substations/create_from_csv",
            type: "POST",
            data: {name: substationName, voltage: voltage, owner: ownerName},
            dataType: "json",
            success: successFunction,
            error: errorFunction
        }
    );
}