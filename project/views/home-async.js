function createRegionsAsync() {
    var regionsArray = sReader.statesArrays[0];
    var regionNames = [];
    for (var i = 1; i < regionsArray.length; i++) {
        var regionObj = regionsArray[i];
        if (regionObj.length > 1 && regionObj[1] != null && regionObj[1].trim() != "") {
            regionNames.push(regionObj[1]);
        }
    }
    console.log(regionNames);
    $.ajax({
            //create code through post request
            url: "http://localhost:3000/api/regions/create_array",
            type: "POST",
            data: {names: regionNames},
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data["Error"]) {
                    WriteLineConsole("Regions couldn't be created, Error: " + JSON.stringify(data.Error));
                } else {
                    WriteLineConsole("Regions created !!!");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                WriteLineConsole("The regions are not created :-(");
            }
        }
    );
}

function createStatesAsync() {
    var statesArray = sReader.statesArrays[0];
    var stateNames = [];
    for (var i = 1; i < statesArray.length; i++) {
        var stateObj = statesArray[i];
        if (stateObj.length > 1 && stateObj[1] != null && stateObj[1].trim() != "") {
            stateNames.push(stateObj[1]);
        }
    }
    console.log(stateNames);
    $.ajax({
            //create code through post request
            url: "http://localhost:3000/api/states/create_array",
            type: "POST",
            data: {names: stateNames},
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data["Error"]) {
                    WriteLineConsole("States couldn't be created, Error: " + JSON.stringify(data.Error));
                } else {
                    WriteLineConsole("States created !!!");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                WriteLineConsole("The states are not created :-(");
            }
        }
    );
}

function createVoltagesAsync() {
    var voltagesArray = sReader.statesArrays[0];
    var voltageLevels = [];
    for (var i = 1; i < voltagesArray.length; i++) {
        var voltObj = voltagesArray[i];
        if (voltObj.length > 1 && voltObj[1] != null && voltObj[1].trim() != "") {
            voltageLevels.push(voltObj[1]);
        }
    }
    console.log(voltageLevels);
    $.ajax({
            //create code through post request
            url: "http://localhost:3000/api/voltages/create_array",
            type: "POST",
            data: {names: voltageLevels},
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data["Error"]) {
                    WriteLineConsole("Voltages couldn't be created, Error: " + JSON.stringify(data.Error));
                } else {
                    WriteLineConsole("Voltages created !!!");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                WriteLineConsole("The voltages are not created :-(");
            }
        }
    );
}

function createElementTypesAsync() {
    var elemTypesArray = sReader.statesArrays[0];
    var elemTypes = [];
    for (var i = 1; i < elemTypesArray.length; i++) {
        var elemTypeObj = elemTypesArray[i];
        if (elemTypeObj.length > 1 && elemTypeObj[1] != null && elemTypeObj[1].trim() != "") {
            elemTypes.push(elemTypeObj[1]);
        }
    }
    console.log(elemTypes);
    $.ajax({
            //create code through post request
            url: "http://localhost:3000/api/element_types/create_array",
            type: "POST",
            data: {names: elemTypes},
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data["Error"]) {
                    WriteLineConsole("Element types couldn't be created, Error: " + JSON.stringify(data.Error));
                } else {
                    WriteLineConsole("Element types created !!!");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                WriteLineConsole("The Element types are not created :-(");
            }
        }
    );
}

function createConductorTypesAsync() {
    var condTypesArray = sReader.statesArrays[0];
    var condTypes = [];
    for (var i = 1; i < condTypesArray.length; i++) {
        var condTypeObj = condTypesArray[i];
        if (condTypeObj.length > 1 && condTypeObj[1] != null && condTypeObj[1].trim() != "") {
            condTypes.push(condTypeObj[1]);
        }
    }
    console.log(condTypes);
    $.ajax({
            //create code through post request
            url: "http://localhost:3000/api/conductor_types/create_array",
            type: "POST",
            data: {names: condTypes},
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data["Error"]) {
                    WriteLineConsole("Conductor types couldn't be created, Error: " + JSON.stringify(data.Error));
                } else {
                    WriteLineConsole("Conductor types created !!!");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                WriteLineConsole("The Conductor types are not created :-(");
            }
        }
    );
}

function createOwnersAsync() {
    var ownersArray = sReader.statesArrays[0];
    var owners = [];
    for (var i = 1; i < ownersArray.length; i++) {
        var ownerObj = ownersArray[i];
        if (ownerObj.length >= 4 && ownerObj[1] != null && ownerObj[1].trim() != "") {
            owners.push({name: ownerObj[1], metadata: ownerObj[2], region: ownerObj[3]});
        }
    }
    console.log(owners);
    $.ajax({
            //create code through post request
            url: "http://localhost:3000/api/owners/create_array",
            type: "POST",
            data: JSON.stringify({owners: owners}),
            contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data["Error"]) {
                    WriteLineConsole("Owners couldn't be created, Error: " + JSON.stringify(data.Error));
                } else {
                    WriteLineConsole("Owners created !!!");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                WriteLineConsole("The Owners are not created :-(");
            }
        }
    );

}