var linkNewWO = "https://erp.homeos.vn/service/service.svc/ApiServicePublic/New_WorkOrder/GOODS=";
var linkStartWO = "https://erp.homeos.vn/service/service.svc/ApiServicePublic/Execute_WorkOrder/QUANTITY=";
var apiList = [
    {
        "name": "Generate30SWT",
        "link": "https://erp.homeos.vn/service/service.svc/ApiServicePublic/Generate30SWT/a=0",
        "interval": 1
    },
    {
        "name": "Generate20BT",
        "link": "https://erp.homeos.vn/service/service.svc/ApiServicePublic/Generate20BT/a=0",
        "interval": 60
    },
    {
        "name": "Generate40MT",
        "link": "https://erp.homeos.vn/service/service.svc/ApiServicePublic/Generate40MT/a=0",
        "interval": 60
    },
    {
        "name": "Generate43UHT",
        "link": "https://erp.homeos.vn/service/service.svc/ApiServicePublic/Generate43UHT/a=0",
        "interval": 60
    },
    {
        "name": "Generate90PAA",
        "link": "https://erp.homeos.vn/service/service.svc/ApiServicePublic/Generate90PAA/a=0",
        "interval": 60
    },
    {
        "name": "Generate50CIP",
        "link": "https://erp.homeos.vn/service/service.svc/ApiServicePublic/Generate50CIP/a=0",
        "interval": 60
    },
    {
        "name": "Generate00PFC",
        "link": "https://erp.homeos.vn/service/service.svc/ApiServicePublic/Generate00PFC/a=0",
        "interval": 60
    },
    {
        "name": "Generate10DW",
        "link": "https://erp.homeos.vn/service/service.svc/ApiServicePublic/Generate10DW/a=0",
        "interval": 60
    },
    {
        "name": "Generate30SWT",
        "link": "https://erp.homeos.vn/service/service.svc/ApiServicePublic/Generate30SWT/a=0",
        "interval": 60
    }
];

//document.ready
$(function () {

    //Create table from list API
    writeRow();

    //Add new Work Order
    $("#startWO").click(function () {

        var orderID = $("#orderID").val();
        var orderQuantity = $("#orderQuantity").val();
        if (orderQuantity == "") {
            showPopUp("Nhập số lượng sản xuất!");
            return;
        }
        $.ajax({
            // call API create Work Order; API: New_WorkOrder
            url: linkNewWO + orderID + ",QUANTITY=" + orderQuantity,
            success: function (d) {
                var data = JSON.parse(d);
                var message = data[0].MESSAGE;
                var state = data[0].STATE_ID;

                if (state == 1) {
                    showPopUp( "Đang tiến hành Work Order: " + message);
                } else {
                    //Call API change state to START; API: Execute_API/API_NAME=New_WorkOrder,STATE=1
                    $.ajax({
                        url: "https://erp.homeos.vn/service/service.svc/ApiServicePublic/Execute_API/API_NAME=New_WorkOrder,STATE=1",
                        error: function () {
                            showPopUp("Fail to change state API 'Execute_WorkOrder'");
                        }
                    })

                    // Show loading near button Creat
                    $("#workOrderRun")
                    .addClass("text-warning")
                    .html(message + " is running!");
                    $("#spinner").addClass("spinner-border text-warning");

                    // call API start Work Order
                    $.ajax({
                        url: linkStartWO + orderQuantity,
                        success: function (d) {
                            var data = JSON.parse(d);
                            var workOrder = data[0].Column1;
                            $("#spinner").removeClass("spinner-border text-warning");
                            $("#workOrderRun")
                            .removeClass("text-warning")
                            .addClass("text-success")
                            .html(workOrder + " is done!");
                            $("#orderQuantity").val("");

                            // call API change state to STOP; API: Execute_API/API_NAME=New_WorkOrder,STATE=0"
                            $.ajax({
                                url: "https://erp.homeos.vn/service/service.svc/ApiServicePublic/Execute_API/API_NAME=New_WorkOrder,STATE=0",
                                error: function(){
                                    showPopUp("Fail to change state API 'New_WorkOrder'");
                                }
                            })
                        },
                        error: function () {
                            showPopUp("Start WO Fail!");
                        }
                    })

                }


            },
            error: function () {
                showPopUp("Create WO Fail!");
            }
        })

    })

    // Add new API
    var addAPI = $("#addAPI");
    addAPI.click(function () {

        var apiName = $("#apiName").val();
        var apiLink = $("#apiLink").val();
        if (apiLink == "") {
            showPopUp("Chưa nhập API");
            return;
        }
        var interval = $("#interval").val();
        if (interval <= 0) {
            showPopUp("Nhập interval lớn hơn 0");
            return;
        }

        var html = createHtml(apiName, apiLink, interval);

        $("#table-content").append(html);

        // Reset input forms
        $("#apiName").val("");
        $("#apiLink").val("");
        $("#interval").val("");

    })

    // Start All
    $("#btn--startAll").click(function () {

        $(".btn-stream").each(function () {

            if ($(this).html() == "Start") {

                stream(this);
            }
        })
    })

    // Stop All
    $("#btn--stopAll").click(function () {
        $(".btn-stream").each(function () {

            if ($(this).html() == "Stop") {

                stream(this);
            }
        })
    })
})
// End document.ready

