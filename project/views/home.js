/**
 * Created by Nagasudhir on 9/6/2016.
 */
var sReader;

window.onload = function () {
    var fileInput = document.getElementById("StatesFileInput");
    fileInput.addEventListener('change', function (e) {
        var fileInput = e.target;
        sReader = new statesReader();
        sReader.cleanStateFiles();
        for (var b = 0; b < fileInput.files.length; b++) {
            sReader.pushFiles(fileInput.files[b]);
        }
        sReader.afterEachRead(fileInput.getAttribute("id"));
    });
};

function statesReader() {
    var statesArrays = [];
    var stateFiles = [];
    var fileIterator = 0;

    this.statesArrays = statesArrays;
    this.stateFiles = stateFiles;
    this.fileIterator = fileIterator;

    this.cleanStateFiles = cleanStateFiles;
    this.pushFiles = pushFiles;
    this.loadNext = loadNext;
    this.afterEachRead = afterEachRead;

    function cleanStateFiles() {
        stateFiles = [];
        fileIterator = 0;
    }

    function pushFiles(file) {
        stateFiles.push(file);
    }

    //file reader feature
    function loadNext() {
        //remove file from array to save memory
        stateFiles[fileIterator] = null;
        //increment iterator
        fileIterator = fileIterator + 1;
        if (fileIterator < stateFiles.length) {
            afterEachRead();
        }
    }

    //file reader feature
    function afterEachRead() {
        var reader = new FileReader();
        if (!Array.isArray(statesArrays)) {
            statesArrays = [];
        }
        var file = stateFiles[fileIterator];
        reader.onload = function (e) {
            statesArrays[fileIterator] = CSVToArray(reader.result);
            //do something with the text here
            console.log("The parsed states file is ");
            console.log(statesArrays[fileIterator]);
            loadNext();
        };
        reader.readAsText(file);
    }
}

function createStates() {
    //Create the states table or create new if absent
    for (var i = 1; i < 1000; i++) {
        var sName = sReader.statesArrays[0][i][1];
        if (sName == undefined || sName == null || sName.trim() == "") {
            break;
        }
        $.ajax({
                //create code through post request
                url: "http://localhost:3000/api/states/get_by_name?name=" + sName,
                type: "GET",
                dataType: "json",
                success: (function (sName) {
                    return function (data) {
                        console.log(data);
                        if (data["Error"]) {
                            WriteLineConsole("State " + sName + "couldn't be found, Error: " + JSON.stringify(data.Error));
                            createAState(sName);
                        } else {
                            if (data.state.length == 0) {
                                createAState(sName);
                            }
                            else {
                                WriteLineConsole("The state " + sName + " is already created with id = " + (data.state[0].id ? data.state[0].id : "xxxx") + " :-)");
                            }
                        }
                    };
                })
                (sName),
                error: (function (sName) {
                    return function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
                        WriteLineConsole("The state " + sName + " is not found :-(");
                        createAState(sName);
                    };
                })(sName)
            }
        )
        ;
    }
}

function createAState(sName) {
    var successFunction = (function (sName) {
        return function (data) {
            //console.log(data);
            if (data["Error"]) {
                WriteLineConsole("State " + sName + "couldn't be inserted, Error: " + JSON.stringify(data.Error));
            } else {
                if (data.redirect) {
                    // data.redirect contains the string URL to redirect to
                    window.location.href = data.redirect;
                }
                WriteLineConsole("The state " + sName + " is created :-)");
            }
        };
    })(sName);
    var errorFunction = (function (sName) {
        return function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            WriteLineConsole("The state " + sName + " is not created :-(");
        };
    })(sName);
    $.ajax({
            //create code through post request
            url: "http://localhost:3000/api/states/",
            type: "POST",
            data: {name: sName},
            dataType: "json",
            success: successFunction,
            error: errorFunction
        }
    );
}

