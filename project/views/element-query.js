window.onload = function () {
    var data = [];
    $('#example').DataTable({
        responsive: true,
        "data": data,
        "order": [[ 1, "asc" ]],
        "columns": [
            {"data": "id"},
            {"data": "name"},
            {"data": "description"},
            {"data": "type"},
            {"data": "level"},
            {"data": "owner_names"},
            {"data": "region_names"},
            {"data": "ss_names"},
            {"data": "ss_owner_names"},
            {"data": "ss_region_names"}
        ]
    });
    refreshTableData();
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