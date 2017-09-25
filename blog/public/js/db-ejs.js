            $(document).ready(function () {
                Dropzone.options.myAwesomeDropzone = {
                    autoProcessQueue: false, uploadMultiple: true, parallelUploads: 100, maxFiles: 100,
                    init: function () {
                        var myDropzone = this;
                        this.element.querySelector("button[type=submit]").addEventListener("click", function (e) {
                            console.log("element----------------------");
                            e.preventDefault();
                            e.stopPropagation();
                            myDropzone.processQueue()
                        });
                        this.on("sendingmultiple", function () {
                            console.log("sending----------------------");
                            console.log((myDropzone));
                        });
                        this.on("successmultiple", function (files, response) {
                            console.log("successmultiple----------------------");
                            console.log(JSON.stringify(files[0].name) + "----------------------" + JSON.stringify(response));
                            var aa = JSON.parse(response).data.url;
                            console.log(aa);
                            for (var i in aa) {
                                addRow($('#record'), aa[i]);
                            }
                        });
                        this.on("errormultiple", function (files, response) {
                            console.log("errormultiple----------------------");
                        })
                    }}

            });
            (function () {
                $('button[name=dd]').on('click', function () {
                    var file = $(this).parent().parent().children()[1].innerHTML;

                    appendColumn($(this).parent().parent(), 'nopass');
//                    alert(file);
//                    inputXlsx([file]);
                });
            })();

            function appendColumn(a, type, recordC, reason) {
                if (type == 'ok') {
                    a.append('<td><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></td>');
                    a.children()[5].remove();
                } else if (type == 'over') {
                    a.append('<td><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td>');
                } else if (type == 'pass') {
                    a.append('<td><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></td>');
                    a.append('<td class="footable-visible footable-last-column"><a href="#"><i class="fa fa-check text-navy"></i> 通过</a></td>');
                    a.children()[4].remove();
                    a.children()[4].remove();
                    a.children()[2].innerHTML = (recordC);
                    a.children()[3].innerHTML = (reason);
                } else if (type == 'nopass') {
                    a.append('<td><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td>');
                    a.children()[4].remove();
                    a.children()[3].after(a.children()[5]);
                    a.children()[2].innerHTML = (recordC);
                    a.children()[3].innerHTML = (reason);
                } else if (type == 'go') {
                    a.append(
                            '         <td>                                                                         '
                            + '             <div class="ibox-content">                                               '
                            + '                 <div class="sk-spinner sk-spinner-wave">                             '
                            + '                     <div class="sk-rect1"></div>                                     '
                            + '                     <div class="sk-rect2"></div>                                     '
                            + '                     <div class="sk-rect3"></div>                                     '
                            + '                     <div class="sk-rect4"></div>                                     '
                            + '                 </div>                                                               '
                            + '             </div>                                                                   '
                            + '         </td>                                                                        ');

                    a.children()[3].after(a.children()[6]);
                    a.children()[5].remove();
                }

            }
            function appendOutColumn(a, type,  reason) {
                 if (type == 'pass') {
                    a.append('<td class="footable-visible footable-last-column"><a href="#"><i class="fa fa-check text-navy"></i> 通过</a></td>');
                    a.children()[5].remove();
                    a.children()[4].innerHTML = (reason);
                } else if (type == 'nopass') {
                    a.append('<td><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></td>');
                    a.children()[5].remove();
                    a.children()[4].innerHTML = (reason);
                } 

            }
            function addRow(a, info) {
//                a.append('<tr><td>....xxx</td></td>');
                a.append(oneRow(info));
                $('button[name=dd]').on('click', function () {
                    var a = $(this).parent().parent();
                    appendColumn(a, "go");
                    var file = a.children()[1].innerHTML;
//                    alert(file);
                    inputXlsx(a, [file]);
                });
            }
            ;
            function inputXlsx(a, files) {
                console.log(JSON.stringify(files));
                $.ajax({
                    url: "/login/inputxlsx",
                    data: {files: JSON.stringify(files), user: $("#username").val(), pwd: $("#passwd").val(), ip: $("#ip").val(), port: $("#port").val(),
                        db: $("input[name='optionsRadios0']:checked").val(), tb: $("input[name='optionsRadios']:checked").val(),
                        co: $("input[name='optionsRadios2']:checked").val()},
                    dataType: "text",
                    type: "post",
                    success: function (result) {
                        console.log(result + '--------------');
                        var r = JSON.parse(result);
                        if (r.info == 0) {
                            appendColumn(a, "pass", r.reason, "--");
//                            alert("ok");
                        } else if (r.info == 500) {
                            appendColumn(a, "nopass", "--", r.reason);
//                            alert("nopass");
                        }
                    }
                });
            }
            ;
            function oneRow(info) {


                return         ('      <tr>                                                                            '
                        + '         <td>                                                                         '
                        + '             <input type="checkbox" class="i-checks" name="input[]">                  '
                        + '         </td>                                                                        '
                        + '         <td>' + info + '</td>                                  '
                        + '         <td><span class="pie">4,9</span>                                             '
                        + '         </td>                                                                        '
                        + '         <td>18%</td>                                                                 '
                        + '         <td>                                                                         '
                        + '----'
                        + '         </td>                                                                        '
                        + '         <td><button name="dd"><i class="fa fa-check text-navy"></i>导入</button>     '
                        + '         </td>                                                                        '
                        + '     </tr>                                                                            ');
            }
            function oneOutRow(info) {
                return                     (' <tr>                                                                                 '
                        + '      <td>                                                                            '
                        + '          <input type="checkbox" checked class="i-checks" name="input[]">             '
                        + '      </td>                                                                           '
                        + '      <td>' + info.db + '-' + info.tb + '-' + info.co + '</td>                                                      '
                        + '      <td>' + info.starttime + '                                         '
                        + '      </td>                                                                           '
                        + '      <td>' + info.endtime + '  </td>                                                                    '
                        + '      <td>---</td>                                                             '
                        + '         <td>                                                                         '
                        + '             <div class="ibox-content">                                               '
                        + '                 <div class="sk-spinner sk-spinner-wave">                             '
                        + '                     <div class="sk-rect1"></div>                                     '
                        + '                     <div class="sk-rect2"></div>                                     '
                        + '                     <div class="sk-rect3"></div>                                     '
                        + '                     <div class="sk-rect4"></div>                                     '
                        + '                 </div>                                                               '
                        + '             </div>                                                                   '
                        + '         </td>                                                                        '
                        + '  </tr>                                                                               ');
            }
            function addOutRow(a, info) {
                a.append(oneOutRow(info));
//                $('button[name=dd]').on('click', function () {
//                    var a = $(this).parent().parent();
//                    appendColumn(a, "go");
//                    var file = a.children()[1].innerHTML;
//                    alert(file);
//                    inputXlsx(a, [file]);
//                });
            }
            var start = {elem: "#start", format: "YYYY/MM/DD hh:mm:ss", min: "2015-6-7 0:0:0", max: laydate.now(), istime: true, istoday: false, choose: function (datas) {
                    end.min = datas;
                    end.start = datas
                }};
            var end = {elem: "#end", format: "YYYY/MM/DD hh:mm:ss", min: "2015-6-7 0:0:0", max: laydate.now(), istime: true, istoday: false, choose: function (datas) {
                    start.max = datas
                }};
            laydate(start);
            laydate(end);
            $(document).ready(function () {
                $(".i-checks").iCheck({checkboxClass: "icheckbox_square-green", radioClass: "iradio_square-green", })
            });

            $(function () {
                var btn = $("#savedb");
                btn.on(
                        "click", function () {
                            $.ajax({
                                url: "/login/dbinfo",
                                data: {user: $("#username").val(), pwd: $("#passwd").val(), ip: $("#ip").val(), port: $("#port").val()},
                                dataType: "text",
                                type: "post",
                                success: function (result) {
                                    console.log(result + '--------------');
                                    var r = JSON.parse(result);
                                    if (result == "") {
                                        alert("登陆失败！请重新输入")
                                    } else {
                                        var info = r[0]['info'];
                                        if (info == 2) {
                                            alert("查询成功但有相同记录！所以不更新view");
                                        } else if (info == 3) {
                                            alert("更新数据库成功！refresh view");
                                            $('#ip').val(r[0]['db-ip']);
                                            $('#port').val(r[0]['db-port']);
                                            $('#username').val(r[0]['db-username']);
                                            $('#passwd').val(r[0]['db-password']);
                                        } else if (info == 0) {
                                            alert("所给出的信息无法连接数据库！");
                                        }
                                    }
                                }
                            });
                        });
                var btn2 = $("#getdb");
                btn2.on(
                        "click", function () {
                            $.ajax({
                                url: "/login/getdbs",
                                data: {user: $("#username").val(), pwd: $("#passwd").val(), ip: $("#ip").val(), port: $("#port").val(), db: 'mysql'},
                                dataType: "text",
                                type: "post",
                                success: function (result) {
//                                    console.log(result + '--------------');
                                    var r = JSON.parse(result);
                                    addDbs(r);
                                }
                            })
                        });
                var btn3 = $("#output");
                btn3.on(
                        "click", function () {
                            addOutRow($("#outputrecord"), {db: $("input[name='optionsRadios0']:checked").val(), tb: $("input[name='optionsRadios']:checked").val(),
                                co: $("input[name='optionsRadios2']:checked").val(), starttime: $("#start").val(), endtime: $("#end").val()});
                            $.ajax({
                                url: "/login/output",
                                data: {user: $("#username").val(), pwd: $("#passwd").val(), ip: $("#ip").val(), port: $("#port").val(),
                                    db: $("input[name='optionsRadios0']:checked").val(), tb: $("input[name='optionsRadios']:checked").val(),
                                    co: $("input[name='optionsRadios2']:checked").val(),
                                    start: $("#start").val(), end: $("#end").val()},
                                dataType: "text",
                                type: "post",
                                success: function (result) {
                                    var r = JSON.parse(result);
                                    if(r.info== 0){
                                        appendOutColumn($("#outputrecord").children().last(),"pass",r.reason);
                                    }else if(r.info == 500){
                                        appendOutColumn($("#outputrecord").children().last(), "nopass", JSON.stringify(r.reason));
                                    }
                                    console.log('------output success--------' + result);
                                }
                            })
                        });
            })

            $(document).ready(function () {

                $("[name=optionsRadios]").click(function () {
                    alert("您是..." + $(this).val());
                    var a = $("input:radio[name=optionsRadios2]:eq(0)");
                    a.click();
                });
            });
            function addTables(tables) {
                var b = $("#table");
                $("#table label ").remove();
                for (var i = 0; i < tables.length; i++) {
                    b.append('<label><input type="radio" checked="false" value="' + tables[i] + '" name="optionsRadios">' + tables[i] + '</label>');
                }
                $("[name=optionsRadios]").click(function () {
                    //                    alert("您是..." + $(this).val());
                    var table = $(this).val();
                    var db = $("input[name='optionsRadios0']:checked").val();
                    $.ajax({
                        url: "/login/getcolumns",
                        data: {user: $("#username").val(), pwd: $("#passwd").val(), ip: $("#ip").val(), port: $("#port").val(), db: db, tb: table, co: 'id'},
                        dataType: "text",
                        type: "post",
                        success: function (result) {
                            //                                    console.log(result + '--------------');
                            var r = JSON.parse(result);
                            addColumns(r);
                        }
                    });
                });
                var a = $("input:radio[name=optionsRadios][value=think_history_access]");
                a.click();
            }
            function addColumns(columns) {
                var b = $("#column");
                $("#column label ").remove();
                for (var i = 0; i < columns.length; i++) {
                    b.append('<label><input type="radio" checked="false" value="' + columns[i] + '" name="optionsRadios2">' + columns[i] + '</label>');
                }
                var a = $("input:radio[name=optionsRadios2][value=login_time]");
                a.click();

            }
            function addDbs(dbs) {
                var b = $("#db");
                $("#db label ").remove();
                for (var i = 0; i < dbs.length; i++) {
                    b.append('<label><input type="radio" checked="false" value="' + dbs[i] + '" name="optionsRadios0">' + dbs[i] + '</label>');
                }
                $("[name=optionsRadios0]").click(function () {
                    //                    alert("您是..." + $(this).val());
                    var db = $(this).val();
                    $.ajax({
                        url: "/login/gettables",
                        data: {user: $("#username").val(), pwd: $("#passwd").val(), ip: $("#ip").val(), port: $("#port").val(), db: db},
                        dataType: "text",
                        type: "post",
                        success: function (result) {
                            //                                    console.log(result + '--------------');
                            var r = JSON.parse(result);
                            addTables(r);
                        }
                    });
                });
//                var a = $("input:radio[name=optionsRadios0]:eq(3)");
                var a = $("input:radio[name=optionsRadios0][value=gwifi]");
                a.click();

            }