function createRegions() {
    //Create the states table or create new if absent
    for (var i = 1; i < 1000; i++) {
        var region = sReader.statesArrays[0][i][1];
        if (region == undefined || region == null || region.trim() == "") {
            break;
        }
        $.ajax({
                //create code through post request
                url: "http://localhost:3000/api/regions/get_by_name?name=" + region,
                type: "GET",
                dataType: "json",
                success: (function (region) {
                    return function (data) {
                        console.log(data);
                        if (data["Error"]) {
                            WriteLineConsole("Region " + region + "couldn't be found, Error: " + JSON.stringify(data.Error));
                            createARegion(region);
                        } else {
                            if (data.region.length == 0) {
                                createARegion(region);
                            }
                            else {
                                WriteLineConsole("The region " + region + " is already created with id = " + (data.region[0].id ? data.region[0].id : "xxxx") + " :-)");
                            }
                        }
                    };
                })(region),
                error: (function (region) {
                    return function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
                        WriteLineConsole("The region " + region + " is not found :-(");
                        createARegion(region);
                    };
                })(region)
            }
        );
    }
}

function createARegion(region) {
    var successFunction = (function (region) {
        return function (data) {
            //console.log(data);
            if (data["Error"]) {
                WriteLineConsole("Region " + region + "couldn't be inserted, Error: " + JSON.stringify(data.Error));
            } else {
                WriteLineConsole("The region " + region + " is created :-)");
            }
        };
    })(region);
    var errorFunction = (function (region) {
        return function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            WriteLineConsole("The region " + region + " is not created :-(");
        };
    })(region);
    $.ajax({
            //create code through post request
            url: "http://localhost:3000/api/regions/",
            type: "POST",
            data: {name: region},
            dataType: "json",
            success: successFunction,
            error: errorFunction
        }
    );
}

function createVoltages() {
    //Create the states table or create new if absent
    for (var i = 1; i < 1000; i++) {
        var voltage = sReader.statesArrays[0][i][1];
        if (voltage == undefined || voltage == null || voltage.trim() == "") {
            break;
        }
        $.ajax({
                //create code through post request
                url: "http://localhost:3000/api/voltages/get_by_level?level=" + voltage,
                type: "GET",
                dataType: "json",
                success: (function (voltage) {
                    return function (data) {
                        console.log(data);
                        if (data["Error"]) {
                            WriteLineConsole("Voltage " + voltage + "couldn't be found, Error: " + JSON.stringify(data.Error));
                            createAVoltage(voltage);
                        } else {
                            if (data.voltage.length == 0) {
                                createAVoltage(voltage);
                            }
                            else {
                                WriteLineConsole("The voltage " + voltage + " is already created with id = " + (data.voltage[0].id ? data.voltage[0].id : "xxxx") + " :-)");
                            }
                        }
                    };
                })(voltage),
                error: (function (voltage) {
                    return function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
                        WriteLineConsole("The voltage " + voltage + " is not found :-(");
                        createAVoltage(voltage);
                    };
                })(voltage)
            }
        )
        ;
    }
}

function createAVoltage(voltage) {
    var successFunction = (function (voltage) {
        return function (data) {
            //console.log(data);
            if (data["Error"]) {
                WriteLineConsole("Voltage " + voltage + "couldn't be inserted, Error: " + JSON.stringify(data.Error));
            } else {
                WriteLineConsole("The voltage " + voltage + " is created :-)");
            }
        };
    })(voltage);
    var errorFunction = (function (voltage) {
        return function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            WriteLineConsole("The voltage " + voltage + " is not created :-(");
        };
    })(voltage);
    $.ajax({
            //create code through post request
            url: "http://localhost:3000/api/voltages/",
            type: "POST",
            data: {level: voltage},
            dataType: "json",
            success: successFunction,
            error: errorFunction
        }
    );
}

