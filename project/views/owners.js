//Handle each row
//If region id = null reject
//Get the id of the region from regions table
//If region not present create a region and get the id
//Now insert the row data with the region id obtained
//done :-)

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
                WriteLineConsole("The ownerName " + ownerName + " is created :-)");
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