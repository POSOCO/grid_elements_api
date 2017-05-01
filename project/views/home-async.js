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
            //create owners through post request
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

function createSubstationsAsync() {
    var substationsArray = sReader.statesArrays[0];
    var substations = [];
    for (var i = 1; i < substationsArray.length; i++) {
        var substationObj = substationsArray[i];
        if (substationObj.length >= 4 && substationObj[0] != null && substationObj[0].trim() != "") {
            var tempObj = {
                name: substationObj[0],
                ownerName: substationObj[1],
                voltage: substationObj[2],
                region: substationObj[3],
                state: substationObj[4],
                description: substationObj[5]
            };
            if (tempObj.description.trim() == "") {
                tempObj.description = "NA";
            }
            if (tempObj.ownerName.trim() == "") {
                tempObj.ownerName = "NA";
            }
            if (tempObj.region.trim() == "") {
                tempObj.region = "NA";
            }
            if (tempObj.state.trim() == "") {
                tempObj.state = "NA";
            }
            substations.push(tempObj);
        }
    }
    console.log(substations);
    $.ajax({
            //create substations through post request
            url: "http://localhost:3000/api/substations/create_array",
            type: "POST",
            data: JSON.stringify({substations: substations}),
            contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data["Error"]) {
                    WriteLineConsole("Substations couldn't be created, Error: " + JSON.stringify(data.Error));
                } else {
                    WriteLineConsole("Substations created !!!");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                WriteLineConsole("The Substations are not created :-(");
            }
        }
    );
}

//function (name, description, sil, stabilityLimit, thermalLimit, voltage, elem_num, ownerNames, regions, states, substationNames, substationVoltages, cond_type, line_len, no_load_mvar, done, conn) {
function createLinesAsync() {
    var linesArray = sReader.statesArrays[0];
    var lines = [];
    for (var i = 1; i < linesArray.length; i++) {
        var lineObj = linesArray[i];
        if (lineObj.length >= 4 && lineObj[0] != null && lineObj[0].trim() != "" && lineObj[1] != null && lineObj[1].trim() != "" && lineObj[2] != null && lineObj[2].trim() != "") {
            var tempObj = {
                name: lineObj[1].trim() + "-" + lineObj[2].trim(),
                description: "NA",
                elem_num: lineObj[3].trim(),
                ownerName: lineObj[4].trim(),
                voltage: lineObj[0].trim(),
                substation_names: [lineObj[1].trim(), lineObj[2].trim()],
                substation_voltages: [lineObj[0], lineObj[0]],
                line_len: lineObj[7].trim(),
                cond_type: lineObj[8].trim(),
                sil: lineObj[9].trim(),
                thermal_limit: lineObj[15].trim(),
                stability_limit: lineObj[16].trim(),
                no_load_mvar: lineObj[10].trim(),
                region: "NA",
                state: "NA"
            };
            if (tempObj.ownerName.trim() == "") {
                tempObj.ownerName = "NA";
            }
            if (tempObj.sil.trim() == "") {
                tempObj.sil = -1;
            }
            if (tempObj.line_len.trim() == "") {
                tempObj.line_len = -1;
            }
            if (tempObj.thermal_limit.trim() == "") {
                tempObj.thermal_limit = -1;
            }
            if (tempObj.stability_limit.trim() == "") {
                tempObj.stability_limit = -1;
            }
            if (tempObj.no_load_mvar.trim() == "") {
                tempObj.no_load_mvar = -1;
            }
            lines.push(tempObj);
        }
    }
    console.log(lines);
    $.ajax({
            //create substations through post request
            url: "http://localhost:3000/api/lines/create_array",
            type: "POST",
            data: JSON.stringify({lines: lines}),
            contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data["Error"]) {
                    WriteLineConsole("Lines couldn't be created, Error: " + JSON.stringify(data.Error));
                } else {
                    WriteLineConsole("Lines created !!!");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                WriteLineConsole("The Lines are not created :-(");
            }
        }
    );
}

