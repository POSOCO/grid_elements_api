//Handle each row
function createOwners() {
    for (var i = 1; i < 1000; i++) {
        var ownerName = sReader.statesArrays[0][i][1];
        var metadata = sReader.statesArrays[0][i][2];
        var regionName = sReader.statesArrays[0][i][3];
        if (ownerName == undefined || ownerName == null || ownerName.trim() == "") {
            WriteLineConsole("Encountered a blank owner name at row " + i);
            break;
        }
        if (regionName == undefined || regionName == null || regionName.trim() == "") {
            WriteLineConsole("Encountered a blank region name at row " + i + ". So this row insertion is skipped");
            break;
        }
        //Insert into the owner table
        forceCreateAnOwner(ownerName, metadata, regionName);
    }
}

function forceCreateAnOwner(ownerName, metadata, regionName, callback) {
    var successFunction = (function (ownerName) {
        return function (data) {
            //console.log(data);
            if (data["Error"]) {
                WriteLineConsole("Owner " + ownerName + "couldn't be inserted, Error: " + JSON.stringify(data.Error));
            } else {
                console.log(data);
                if(data.affectedRows > 0){
                    WriteLineConsole("The owner " + ownerName + " is created :-)");
                } else{
                    WriteLineConsole("The owner " + ownerName + " is not created :-(");
                }
            }
        };
    })(ownerName);
    var errorFunction = (function (ownerName) {
        return function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            WriteLineConsole("The ownerName " + ownerName + " is not created :-(");
        };
    })(ownerName);
    $.ajax({
            //create owner through post request
            url: "http://localhost:3000/api/owners/force_create",
            type: "POST",
            data: {name: ownerName, metadata: metadata, region_name: regionName},
            dataType: "json",
            success: successFunction,
            error: errorFunction
        }
    );
}