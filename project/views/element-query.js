window.onload = function () {
    var data = [];
    $('#example').DataTable({
        responsive: true,
        "data": data,
        "order": [[1, "asc"]],
        "lengthMenu": [ [10, 25, 50, 100, 200, 500, 800, 1000, 1500, 1800, -1], [10, 25, 50, 100, 200, 500, 800, 1000, 1500, 1800, "All"] ],
        "columns": [
            {"data": "id"},
            {"data": "name"},
            {"data": "description"},
            {"data": "type"},
            {"data": "level"},
            {"data": "el_owners_list"},
            {"data": "el_regions_list"},
            {"data": "el_states_list"},
            {"data": "ss_names_list"},
            {"data": "elem_num"},
            {"data": "ss_owners_list"},
            {"data": "ss_regions_list"},
            {"data": "ss_states_list"}
        ]
    });
    refreshTableData();
    getTypesFromServer();
    getVoltagesFromServer();
    getRegionsFromServer();
};

function refreshTableData() {
    var table = $('#example').dataTable();
    var payLoad = {
        name: document.getElementById("name_search_str").value,
        owner: document.getElementById("owner_search_str").value,
        voltage: document.getElementById("volt_level_search_str").value,
        type: document.getElementById("type_search_str").value,
        region: document.getElementById("region_search_str").value,
        limit_rows: document.getElementById("server_rows_limit_input").value,
        offset_page: document.getElementById("server_rows_page_input").value
    };

    $.ajax({
        url: "/api/elements/",
        type: 'GET',
        data: payLoad,
        success: function (result) {
            //toastr["info"]("Data received from server");
            console.log(result);
            var dataArray = result.data;
            if (typeof dataArray != 'undefined' && dataArray != null && dataArray.constructor === Array && dataArray.length > 0) {
                table.fnClearTable();
                table.fnAddData(dataArray);
            }
        },
        error: function (textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function getTypesFromServer() {
    $.ajax({
        url: "/api/element_types/",
        type: 'GET',
        success: function (result) {
            //toastr["info"]("Data received from server");
            console.log(result);
            var dataArray = result.data;
            if (typeof dataArray != 'undefined' && dataArray != null && dataArray.constructor === Array && dataArray.length > 0) {
                document.getElementById('type_search_str').innerHTML = "";
                appendOptionsToSelectBox("type_search_str", "", "-- Please select --");
                for (var i = 0; i < dataArray.length; i++) {
                    appendOptionsToSelectBox("type_search_str", dataArray[i].type, dataArray[i].type);
                }
                $('#type_search_str').selectpicker('refresh');
            }
        },
        error: function (textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function getVoltagesFromServer() {
    $.ajax({
        url: "/api/voltages/",
        type: 'GET',
        success: function (result) {
            //toastr["info"]("Data received from server");
            console.log(result);
            var dataArray = result.data;
            if (typeof dataArray != 'undefined' && dataArray != null && dataArray.constructor === Array && dataArray.length > 0) {
                document.getElementById('volt_level_search_str').innerHTML = "";
                appendOptionsToSelectBox("volt_level_search_str", "", "-- Please select --");
                for (var i = 0; i < dataArray.length; i++) {
                    appendOptionsToSelectBox("volt_level_search_str", dataArray[i].level, dataArray[i].level);
                }
                $('#volt_level_search_str').selectpicker('refresh');
            }
        },
        error: function (textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function getRegionsFromServer(){
    $.ajax({
        url: "/api/regions/",
        type: 'GET',
        success: function (result) {
            //toastr["info"]("Data received from server");
            console.log(result);
            var dataArray = result.data;
            if (typeof dataArray != 'undefined' && dataArray != null && dataArray.constructor === Array && dataArray.length > 0) {
                document.getElementById('region_search_str').innerHTML = "";
                appendOptionsToSelectBox("region_search_str", "", "-- Please select --");
                for (var i = 0; i < dataArray.length; i++) {
                    appendOptionsToSelectBox("region_search_str", dataArray[i].name, dataArray[i].name);
                }
                $('#region_search_str').selectpicker('refresh');
            }
        },
        error: function (textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function appendOptionsToSelectBox(selectBoxId, optionValue, optionText) {
    var option = document.createElement("option");
    option.text = optionText;
    option.value = optionValue;
    var select = document.getElementById(selectBoxId);
    select.appendChild(option);
}