//(name, description, sil, stabilityLimit, thermalLimit, elem_num, ownerNames, regions, states, substationNames, substationVoltages, line_name, line_volt, line_num, mvar, is_switchable, done, conn)
function createLineReactorsAsync() {
    var lineReactorsArray = sReader.statesArrays[0];
    var lineReactors = [];
    for (var i = 1; i < lineReactorsArray.length; i++) {
        var lineReactorObj = lineReactorsArray[i];
        if (lineReactorObj.length >= 4 && lineReactorObj[0] != null && lineReactorObj[0].trim() != "" && lineReactorObj[1] != null && lineReactorObj[1].trim() != "" && lineReactorObj[2] != null && lineReactorObj[2].trim() != "") {
            // if end1 LR mvar value is present
            var end1LrMvar = lineReactorObj[11].trim();
            var end1LrSwitchable = ((lineReactorObj[12].trim().toLowerCase() == '1') || (lineReactorObj[12].trim().toLocaleLowerCase() == 'yes')) ? 1 : 0;
            if (end1LrMvar != null && !isNaN(end1LrMvar) && end1LrMvar != "") {
                var tempObj = {
                    name: lineReactorObj[1].trim() + "-" + lineReactorObj[2].trim() + "-" + lineReactorObj[3].trim() + "@" + lineReactorObj[1].trim(),
                    description: "NA",
                    line_elem_num: lineReactorObj[3].trim(),
                    elem_num: 1,
                    ownerName: lineReactorObj[4].trim(),
                    voltage: lineReactorObj[0].trim(),
                    line_name: lineReactorObj[1].trim() + "-" + lineReactorObj[2].trim(),
                    substation_names: [lineReactorObj[1].trim()],
                    substation_voltages: [lineReactorObj[0]],
                    sil: -1,
                    thermal_limit: -1,
                    stability_limit: -1,
                    mvar: end1LrMvar,
                    is_switchable: end1LrSwitchable,
                    region: "WR",
                    state: "NA"
                };
                if (tempObj.ownerName.trim() == "") {
                    tempObj.ownerName = "NA";
                }
                lineReactors.push(tempObj);
            }
            var end2LrMvar = lineReactorObj[13].trim();
            var end2LrSwitchable = ((lineReactorObj[14].trim().toLowerCase() == '1') || (lineReactorObj[14].trim().toLocaleLowerCase() == 'yes')) ? 1 : 0;
            if (end2LrMvar != null && !isNaN(end2LrMvar) && end2LrMvar != "") {
                tempObj = {
                    name: lineReactorObj[1].trim() + "-" + lineReactorObj[2].trim() + "-" + lineReactorObj[3].trim() + "@" + lineReactorObj[2].trim(),
                    description: "NA",
                    line_elem_num: lineReactorObj[3].trim(),
                    elem_num: 1,
                    ownerName: lineReactorObj[4].trim(),
                    voltage: lineReactorObj[0].trim(),
                    line_name: lineReactorObj[1].trim() + "-" + lineReactorObj[2].trim(),
                    substation_names: [lineReactorObj[2].trim()],
                    substation_voltages: [lineReactorObj[0]],
                    sil: -1,
                    thermal_limit: -1,
                    stability_limit: -1,
                    mvar: end2LrMvar,
                    is_switchable: end2LrSwitchable,
                    region: "WR",
                    state: "NA"
                };
                if (tempObj.ownerName.trim() == "") {
                    tempObj.ownerName = "NA";
                }
                lineReactors.push(tempObj);
            }
        }
    }
    console.log(lineReactors);
    $.ajax({
            //create substations through post request
            url: "http://localhost:3000/api/line_reactors/create_array",
            type: "POST",
            data: JSON.stringify({lineReactors: lineReactors}),
            contentType: 'application/json; charset=UTF-8',
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data["Error"]) {
                    WriteLineConsole("Line Reactors couldn't be created, Error: " + JSON.stringify(data.Error));
                } else {
                    WriteLineConsole("Line Reactors created !!!");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                WriteLineConsole("The Line Reactors are not created :-(");
            }
        }
    );
}