function createElementTypes() {
    //Create the states table or create new if absent
    for (var i = 1; i < 1000; i++) {
        var el_type = sReader.statesArrays[0][i][1];
        if (el_type == undefined || el_type == null || el_type.trim() == "") {
            break;
        }
        $.ajax({
                //create code through post request
                url: "http://localhost:3000/api/element_types/get_by_type?type=" + el_type,
                type: "GET",
                dataType: "json",
                success: (function (el_type) {
                    return function (data) {
                        console.log(data);
                        if (data["Error"]) {
                            WriteLineConsole("Element type " + el_type + "couldn't be found, Error: " + JSON.stringify(data.Error));
                            createAnElementType(el_type);
                        } else {
                            if (data.el_type.length == 0) {
                                createAnElementType(el_type);
                            }
                            else {
                                WriteLineConsole("The Element type " + el_type + " is already created with id = " + (data.el_type[0].id ? data.el_type[0].id : "xxxx") + " :-)");
                            }
                        }
                    };
                })(el_type),
                error: (function (el_type) {
                    return function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
                        WriteLineConsole("The element type " + el_type + " is not found :-(");
                        createAnElementType(el_type);
                    };
                })(el_type)
            }
        )
        ;
    }
}

function createAnElementType(el_type) {
    var successFunction = (function (el_type) {
        return function (data) {
            //console.log(data);
            if (data["Error"]) {
                WriteLineConsole("Element type " + el_type + "couldn't be inserted, Error: " + JSON.stringify(data.Error));
            } else {
                WriteLineConsole("The element type " + el_type + " is created :-)");
            }
        };
    })(el_type);
    var errorFunction = (function (el_type) {
        return function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            WriteLineConsole("The element type " + el_type + " is not created :-(");
        };
    })(el_type);
    $.ajax({
            //create code through post request
            url: "http://localhost:3000/api/element_types/",
            type: "POST",
            data: {type: el_type},
            dataType: "json",
            success: successFunction,
            error: errorFunction
        }
    );
}

function createConductorTypes() {
    //Create the states table or create new if absent
    for (var i = 1; i < 1000; i++) {
        var con_type = sReader.statesArrays[0][i][1];
        if (con_type == undefined || con_type == null || con_type.trim() == "") {
            break;
        }
        $.ajax({
                //create code through post request
                url: "http://localhost:3000/api/conductor_types/get_by_name?name=" + con_type,
                type: "GET",
                dataType: "json",
                success: (function (con_type) {
                    return function (data) {
                        console.log(data);
                        if (data["Error"]) {
                            WriteLineConsole("Conductor type " + con_type + "couldn't be found, Error: " + JSON.stringify(data.Error));
                            createAConductorType(con_type);
                        } else {
                            if (data.con_type.length == 0) {
                                createAConductorType(con_type);
                            }
                            else {
                                WriteLineConsole("The Conductor type " + con_type + " is already created with id = " + (data.con_type[0].id ? data.con_type[0].id : "xxxx") + " :-)");
                            }
                        }
                    };
                })(con_type),
                error: (function (con_type) {
                    return function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
                        WriteLineConsole("The Conductor type " + con_type + " is not found :-(");
                        createAConductorType(con_type);
                    };
                })(con_type)
            }
        )
        ;
    }
}

function createAConductorType(con_type) {
    var successFunction = (function (con_type) {
        return function (data) {
            //console.log(data);
            if (data["Error"]) {
                WriteLineConsole("Conductor type " + con_type + "couldn't be inserted, Error: " + JSON.stringify(data.Error));
            } else {
                WriteLineConsole("The Conductor type " + con_type + " is created :-)");
            }
        };
    })(con_type);
    var errorFunction = (function (con_type) {
        return function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            WriteLineConsole("The Conductor type " + con_type + " is not created :-(");
        };
    })(con_type);
    $.ajax({
            //create code through post request
            url: "http://localhost:3000/api/conductor_types/",
            type: "POST",
            data: {type: con_type},
            dataType: "json",
            success: successFunction,
            error: errorFunction
        }
    );
}