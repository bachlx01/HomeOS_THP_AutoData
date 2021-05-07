var linkNewWO = "https://erp.homeos.vn/service/service.svc/ApiServicePublic/New_WorkOrder/GOODS=";
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

$(function () { //document.ready

    //Create table from list API
    writeRow();

    //Add new Work Order
    $("#newWO").click(function () {
        var orderID = $("#orderID").val();
        $.ajax({
            url: linkNewWO + orderID,
            success: function () {
                alert("Done!");
            },
            error: function () {
                alert("Fail!");
            }
        })
    })

    // Add new API
    var addAPI = $("#addAPI");
    addAPI.click(function () {

        var apiName = $("#apiName").val();
        var apiLink = $("#apiLink").val();
        if (apiLink == "") {
            alert("Chưa nhập API");
            return;
        }
        var interval = $("#interval").val();
        if (interval <= 0) {
            alert("Nhập interval lớn hơn 0");
            return;
        }

        var html = createHtml(apiName, apiLink, interval);

        $("#table-content").append(html);

        // Reset input forms
        $("#apiName").val("");
        $("#apiLink").val("");
        $("#interval").val("");

    })

})

// Delete row
function deleteRow(element) {
    $(element).parent().parent().remove();
}

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
                alert("Địa chỉ API sai!");
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

function writeRow() {
    var html = "";
    for (var i = 0; i < apiList.length; i++) {
        html += createHtml(apiList[i].name, apiList[i].link, apiList[i].interval)
    }
    $("#table-content").append(html);
}

function createHtml(name, link, interval) {
    return "<tr>"
        + "<td class='td--name'>" + name + " </td>"
        + "<td class='td--link'>" + link + " </td>"
        + "<td class='td--interval'><input type='text' class='form-control' value='" + interval + "'></td>"
        + "<td><button style='width:100px;' class='btn-stream btn btn-primary' onclick='stream(this)'>Start</button></td>"
        + "<td class='td--timer'></td>"
        + "<td class='td--start-time'>-- : -- : --</td>"
        + "<td class='td--end-time'>-- : -- : --</td>"
        + "<td><button style='width:100px;' class='btn btn-delete btn-danger' onclick='deleteRow(this)'>Delete</button></td>"
        + "</tr>";
}

function getCurrentTime(date) {
    return date.getHours().toString() + " : " + date.getMinutes().toString() + " : " + date.getSeconds().toString();
}
