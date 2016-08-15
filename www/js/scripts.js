
function yesUploadSelected(){
    $("#browse-options").fadeIn();
}

function noUploadSelected(){
    $('#file-select-interface').slideDown();
    populateSelectCSVDropdown();
    $('#file-upload-interface').slideUp();
}

function browse(){
	$('#upload').click();
}

function initializeUploadInterface(){
    $(document).ready(function () {
	    $('#main-form').on('submit', function(e) {
		e.preventDefault();
	    });
	});
	$(function () {
    		$('#upload').fileupload({
			url: '/cgi-bin/upload.py',
        		dataType: 'json',
    			done: function (e, data) {
				var fileStatus = data["result"]["files"];
                    if (fileStatus["error"] != undefined){
                        var message = "<b style='color:red'> Error: </b>" + fileStatus["error"];
                        bootbox.alert(message, function(){
                        });
                    }
                    else{
                            $("#browse-button").text("Upload Another");
                            $("#done-uploading-button").slideDown();
                    }
                }
    		});
	});
	$('#upload').fileupload({
    		progressall: function (e, data) {
        	var progress = parseInt(data.loaded / data.total * 100, 10);
        		$('#progress .bar').css(
            			'width',
            			progress + '%'
        		);
    		}
	});
}

function populateSelectCSVDropdown(){
    $.get("cgi-bin/list_csv_files.py", function(response){
        var response = JSON.parse(response)
            if (response["error"] == undefined ){
                var data = response["success"];
                var html = '';
                for(var i=0; i < data.length; i++){
                    html+="<li role='presentation'><a onclick='displayColumnMappingInterface(\"" + data[i] + "\")'>" + data[i] + "</a></li>";
                }
                $("#file-selection-content").html(html);

            }
            else{
                alert("Error loading CSV files from www/csvs maybe check file permissions?");
            }
    });
}

function displayColumnMappingInterface(csvname){
    $('#column-mapping-interface').slideDown()
    $('#file-to-analyze-title').text(csvname)
    $.get('cgi-bin/list_column_headings.py?csvname=' + csvname, function(response){
        var response = JSON.parse(response);
        if (response["error"] == undefined){
            var data = response["success"];
            var html = '';
            for(var i=0; i < data.length; i++){
                html+="<li onclick='populateCorrespondingIndexBox($(this));' role='presentation'><a>" + data[i] + "</a></li>";
            }
            $('#src-ip-selection-content').html(html);
            $('#dst-ip-selection-content').html(html);
            $('#src-port-selection-content').html(html);
            $('#dst-port-selection-content').html(html);
            $('#size-selection-content').html(html);
        }
        else{
        }
    });
}

function populateCorrespondingIndexBox(element){
    if(element.parent().attr("id") == "src-ip-selection-content"){
        $("#src-ip-index").val(element.index());
    }
    else if(element.parent().attr("id") == "dst-ip-selection-content"){
        $("#dst-ip-index").val(element.index());
    }
    else if(element.parent().attr("id") == "src-port-selection-content"){
        $("#src-port-index").val(element.index());
    }
    else if(element.parent().attr("id") == "dst-port-selection-content"){
        $("#dst-port-index").val(element.index());
    }
    else if(element.parent().attr("id") == "size-selection-content"){
        $("#size-index").val(element.index());
    }
    //size-unit-selection-button
    else{
        $("#size-unit-index").val(element.text());
    }

    if ($("#src-ip-index").val() != '' && $("#dst-ip-index").val() != '' && $("#src-port-index").val() != '' && $("#dst-port-index").val() != '' && $("#size-index").val() != '' && $("#size-unit-index").val() != ''){
        $("#column-mapping-interface").slideUp();
        $("#analytics-interface").slideDown();
        $("#filtered-events-interface").slideDown();

	    $(document).ready(function() {
	            populateAnalyticsInterface();
	            populateFilteredEventsInterface();

        });
	    addSizeUnit();
    }
}

function populateAnalyticsInterface(){
    $.get("cgi-bin/top_talkers.py?csvname=" + $("#file-to-analyze-title").text() + "&srcipcoli=" + $("#src-ip-index").val() + "&dstipcoli=" + $("#dst-ip-index").val() + "&sizecoli=" + $("#size-index").val() + "&type=source", function(response){
        var tableBody = ''
        var response = JSON.parse(response);
        if(response["error"] == undefined){
            var data = response["success"];
            for(var i=0; i < data.length; i++){
                tableBody += '<tr><td>' + data[i]["ip"] + "</td>" + "<td>" + data[i]["total_bytes_sent"] + "</td>" + "<td>" + data[i]["occurrences"] + "</td></tr>";
            }
            $("#top-source-talkers-content").html(tableBody);
            //Convert to datatable
            $(document).ready(function() {
               $("#unique-source-ip-table").DataTable(
               {
                    dom: 'Blfrtip',
                    buttons: [
                        'copy', 'csv', 'print'
                    ]
                }
               );
            });
        }
        else{
            alert(response["error"]);
        }
    });
    $.get("cgi-bin/top_talkers.py?csvname=" + $("#file-to-analyze-title").text() + "&srcipcoli=" + $("#src-ip-index").val() + "&dstipcoli=" + $("#dst-ip-index").val() + "&sizecoli=" + $("#size-index").val() + "&type=dest", function(response){
        var tableBody = ''
        var response = JSON.parse(response);
        if(response["error"] == undefined){
            var data = response["success"];
            for(var i=0; i < data.length; i++){
                tableBody += '<tr><td>' + data[i]["ip"] + "</td>" + "<td>" + data[i]["total_bytes_sent"] + "</td>" + "<td>" + data[i]["occurrences"] + "</td></tr>";
            }
            $("#top-dest-talkers-content").html(tableBody);
            $(document).ready(function() {
               $("#unique-dest-ip-table").DataTable(
                {
                    dom: 'Blfrtip',
                    buttons: [
                        'copy', 'csv', 'print'
                    ]
                });
            });

        }
        else{
            alert(response["error"]);
        }
    });
    $.get("cgi-bin/top_talkers.py?csvname=" + $("#file-to-analyze-title").text() + "&srcipcoli=" + $("#src-ip-index").val() + "&dstipcoli=" + $("#dst-ip-index").val() + "&sizecoli=" + $("#size-index").val() + "&type=all", function(response){
        var tableBody = ''
        var response = JSON.parse(response);
        if(response["error"] == undefined){
            var data = response["success"];
            for(var i=0; i < data.length; i++){
                tableBody += '<tr><td>' + data[i]["ip"] + "</td>" + "<td>" + data[i]["total_bytes_sent"] + "</td>" + "<td>" + data[i]["occurrences"] + "</td></tr>";
            }
            $("#top-talkers-content").html(tableBody);
            $(document).ready(function() {
               $("#unique-all-ip-table").DataTable(
               {
                    dom: 'Blfrtip',
                    buttons: [
                        'copy', 'csv', 'print'
                    ]
                }
               );
            });

        }
        else{
            alert(response["error"]);
        }
    });
}