// Delete row
function deleteRow(element) {
    $(element).parent().parent().remove();
}

// Start and stop API
function stream(e) {

    var element = $(e);

    var timer = 1;

    var rowElement = element.parent().parent();

    var btnText = element.html();

    var urlAPI = rowElement.children(".td--link").text();

    var intervalTime = rowElement.children(".td--interval").children("input").val();

    if (btnText == "Start") {
        $.ajax({ // Check valid urlAPI, if success run loop.
            url: urlAPI,
            method: "GET",
            success: function () {
                rowElement.children(".td--timer").html("(" + timer++ + ")");
                rowElement.children(".td--start-time").html(getCurrentTime(new Date()));
                rowElement.children(".td--end-time").html("-- : -- : --");
                element // Switch button text to Stop
                    .html("Stop")
                    .removeClass("btn-primary")
                    .addClass("btn-success");

                timeOut();
            },
            error: function () {
                showPopUp("Địa chỉ API sai!");
            }
        })

    } else {
        rowElement.children(".td--end-time").html(getCurrentTime(new Date()));
        element // Switch button text to Stop
            .html("Start")
            .removeClass("btn-success")
            .addClass("btn-primary");
        timer = 1;
    }

    // Loop with setTimeout
    function timeOut() {
        setTimeout(function () {
            btnText = element.text();
            if (btnText == "Start") {
                clearTimeout(timeOut);
                return;
            } else {
                ajaxCall();
                timeOut();
            }
        }, intervalTime * 1000)
    }

    function ajaxCall() {
        $.ajax({
            url: urlAPI,
            success: function () {
                rowElement.children(".td--timer").html(" (" + timer++ + ")");
            }
        })
    }
}

// Write table
function writeRow() {
    var html = "";
    for (var i = 0; i < apiList.length; i++) {
        html += createHtml(apiList[i].name, apiList[i].link, apiList[i].interval)
    }
    $("#table-content").append(html);
}

// Create a row
function createHtml(name, link, interval) {
    return "<tr>"
        + "<td class='td--name'>" + name + " </td>"
        + "<td class='td--link'>" + link + " </td>"
        + "<td class='td--param'><input type='text' class='form-control'></td>"
        + "<td class='td--interval'><input type='text' class='form-control' value='" + interval + "'></td>"
        + "<td class='td--timer'></td>"
        + "<td class='td--start-time'>-- : -- : --</td>"
        + "<td class='td--end-time'>-- : -- : --</td>"
        + "<td><button style='width:80px;' class='btn-stream btn btn-primary' onclick='stream(this)'>Start</button></td>"
        + "<td><button style='width:80px;' class='btn btn-delete btn-danger' onclick='deleteRow(this)'>Delete</button></td>"
        + "</tr>";
}

function getCurrentTime(date) {
    return date.getHours().toString() + " : " + date.getMinutes().toString() + " : " + date.getSeconds().toString();
}

function showPopUp(content, timeOut = 2) {
    $(".modal-body").html(content);
    $(".modal").modal("show");
    setTimeout(function () {
        $(".modal").modal("hide");
    }, timeOut * 1000)
}
