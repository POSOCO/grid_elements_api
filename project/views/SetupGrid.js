//TODO create the green bottom border for selected cell headers by attaching the selected-header class in the external overlays plugin which is not included
function setUpGrid(data, itemMetaDataFunctionFactory) {
    var gridElId = "#myGrid";
    var createGridColumns = function (keys) {
        var columns = [];
        keys = findAndRemoveFromArray(keys, 'is_cancelled');
        for (var i = 0; i < keys.length; i++) {
            columns.push({
                id: i,
                //name field is just for display
                name: keys[i],
                //"field" is the field used by the program a particular cell in row
                field: keys[i],
                width: 50,
                toolTip: keys[i]
            });
            if (keys[i] == 'edit') {
                columns[i].formatter = function (row, cell, value, columnDef, dataContext) {
                    return "<a class='code-row-edit-button ui-icon ui-icon-pencil' onclick='editCodeOfRow(" + row + ")'>Edit</a>";
                };
            }
            if (keys[i] == 'time' || keys[i] == 'codetime') {
                columns[i].formatter = function (row, cell, value, columnDef, dataContext) {
                    if (value == "null" || value == null || value == "") {
                        return "";
                    }
                    else {
                        return getDateTimeString(new Date(value));
                    }
                };
            }
        }
        return columns;
    };

    var headerClick = function (e, args) {
        var colInd = args.grid.getColumnIndex(args.column.id);
        args.grid.getSelectionModel().setSelectedRanges([new Slick.Range(0, colInd, args.grid.getDataLength() - 1, colInd)]);
        //console.log(columnID);
        //args.grid.getColumns().length
    };
    var grid;
    //var data = []; //The data used by the cell grid
    //cell grid options for customization
    var options = {
        editable: true,
        enableAddRow: true,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: false
    };

    var undoRedoBuffer = {
        commandQueue: [],
        commandCtr: 0,

        queueAndExecuteCommand: function (editCommand) {
            this.commandQueue[this.commandCtr] = editCommand;
            this.commandCtr++;
            editCommand.execute();
        },

        undo: function () {
            if (this.commandCtr == 0)
                return;

            this.commandCtr--;
            var command = this.commandQueue[this.commandCtr];

            if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
                command.undo();
            }
        },
        redo: function () {
            if (this.commandCtr >= this.commandQueue.length)
                return;
            var command = this.commandQueue[this.commandCtr];
            this.commandCtr++;
            if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
                command.execute();
            }
        }
    };
    // undo shortcut
    $(document).keydown(function (e) {
        if (e.which == 90 && (e.ctrlKey || e.metaKey)) { // CTRL + (shift) + Z
            if (e.shiftKey) {
                undoRedoBuffer.redo();
            } else {
                undoRedoBuffer.undo();
            }
        }
    });

    var pluginOptions = {
        clipboardCommandHandler: function (editCommand) {
            undoRedoBuffer.queueAndExecuteCommand.call(undoRedoBuffer, editCommand);
        },
        includeHeaderWhenCopying: false
    };
    //cell grid options for customization over
    var columns = createGridColumns(Object.keys(data[0]));
    //setting meta data for data array
    data.getItemMetadata = itemMetaDataFunctionFactory(data);
    //Building the grid and configuring the grid
    grid = new Slick.Grid(gridElId, data, columns, options);
    grid.setSelectionModel(new Slick.CellSelectionModel());
    //enabling the excel style functionality by the plugin
    grid.registerPlugin(new Slick.CellExternalCopyManager(pluginOptions));
    grid.registerPlugin(new Slick.AutoTooltips());
    //grid.registerPlugin(new Ext.Plugins.Overlays({}));
    grid.onCellChanged;
    $(grid.getContainerNode()).keydown(function (event) {
        if (event.ctrlKey && event.keyCode === 65) {
            event.preventDefault();
            grid.getSelectionModel().setSelectedRanges([new Slick.Range(0, 0, grid.getDataLength() - 1, grid.getColumns().length - 1)]);
        }
    });
    // Need to use a DataView for the filler plugin
    /*var dataView = new Slick.Data.DataView();
     dataView.onRowCountChanged.subscribe(function (e, args) {
     grid.updateRowCount();
     grid.render();
     });
     dataView.onRowsChanged.subscribe(function (e, args) {
     grid.invalidateRows(args.rows);
     grid.render();
     });
     dataView.beginUpdate();
     dataView.setItems(data);
     dataView.endUpdate();*/
    grid.registerPlugin(new Slick.AutoColumnSize());
    grid.onHeaderClick.subscribe(headerClick);
    var e = jQuery.Event("keydown");
    var fake = $.extend({}, jQuery.Event("keydown"), {which: 65, ctrlKey: true, shiftKey: true});
    return grid;
}