function populateFilteredEventsInterface(){
    $.get('cgi-bin/list_column_headings.py?csvname=' + $("#file-to-analyze-title").text(), function(headings){
            var headingsHTML = "";
            var headings = JSON.parse(headings);
            if(headings["error"] == undefined){
                var headings = headings["success"];
                    for(var i=0; i < headings.length; i++){
                        headingsHTML += "<th>" + headings[i] + "</th>"
                    }
            }

             $.get("cgi-bin/list_connections_on_port.py?csvname=" + $("#file-to-analyze-title").text() + "&srcportcoli=" + $("#src-port-index").val() + "&dstportcoli=" + $("#dst-port-index").val() + "&port=22&label=ssh", function(rows){
                var rowsHTML = "";
                var rows = JSON.parse(rows);
                if(rows["error"] == undefined){
                        var rows = rows["success"][1]
                        for(var j=0; j < rows.length; j++){
                            rowsHTML += "<tr>";
                            for(var jj=0; jj < rows[j].length; jj++){
                                rowsHTML += "<td>" + rows[j][jj] + "</td>"
                            }
                            rowsHTML += "</tr>";
                        }
                        $("#ssh-connections-content").html(rowsHTML);
                        $("#ssh-connections-headings").html(headingsHTML);
                        $("#ssh-connections-title").fadeIn();
                        $(document).ready(function() {
                            $("#ssh-connections-table").DataTable(
                                {
                                    dom: 'Blfrtip',
                                    buttons: [
                                    'copy', 'csv', 'print'
                                    ]
                                }
                            );
                        });
                    }
             });



             $.get("cgi-bin/list_lateral_movement_connections.py?csvname=" + $("#file-to-analyze-title").text() + "&srcportcoli=" + $("#src-port-index").val() + "&dstportcoli=" + $("#dst-port-index").val(), function(rows){
                    var rowsHTML = "";
                    var rows = JSON.parse(rows);
                    if(rows["error"] == undefined){
                        var rows = rows["success"]
                        for(var j=0; j < rows.length; j++){
                            rowsHTML += "<tr>";
                            for(var jj=0; jj < rows[j].length; jj++){
                                rowsHTML += "<td>" + rows[j][jj] + "</td>"
                            }
                            rowsHTML += "</tr>";
                        }
                        $("#lateral-movement-content").html(rowsHTML);
                        $("#lateral-movement-headings").html(headingsHTML);
                        $("#lateral-movement-title").fadeIn();
                        $(document).ready(function() {
                            $("#potential-lateral-movement-table").DataTable(
                                {
                                    dom: 'Blfrtip',
                                    buttons: [
                                    'copy', 'csv', 'print'
                                    ]
                                }
                            );
                        });

                    }
                });
    });
}

function toggleHighchart(element, tableElementId){
	var tabClass = $(element).parent();
	if (tabClass.text() == "Chart"){
		if(tabClass.attr('class') != "active"){
		    $('#' + tableElementId).highchartTable();
		    $('#' + tableElementId).fadeOut();
	    	    tabClass.parent().children().removeClass('active');
		    tabClass.addClass("active");
		}
	}
	else{
	    if(tabClass.attr('class') != "active"){
		    tabClass.parent().children().removeClass('active');
		    tabClass.addClass("active");
		    $('#' + tableElementId).fadeIn();
            tabClass.parent().parent().find('.highcharts-container')[0].remove();
		    //$('#highcharts-' + renderedChartId).parent().remove();	
		    //renderedChartId+=4;
	    }
	}
}

function addSizeUnit(){
    $('.unit').each(function(){
        $(this).html(
            $(this).html()
                .replace('%unit%', $('#size-unit-index').val())
                .replace('Bytes', $('#size-unit-index').val())
                .replace('Kilobytes', $('#size-unit-index').val())
                .replace('Megabytes', $('#size-unit-index').val())
                .replace('Gigabytes', $('#size-unit-index').val())
                .replace('Packets', $('#size-unit-index').val())
        );
    });
}
