var active_element = null;
var sidebar_scroll_pos = null;

function isScrolledIntoView(c) {
    var e = $(window).scrollTop();
    var d = e + $(window).height();
    var a = $(c).offset().top;
    var b = a + $(c).height();
    return ((b >= e) && (a <= d))
}

function save_form() {
    $("#bottom_bar_msg").text("Please wait... Saving...");
    var b = $("#form_header").data("form_properties").id;
    var f = $("#form_header").data("form_properties");
    f.frame_height = $("#form_container").outerHeight();
    var c = $("#li_lastpage").data("field_properties");
    var e = $("#form_builder_sortable > li.dblive").not(".synched").not(".li_pagination");
    if (e.length >= 1) {
        var d = new Array();
        e.each(function(g) {
            d[g] = $(this).data("field_properties")
        })
    }
    var a = $("#form_builder_sortable").sortable("serialize", {
        key: "el_pos[]"
    });
    $.ajax({
        type: "POST",
        async: true,
        url: "save_form.php",
        data: {
            form_id: b,
            fp: f,
            ep: d,
            el_pos: a,
            lp: c
        },
        cache: false,
        global: false,
        dataType: "json",
        error: function(i, g, h) {
            alert("Error while saving. Error Message:\n" + i.responseText)
        },
        success: function(g) {
            if (g.status == "ok") {
                $("#bottom_bar_loader").remove();
                $("#bottom_bar_msg").hide();
                $(".form_editor").data("form_saved", true);
                $("#dialog-form-saved").dialog("open")
            } else {
                alert("Error while saving. Error Message:\n" + g)
            }
        }
    })
}

function select_form_header(b) {
    var d = $("#form_header").data("form_properties");
    $("#" + active_element).removeClass("highlighted");
    active_element = null;
    $("#form_header .highlighted").removeClass("highlighted");
    $("#pagination_header").removeClass("highlighted");
    $("#" + b).addClass("highlighted");
    $("#selected_field_image").css("visibility", "hidden");
    $("#bottom_bar_field_action").fadeOut("fast",    function() {
        $("#bottom_bar_content").animate({
            "margin-left": "160px"
        },
        {
            duration: 200,
            queue: false
        })
    });
    if ($("#builder_tabs").tabs("option", "selected") != 2) {
        $("#builder_tabs").tabs("select", 2)
    }
    if ($("#form_header").data("coming_from_click") == 1) {
        var f = $("#content").position().top - 2;
        if ($("#sidebar").position().top > f) {
            $("#sidebar").css("top", f)
        }
    }
    $("#form_header").data("coming_from_click", 0);
    $("#all_form_properties > li").hide();
    if (b == "pagination_header") {
        if (d.pagination_type == "steps") {
            $("#pagination_style_steps").prop("checked", true)
        } else {
            if (d.pagination_type == "percentage") {
                $("#pagination_style_percentage").prop("checked", true)
            } else {
                $("#pagination_style_disabled").prop("checked", true)
            }
        }
        if (d.pagination_type == "disabled") {
            $("#prop_pagination_style legend").css({
                "background-color": "#DC6666",
                "border-color": "#DC6666"
            });
            $("#prop_pagination_style fieldset").css("border-color", "#DC6666")
        } else {
            $("#prop_pagination_style legend").css({
                "background-color": "#3D6C10",
                "border-color": "#3D6C10"
            });
            $("#prop_pagination_style fieldset").css("border-color", "#3D6C10")
        }
        $("#prop_pagination_style").show();
        $("#pagination_title_list > li").remove();
        var i = $("#form_builder_sortable > li.page_break");
        var g = "";
        var h = 1;
        i.each(function(k) {
            var l = $(this);
            g += '<li><label for="pagetitleinput_' + h + '">' + h + '.</label><input type="text" value="' + l.data("field_properties").page_title + '" autocomplete="off" class="text" id="pagetitleinput_' + h + '" /></li>';
            h++
        });
        $("#pagination_title_list").append(g);
        if (d.pagination_type == "disabled") {
            $("#prop_pagination_titles").hide()
        } else {
            $("#prop_pagination_titles").show()
        }
    } else {
        $("#all_form_properties .form_prop").show();
        if ($("#form_prop_toggle_a").data("expand") == 1) {
            $("#form_prop_toggle_a").text("show less options");
            $("#form_prop_toggle_img").attr("src", "/GIedu/Public/plugins/forms/images/icons/resultset_up.gif");
            $("#all_form_properties .advanced_prop").show()
        } else {
            $("#form_prop_toggle_a").text("show more options");
            $("#form_prop_toggle_img").attr("src", "/GIedu/Public/plugins/forms/images/icons/resultset_next.gif");
            $("#all_form_properties .advanced_prop").hide()
        }
        if ($("#form_review").prop("checked") == true && $("#form_prop_toggle_a").data("expand") == 1) {
            $("#form_prop_review").show()
        } else {
            $("#form_prop_review").hide()
        }
        $("#form_title").val(d.name);
        $("#form_description").val(d.description);
        $("#form_label_alignment").val(d.label_alignment);
        $("#form_language").val(d.language);
        if (b == "form_header_title") {
            $("#form_title").focus().select()
        } else {
            $("#form_description").focus().select()
        }
        $("#form_success_message").val(d.success_message);
        $("#form_redirect_url").val(d.redirect);
        if (d.redirect_enable == 1) {
            $("#form_redirect_option").prop("checked", true);
            $("#form_success_message_option").prop("checked", false);
            $("#form_success_message").hide();
            $("#form_redirect_url").show()
        } else {
            $("#form_redirect_option").prop("checked", false);
            $("#form_success_message_option").prop("checked", true);
            $("#form_success_message").show();
            $("#form_redirect_url").hide()
        }
        if (d.review == 1) {
            $("#form_review").prop("checked", true)
        } else {
            $("#form_review").prop("checked", false)
        }
        if ($("#pagination_header").length > 0) {
            if (d.resume_enable == 1) {
                $("#form_resume").prop("checked", true)
            } else {
                $("#form_resume").prop("checked", false)
            }
        } else {
            d.resume_enable = 0;
            $("#form_resume").prop("checked", false);
            $("#form_resume").prop("disabled", true)
        }
        $("#form_review_title").val(d.review_title);
        $("#form_review_description").val(d.review_description);
        $("#review_primary_text").val(d.review_primary_text);
        $("#review_secondary_text").val(d.review_secondary_text);
        $("#review_primary_img").val(d.review_primary_img);
        $("#review_secondary_img").val(d.review_secondary_img);
        if (d.review_use_image == 1) {
            $("#form_review_use_text").prop("checked", false);
            $("#form_review_use_image").prop("checked", true);
            $("#div_review_use_image").show();
            $("#div_review_use_text").hide()
        } else {
            $("#form_review_use_text").prop("checked", true);
            $("#form_review_use_image").prop("checked", false);
            $("#div_review_use_image").hide();
            $("#div_review_use_text").show()
        }
        if (d.password.length > 0) {
            $("#form_password_option").prop("checked", true);
            $("#form_password").show();
            $("#form_password_data").val(d.password)
        } else {
            $("#form_password_option").prop("checked", false);
            $("#form_password").hide();
            $("#form_password_data").val("")
        }
        $("#form_limit").val(d.limit);
        if (d.limit_enable == 1) {
            $("#form_limit_option").prop("checked", true);
            $("#form_limit_div").show()
        } else {
            $("#form_limit_option").prop("checked", false);
            $("#form_limit_div").hide()
        }
        $("#form_captcha_type").val(d.captcha_type);
        if (d.captcha == 1) {
            $("#form_captcha").prop("checked", true);
            $("#form_captcha_type_option").show()
        } else {
            $("#form_captcha").prop("checked", false);
            $("#form_captcha_type_option").hide()
        }
        if (d.unique_ip == 1) {
            $("#form_unique_ip").prop("checked", true)
        } else {
            $("#form_unique_ip").prop("checked", false)
        }
        if (d.schedule_enable == 1) {
            $("#form_schedule_enable").prop("checked", true);
            $("#form_prop_scheduling_start").show();
            $("#form_prop_scheduling_end").show()
        } else {
            $("#form_schedule_enable").prop("checked", false);
            $("#form_prop_scheduling_start").hide();
            $("#form_prop_scheduling_end").hide()
        }
        if (d.schedule_start_date != null && d.schedule_start_date != "0000-00-00") {
            var j = d.schedule_start_date.split("-");
            $("#scheduling_start_yyyy").val(j[0]);
            $("#scheduling_start_mm").val(parseInt(j[1], 10));
            $("#scheduling_start_dd").val(parseInt(j[2], 10));
            $("#linked_picker_scheduling_start").datepick("setDate", new Date(parseInt(j[0], 10), parseInt(j[1], 10) - 1, parseInt(j[2], 10)))
        } else {
            $("#scheduling_start_yyyy").val("");
            $("#scheduling_start_mm").val("");
            $("#scheduling_start_dd").val("")
        }
        if (d.schedule_start_hour != "" && d.schedule_start_hour != "0000-00-00") {
            var e = d.schedule_start_hour.split(":");
            $("#scheduling_start_hour").val(e[0]);
            $("#scheduling_start_minute").val(e[1]);
            $("#scheduling_start_ampm").val(e[2])
        }
        if (d.schedule_end_date != null && d.schedule_end_date != "0000-00-00") {
            var a = d.schedule_end_date.split("-");
            $("#scheduling_end_yyyy").val(a[0]);
            $("#scheduling_end_mm").val(parseInt(a[1], 10));
            $("#scheduling_end_dd").val(parseInt(a[2], 10));
            $("#linked_picker_scheduling_end").datepick("setDate", new Date(parseInt(a[0], 10), parseInt(a[1], 10) - 1, parseInt(a[2], 10)))
        } else {
            $("#scheduling_end_yyyy").val("");
            $("#scheduling_end_mm").val("");
            $("#scheduling_end_dd").val("")
        }
        if (d.schedule_end_hour != "" && d.schedule_end_hour != "0000-00-00") {
            var c = d.schedule_end_hour.split(":");
            $("#scheduling_end_hour").val(c[0]);
            $("#scheduling_end_minute").val(c[1]);
            $("#scheduling_end_ampm").val(c[2])
        }
        $("#form_custom_script_url").val(d.custom_script_url);
        if (d.custom_script_enable == 1) {
            $("#form_custom_script_enable").prop("checked", true);
            $("#form_custom_script_div").show()
        } else {
            $("#form_custom_script_enable").prop("checked", false);
            $("#form_custom_script_div").hide()
        }
    }
    adjust_main_height();
    check_synch_fields()
}

function check_synch_fields() {
    var a = $("#form_header").data("form_properties").id;
    var d = 10;
    var c = $("#form_builder_sortable > li").not(".dblive").not(".synched").not(".highlighted").not(".li_pagination").not("#li_lastpage");
    if (c.length >= d) {
        var b = new Array();
        c.each(function(e) {
            b[e] = $(this).data("field_properties")
        });
        $.ajax({
            type: "POST",
            async: true,
            url: "synch_fields.php",
            data: {
                form_id: a,
                fp: b
            },
            cache: false,
            global: false,
            dataType: "json",
            error: function(h, f, g) {},
            success: function(e) {
                if (e.status == "ok") {
                    $(e.updated_element_id).addClass("synched")
                }
            }
        })
    }
}

function select_element(c) {
    var g = $(c);
    if ((active_element != null) && (active_element != g.attr("id"))) {
        $("#" + active_element).removeClass("highlighted")
    }
    $("#form_header .highlighted").removeClass("highlighted");
    $("#pagination_header").removeClass("highlighted");
    active_element = g.attr("id");
    g.addClass("highlighted");
    g.removeClass("synched");
    g.data("field_properties").position = g.index();
    check_synch_fields();
    $("#element_inactive_msg").hide();
    $("#element_properties_form").show();
    var f = 40;
    var e = 110;
    var a = 75;
    if ($.browser.msie) {
        f = 80;
        e = 65;
        a = -10
    }
    var b = g.offset().top - f;
    if (Math.abs(b - $("#sidebar").offset().top) < $(window).height()) {
        $("#sidebar").animate({
            top: b
        },
        {
            duration: 200,
            queue: false
        })
    } else {
        $("#sidebar").css("top", b)
    }
    $("#selected_field_image").css("visibility", "visible").animate({
        top: b - e
    },
    {
        duration: 200,
        queue: false
    });
    if (g.data("field_properties").id != "lastpage") {
        $("#bottom_bar_content").animate({
            "margin-left": "20px"
        },
        {
            duration: 200,
            queue: false,
            complete: function() {
                $("#bottom_bar_field_action").fadeIn()
            }
        })
    } else {
        $("#bottom_bar_field_action").fadeOut("fast",
    function() {
            $("#bottom_bar_content").animate({
                "margin-left": "160px"
            },
            {
                duration: 200,
                queue: false
            })
        })
    }
    load_properties("#" + active_element);
    var i = (b + $("#sidebar").outerHeight()) - a;
    var d = $("#header").outerHeight() + $("#navigation").outerHeight() + $("#content").outerHeight();
    if (i > d) {
        var h = (i - d);
        $("#main").animate({
            "padding-bottom": h + "px"
        },
        {
            duration: 200,
            queue: false
        })
    }
}

function load_properties(o) {
    var c = $(o);
    var u = c.data("field_properties");
    $("#all_properties li").hide();
    $("#element_label").val(u.title);
    $("#prop_element_label").show();
    var a = "";
    if (u.type == "matrix") {
        a = {
            matrix: "Matrix Choice"
        }
    } else {
        if (u.type == "radio" || u.type == "checkbox" || u.type == "select") {
            a = {
                radio: "Multiple Choice",
                checkbox: "Checkboxes",
                select: "Drop Down"
            }
        } else {
            a = {
                text: "Single Line Text",
                textarea: "Paragraph Text",
                number: "Number",
                simple_name: "Name",
                date: "Date",
                time: "Time",
                phone: "Phone",
                money: "Price",
                url: "Web Site",
                email: "Email",
                address: "Address",
                file: "File Upload",
                section: "Section Break",
                signature: "Signature"
            }
        }
    }
    $("#element_type > option").remove();
    $.each(a,
    function(w, v) {
        $("#element_type").append($("<option></option>").val(w).html(v))
    });
    if (u.type == "name" || u.type == "simple_name" || u.type == "name_wmiddle" || u.type == "simple_name_wmiddle") {
        $("#element_type").val("simple_name")
    } else {
        if (u.type == "date" || u.type == "europe_date") {
            $("#element_type").val("date")
        } else {
            if (u.type == "phone" || u.type == "simple_phone") {
                $("#element_type").val("phone")
            } else {
                $("#element_type").val(u.type)
            }
        }
    }
    if (u.is_db_live == 1) {
        $("#element_type").prop("disabled", true)
    } else {
        $("#element_type").prop("disabled", false)
    }
    $("#prop_element_type").show();
    if ($("#pagination_header").length > 0) {
        $("#element_position").text(u.position)
    } else {
        $("#element_position").text(u.position + 1)
    }
    if (u.is_required == "1") {
        $("#element_required").prop("checked", true)
    } else {
        $("#element_required").prop("checked", false)
    }
    if (u.is_unique == "1") {
        $("#element_unique").prop("checked", true)
    } else {
        $("#element_unique").prop("checked", false)
    }
    if ((u.is_required == "1") || (u.is_unique == "1")) {
        $("#prop_options legend").css({
            "background-color": "#DC6666",
            "border-color": "#DC6666"
        });
        $("#prop_options fieldset").css("border-color", "#DC6666")
    } else {
        $("#prop_options legend").css({
            "background-color": "#3D6C10",
            "border-color": "#3D6C10"
        });
        $("#prop_options fieldset").css("border-color", "#3D6C10")
    }
    $("#element_unique_span").show();
    $("#prop_options").show();
    $("#prop_breaker").show();
    if (u.is_private == "1") {
        $("#element_private").prop("checked", true);
        $("#element_public").prop("checked", false)
    } else {
        $("#element_private").prop("checked", false);
        $("#element_public").prop("checked", true)
    }
    if (u.is_private == "1") {
        $("#prop_access_control legend").css({
            "background-color": "#DC6666",
            "border-color": "#DC6666"
        });
        $("#prop_access_control fieldset").css("border-color", "#DC6666")
    } else {
        $("#prop_access_control legend").css({
            "background-color": "#3D6C10",
            "border-color": "#3D6C10"
        });
        $("#prop_access_control fieldset").css("border-color", "#3D6C10")
    }
    $("#prop_access_control").show();
    $("#element_instructions").val(u.guidelines);
    $("#prop_instructions").show();
    $("#element_custom_css").val(u.css_class);
    $("#prop_custom_css").show();
    if (u.type == "text") {
        $("#element_size").val(u.size);
        $("#prop_element_size").show();
        $("#element_default_value").val(u.default_value);
        $("#prop_default_value").show();
        $("#element_range_min").val(u.range_min);
        $("#element_range_max").val(u.range_max);
        $("#element_range_limit_by").val(u.range_limit_by);
        if ((parseInt(u.range_min) + parseInt(u.range_max)) >= 1) {
            $("#prop_range legend").css({
                "background-color": "#DC6666",
                "border-color": "#DC6666"
            });
            $("#prop_range fieldset").css("border-color", "#DC6666")
        } else {
            $("#prop_range legend").css({
                "background-color": "#3D6C10",
                "border-color": "#3D6C10"
            });
            $("#prop_range fieldset").css("border-color", "#3D6C10")
        }
        if (u.constraint == "password") {
            $("#prop_text_as_password").prop("checked", true)
        } else {
            $("#prop_text_as_password").prop("checked", false)
        }
        $("#prop_text_options").show();
        $("#element_range_number_limit_by").hide();
        $("#element_range_limit_by").show();
        $("#prop_range").show()
    } else {
        if (u.type == "number") {
            $("#element_size").val(u.size);
            $("#prop_element_size").show();
            $("#element_default_value").val(u.default_value);
            $("#prop_default_value").show();
            $("#element_range_min").val(u.range_min);
            $("#element_range_max").val(u.range_max);
            $("#element_range_number_limit_by").val(u.range_limit_by);
            $("#prop_number_advance_options").show();
            if (u.number_enable_quantity == 1) {
                rebuild_quantity_link_dropdown();
                $("#prop_number_quantity_link").val(u.number_quantity_link);
                $("#prop_number_enable_quantity").prop("checked", true);
                $("#prop_number_quantity_link_div").show()
            } else {
                $("#prop_number_enable_quantity").prop("checked", false);
                $("#prop_number_quantity_link_div").hide()
            }
            if ((parseInt(u.range_min) + parseInt(u.range_max)) >= 1) {
                $("#prop_range legend").css({
                    "background-color": "#DC6666",
                    "border-color": "#DC6666"
                });
                $("#prop_range fieldset").css("border-color", "#DC6666")
            } else {
                $("#prop_range legend").css({
                    "background-color": "#3D6C10",
                    "border-color": "#3D6C10"
                });
                $("#prop_range fieldset").css("border-color", "#3D6C10")
            }
            $("#element_range_limit_by").hide();
            $("#element_range_number_limit_by").show();
            $("#prop_range").show()
        } else {
            if (u.type == "url") {
                $("#element_size").val(u.size);
                $("#prop_element_size").show();
                $("#element_default_value").val(u.default_value);
                $("#prop_default_value").show()
            } else {
                if (u.type == "email") {
                    $("#element_size").val(u.size);
                    $("#prop_element_size").show();
                    $("#element_default_value").val(u.default_value);
                    $("#prop_default_value").show()
                } else {
                    if (u.type == "signature") {
                        $("#element_size").val(u.size);
                        $("#prop_element_size").show();
                        $("#element_unique_span").hide()
                    } else {
                        if (u.type == "file") {
                            $("#prop_file_options").show();
                            $("#prop_file_block_or_allow").val(u.file_block_or_allow);
                            $("#file_type_list").val(u.file_type_list);
                            if (u.file_enable_type_limit == 1) {
                                $("#prop_file_enable_type_limit").prop("checked", true);
                                $("#form_file_limit_type").show()
                            } else {
                                $("#prop_file_enable_type_limit").prop("checked", false);
                                $("#form_file_limit_type").hide()
                            }
                            if (u.file_as_attachment == 1) {
                                $("#prop_file_as_attachment").prop("checked", true)
                            } else {
                                $("#prop_file_as_attachment").prop("checked", false)
                            }
                            if (u.file_auto_upload == 1) {
                                $("#prop_file_auto_upload").prop("checked", true)
                            } else {
                                $("#prop_file_auto_upload").prop("checked", false)
                            }
                            $("#file_max_selection").val(u.file_max_selection);
                            if (u.file_enable_multi_upload == 1) {
                                $("#prop_file_multi_upload").prop("checked", true);
                                $("#form_file_max_selection").show()
                            } else {
                                $("#prop_file_multi_upload").prop("checked", false);
                                $("#form_file_max_selection").hide()
                            }
                            $("#file_size_max").val(u.file_size_max);
                            if (u.file_enable_size_limit == 1) {
                                $("#prop_file_limit_size").prop("checked", true);
                                $("#form_file_limit_size").show()
                            } else {
                                $("#prop_file_limit_size").prop("checked", false);
                                $("#form_file_limit_size").hide()
                            }
                            if (u.file_enable_advance == 1) {
                                $("#prop_file_enable_advance").prop("checked", true);
                                $("#prop_file_advance_options").show()
                            } else {
                                $("#prop_file_enable_advance").prop("checked", false);
                                $("#prop_file_advance_options").hide()
                            }
                            $("#element_unique_span").hide()
                        } else {
                            if (u.type == "textarea") {
                                $("#element_size").val(u.size);
                                $("#prop_element_size").show();
                                $("#element_default_value_textarea").val(u.default_value);
                                $("#prop_default_value_textarea").show();
                                $("#element_range_min").val(u.range_min);
                                $("#element_range_max").val(u.range_max);
                                $("#element_range_limit_by").val(u.range_limit_by);
                                if ((parseInt(u.range_min) + parseInt(u.range_max)) >= 1) {
                                    $("#prop_range legend").css({
                                        "background-color": "#DC6666",
                                        "border-color": "#DC6666"
                                    });
                                    $("#prop_range fieldset").css("border-color", "#DC6666")
                                } else {
                                    $("#prop_range legend").css({
                                        "background-color": "#3D6C10",
                                        "border-color": "#3D6C10"
                                    });
                                    $("#prop_range fieldset").css("border-color", "#3D6C10")
                                }
                                $("#element_range_number_limit_by").hide();
                                $("#element_range_limit_by").show();
                                $("#prop_range").show()
                            } else {
                                if (u.type == "name" || u.type == "simple_name" || u.type == "name_wmiddle" || u.type == "simple_name_wmiddle") {
                                    $("#name_format").val(u.type);
                                    if (u.is_db_live == 1) {
                                        $("#name_format").prop("disabled", true)
                                    } else {
                                        $("#name_format").prop("disabled", false)
                                    }
                                    $("#prop_name_format").show();
                                    $("#element_unique_span").hide()
                                } else {
                                    if (u.type == "time") {
                                        if (u.time_showsecond == 1) {
                                            $("#prop_time_showsecond").prop("checked", true)
                                        } else {
                                            $("#prop_time_showsecond").prop("checked", false)
                                        }
                                        if (u.time_24hour == 1) {
                                            $("#prop_time_24hour").prop("checked", true)
                                        } else {
                                            $("#prop_time_24hour").prop("checked", false)
                                        }
                                        $("#prop_time_options").show()
                                    } else {
                                        if (u.type == "address") {
                                            $("#element_countries").val(u.default_value);
                                            $("#prop_default_country").show();
                                            if (u.address_hideline2 == 1) {
                                                $("#prop_address_hideline2").prop("checked", true)
                                            } else {
                                                $("#prop_address_hideline2").prop("checked", false)
                                            }
                                            if (u.address_us_only == 1) {
                                                $("#prop_address_us_only").prop("checked", true);
                                                $("#element_countries").prop("disabled", true)
                                            } else {
                                                $("#prop_address_us_only").prop("checked", false);
                                                $("#element_countries").prop("disabled", false)
                                            }
                                            $("#prop_address_options").show();
                                            $("#element_unique_span").hide()
                                        } else {
                                            if (u.type == "money") {
                                                if (u.constraint == "" || u.constraint == "dollar") {
                                                    $("#money_format").val("dollar")
                                                } else {
                                                    $("#money_format").val(u.constraint)
                                                }
                                                $("#prop_currency_format").show()
                                            } else {
                                                if (u.type == "phone") {
                                                    $("#element_default_phone1").val(u.default_value.substr(0, 3));
                                                    $("#element_default_phone2").val(u.default_value.substr(3, 3));
                                                    $("#element_default_phone3").val(u.default_value.substr(6, 4));
                                                    $("#prop_default_phone").show();
                                                    $("#phone_format").val(u.type);
                                                    $("#prop_phone_format").show()
                                                } else {
                                                    if (u.type == "simple_phone") {
                                                        $("#element_default_value").val(u.default_value);
                                                        $("#prop_default_value").show();
                                                        $("#phone_format").val(u.type);
                                                        $("#prop_phone_format").show()
                                                    } else {
                                                        if (u.type == "date" || u.type == "europe_date") {
                                                            $("#date_type").val(u.type);
                                                            $("#prop_date_format").show();
                                                            $("#element_default_date").val(u.default_value);
                                                            $("#prop_default_date").show();
                                                            $("#prop_date_options").show();
                                                            if ((u.date_enable_range == 1) || (u.date_enable_selection_limit == 1) || (u.date_disable_past_future == 1) || (u.date_disable_weekend == 1) || (u.date_disable_specific == 1)) {
                                                                $("#prop_date_options legend").css({
                                                                    "background-color": "#DC6666",
                                                                    "border-color": "#DC6666"
                                                                });
                                                                $("#prop_date_options fieldset").css("border-color", "#DC6666")
                                                            } else {
                                                                $("#prop_date_options legend").css({
                                                                    "background-color": "#3D6C10",
                                                                    "border-color": "#3D6C10"
                                                                });
                                                                $("#prop_date_options fieldset").css("border-color", "#3D6C10")
                                                            }
                                                            if (u.date_enable_range == 1) {
                                                                $("#prop_date_range").prop("checked", true);
                                                                $("#prop_date_range_details").show()
                                                            } else {
                                                                $("#prop_date_range").prop("checked", false);
                                                                $("#prop_date_range_details").hide()
                                                            }
                                                            if (u.date_range_min != null && u.date_range_min != "0000-00-00") {
                                                                var m = u.date_range_min.split("-");
                                                                $("#date_range_min_yyyy").val(m[0]);
                                                                $("#date_range_min_mm").val(parseInt(m[1], 10));
                                                                $("#date_range_min_dd").val(parseInt(m[2], 10));
                                                                $("#linked_picker_range_min").datepick("setDate", new Date(parseInt(m[0], 10), parseInt(m[1], 10) - 1, parseInt(m[2], 10)))
                                                            } else {
                                                                $("#date_range_min_yyyy").val("");
                                                                $("#date_range_min_mm").val("");
                                                                $("#date_range_min_dd").val("")
                                                            }
                                                            if (u.date_range_max != null && u.date_range_max != "0000-00-00") {
                                                                var p = u.date_range_max.split("-");
                                                                $("#date_range_max_yyyy").val(p[0]);
                                                                $("#date_range_max_mm").val(parseInt(p[1], 10));
                                                                $("#date_range_max_dd").val(parseInt(p[2], 10));
                                                                $("#linked_picker_range_max").datepick("setDate", new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10)))
                                                            } else {
                                                                $("#date_range_max_yyyy").val("");
                                                                $("#date_range_max_mm").val("");
                                                                $("#date_range_max_dd").val("")
                                                            }
                                                            if (u.date_enable_selection_limit == 1) {
                                                                $("#prop_date_selection_limit").prop("checked", true);
                                                                $("#form_date_selection_limit").show();
                                                                $("#date_selection_max").val(u.date_selection_max)
                                                            } else {
                                                                $("#prop_date_selection_limit").prop("checked", false);
                                                                $("#form_date_selection_limit").hide();
                                                                $("#date_selection_max").val(u.date_selection_max)
                                                            }
                                                            if (u.date_disable_past_future == 1) {
                                                                $("#prop_date_past_future_selection").prop("checked", true);
                                                                $("#prop_date_past_future").val(u.date_past_future).prop("disabled", false)
                                                            } else {
                                                                $("#prop_date_past_future_selection").prop("checked", false);
                                                                $("#prop_date_past_future").val(u.date_past_future).prop("disabled", true)
                                                            }
                                                            if (u.date_disable_weekend == 1) {
                                                                $("#prop_date_disable_weekend").prop("checked", true)
                                                            } else {
                                                                $("#prop_date_disable_weekend").prop("checked", false)
                                                            }
                                                            if (u.date_disable_specific == 1) {
                                                                $("#prop_date_disable_specific").prop("checked", true);
                                                                $("#form_date_disable_specific").show()
                                                            } else {
                                                                $("#prop_date_disable_specific").prop("checked", false);
                                                                $("#form_date_disable_specific").hide()
                                                            }
                                                            if (u.date_disabled_list != null && u.date_disabled_list != "") {
                                                                var s = u.date_disabled_list.split(", ");
                                                                $("#date_disabled_list").datepick("setDate", s)
                                                            }
                                                            $("#date_disabled_list").val(u.date_disabled_list)
                                                        } else {
                                                            if (u.type == "section") {
                                                                $("#prop_options").hide();
                                                                if (u.section_display_in_email == 1) {
                                                                    $("#prop_section_email_display").prop("checked", true)
                                                                } else {
                                                                    $("#prop_section_email_display").prop("checked", false)
                                                                }
                                                                $("#prop_section_size").val(u.size);
                                                                if (u.section_enable_scroll == 1) {
                                                                    $("#prop_section_enable_scroll").prop("checked", true);
                                                                    $("#div_section_size").show()
                                                                } else {
                                                                    $("#prop_section_enable_scroll").prop("checked", false);
                                                                    $("#div_section_size").hide()
                                                                }
                                                                $("#prop_section_options").show()
                                                            } else {
                                                                if (u.type == "radio" || u.type == "checkbox" || u.type == "select") {
                                                                    var g = "";
                                                                    var n = 0;
                                                                    var f = 0;
                                                                    var j = "";
                                                                    var e = "";
                                                                    var t = "";
                                                                    var k = "";
                                                                    var d = u.options;
                                                                    var b = new Array();
                                                                    $.each(d,
                                                                    function(v, w) {
                                                                        b[w.position] = v
                                                                    });
                                                                    if (u.type == "radio" || u.type == "select") {
                                                                        k = "radio"
                                                                    } else {
                                                                        if (u.type == "checkbox") {
                                                                            k = "checkbox"
                                                                        }
                                                                    }
                                                                    if (u.type == "select") {
                                                                        $("#element_size").val(u.size);
                                                                        $("#prop_element_size").show()
                                                                    }
                                                                    $.each(b,
                                                                    function(v, w) {
                                                                        if (v > 0) {
                                                                            f = w;
                                                                            g = u.options[w].option;
                                                                            n = v;
                                                                            if (u.options[w].is_default == "1") {
                                                                                t = ' checked="checked" '
                                                                            } else {
                                                                                t = ""
                                                                            }
                                                                            j = '<li><input type="' + k + '" ' + t + ' title="Select this choice as the default." class="choices_default" name="choices_default" id="choicedef_' + f + '" /><input type="text" value="' + g.replace(/\"/g, "&quot;") + '" autocomplete="off" class="text" id="choice_' + f + '" /> <img class="add_choice" title="Add" alt="Add" src="/GIedu/Public/plugins/forms/images/icons/add.png" style="vertical-align: middle" id="choiceadd_' + f + '"><img class="del_choice" title="Delete" alt="Delete" src="/GIedu/Public/plugins/forms/images/icons/delete.png" style="vertical-align: middle" id="choicedel_' + f + '"></li>';
                                                                            e += j
                                                                        }
                                                                    });
                                                                    $("#element_choices li").remove();
                                                                    $("#element_choices").append(e);
                                                                    $("#prop_choices").show();
                                                                    if (u.type == "radio" || u.type == "checkbox") {
                                                                        $("#element_choice_columns").val(u.choice_columns);
                                                                        $("#prop_choice_columns").show()
                                                                    }
                                                                    if (u.type == "radio" || u.type == "checkbox") {
                                                                        $("#prop_other_choices_label").val(u.choice_other_label);
                                                                        if (u.choice_has_other == 1) {
                                                                            $("#prop_choices_other_checkbox").prop("checked", true);
                                                                            $("#prop_other_choices_label").prop("disabled", false)
                                                                        } else {
                                                                            $("#prop_choices_other_checkbox").prop("checked", false);
                                                                            $("#prop_other_choices_label").prop("disabled", true)
                                                                        }
                                                                        if (u.type == "radio") {
                                                                            if (u.constraint == "random") {
                                                                                $("#prop_choices_randomize").prop("checked", true)
                                                                            } else {
                                                                                $("#prop_choices_randomize").prop("checked", false)
                                                                            }
                                                                            $("#prop_choices_randomize_span").show()
                                                                        } else {
                                                                            $("#prop_choices_randomize_span").hide()
                                                                        }
                                                                        $("#prop_choices_other").show()
                                                                    }
                                                                    $("#element_unique_span").hide()
                                                                } else {
                                                                    if (u.type == "matrix") {
                                                                        var g = "";
                                                                        var n = 0;
                                                                        var f = 0;
                                                                        var j = "";
                                                                        var e = "";
                                                                        var i = u.options;
                                                                        var b = new Array();
                                                                        $.each(i,
                                                                        function(v, w) {
                                                                            b[w.position] = v
                                                                        });
                                                                        var l = "";
                                                                        $.each(b,
                                                                        function(v, w) {
                                                                            if (v > 0) {
                                                                                choice_element_id = w;
                                                                                g = u.options[w].row_title;
                                                                                n = v;
                                                                                if (v > 1) {
                                                                                    l = '<img class="del_choice" title="Delete" alt="Delete" src="/GIedu/Public/plugins/forms/images/icons/delete.png" style="vertical-align: middle" id="matrixrowdel_' + choice_element_id + '">'
                                                                                }
                                                                                j = '<li><input type="text" value="' + g.replace(/\"/g, "&quot;") + '" autocomplete="off" class="text" id="matrixrow_' + choice_element_id + '" /> <img class="add_choice" title="Add" alt="Add" src="/GIedu/Public/plugins/forms/images/icons/add.png" style="vertical-align: middle" id="matrixrowadd_' + choice_element_id + '">' + l + "</li>";
                                                                                e += j
                                                                            }
                                                                        });
                                                                        $("#element_matrix_row li").remove();
                                                                        $("#element_matrix_row").append(e);
                                                                        $("#prop_matrix_row").show();
                                                                        e = "";
                                                                        var r = parseInt($("#" + active_element).data("field_properties").id);
                                                                        var h = u.options[r].column_data;
                                                                        var q = new Array();
                                                                        $.each(h,
                                                                        function(v, w) {
                                                                            q[w.position] = v
                                                                        });
                                                                        $.each(q,
                                                                        function(v, w) {
                                                                            if (v > 0) {
                                                                                f = w;
                                                                                g = h[w].column_title;
                                                                                n = v;
                                                                                j = '<li><input type="text" value="' + g.replace(/\"/g, "&quot;") + '" autocomplete="off" class="text" id="matrixcol_' + f + '" /> <img class="add_choice" title="Add" alt="Add" src="/GIedu/Public/plugins/forms/images/icons/add.png" style="vertical-align: middle" id="matrixcoladd_' + f + '"><img class="del_choice" title="Delete" alt="Delete" src="/GIedu/Public/plugins/forms/images/icons/delete.png" style="vertical-align: middle" id="matrixcoldel_' + f + '"></li>';
                                                                                e += j
                                                                            }
                                                                        });
                                                                        $("#element_matrix_column li").remove();
                                                                        $("#element_matrix_column").append(e);
                                                                        $("#prop_matrix_column").show();
                                                                        if (u.matrix_allow_multiselect == 1) {
                                                                            $("#prop_matrix_allow_multiselect").prop("checked", true)
                                                                        } else {
                                                                            $("#prop_matrix_allow_multiselect").prop("checked", false)
                                                                        }
                                                                        if ($("#" + active_element).hasClass("dblive")) {
                                                                            $("#prop_matrix_allow_multiselect").prop("disabled", true)
                                                                        } else {
                                                                            $("#prop_matrix_allow_multiselect").prop("disabled", false)
                                                                        }
                                                                        $("#prop_matrix_options").show();
                                                                        $("#prop_instructions").hide();
                                                                        $("#element_unique_span").hide();
                                                                        $("#element_label").val(u.guidelines)
                                                                    } else {
                                                                        if (u.type == "page_break") {
                                                                            $("#all_properties li").hide();
                                                                            $("#prop_page_break_button").show();
                                                                            if (u.submit_use_image == 1) {
                                                                                $("#prop_submit_use_image").prop("checked", true);
                                                                                $("#prop_submit_use_text").prop("checked", false);
                                                                                if (u.submit_primary_img == "" || u.submit_primary_img == null) {
                                                                                    $("#submit_primary_img").val("http://")
                                                                                } else {
                                                                                    $("#submit_primary_img").val(u.submit_primary_img)
                                                                                }
                                                                                if (u.submit_secondary_img == "" || u.submit_secondary_img == null) {
                                                                                    $("#submit_secondary_img").val("http://")
                                                                                } else {
                                                                                    $("#submit_secondary_img").val(u.submit_secondary_img)
                                                                                }
                                                                                if ($("#" + active_element).hasClass("firstpage")) {
                                                                                    $("#lbl_submit_secondary_img").hide();
                                                                                    $("#submit_secondary_img").hide()
                                                                                } else {
                                                                                    $("#lbl_submit_secondary_img").show();
                                                                                    $("#submit_secondary_img").show()
                                                                                }
                                                                                $("#div_submit_use_image").show();
                                                                                $("#div_submit_use_text").hide()
                                                                            } else {
                                                                                $("#prop_submit_use_image").prop("checked", false);
                                                                                $("#prop_submit_use_text").prop("checked", true);
                                                                                $("#submit_primary_text").val(u.submit_primary_text);
                                                                                $("#submit_secondary_text").val(u.submit_secondary_text);
                                                                                if ($("#" + active_element).hasClass("firstpage")) {
                                                                                    $("#lbl_submit_secondary_text").hide();
                                                                                    $("#submit_secondary_text").hide()
                                                                                } else {
                                                                                    $("#lbl_submit_secondary_text").show();
                                                                                    $("#submit_secondary_text").show()
                                                                                }
                                                                                $("#div_submit_use_image").hide();
                                                                                $("#div_submit_use_text").show()
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    $("#element_label").focus().select()
}

function set_properties(B, w) {
    var g = $("#" + active_element);
    var y = g.data("field_properties");
    var M = ' <span class="required">*</span>';
    var k = active_element.split("_");
    var u = k[1];
    if (B == "element_label") {
        if (y.type == "section") {
            $("#" + active_element + " > h3").html(w.replace(/\n/g, "<br />"));
            y.title = w
        } else {
            if (y.type == "matrix") {
                if (y.is_required === "0") {
                    M = ""
                }
                $("#" + active_element + " caption").html(w.replace(/\n/g, "<br />") + M);
                y.guidelines = w
            } else {
                if (y.is_required === "0") {
                    M = ""
                }
                $("#" + active_element + " > label").html(w.replace(/\n/g, "<br />") + M);
                y.title = w
            }
        }
    } else {
        if (B == "element_required") {
            if (w == "1") {
                if (y.type == "matrix") {
                    $("#" + active_element + " caption").append(M)
                } else {
                    $("#" + active_element + " > label").append(M)
                }
            } else {
                $("#" + active_element + " span.required").remove()
            }
            y.is_required = w;
            if ((y.is_required == "1") || (y.is_unique == "1")) {
                $("#prop_options legend").css({
                    "background-color": "#DC6666",
                    "border-color": "#DC6666"
                });
                $("#prop_options fieldset").css("border-color", "#DC6666")
            } else {
                $("#prop_options legend").css({
                    "background-color": "#3D6C10",
                    "border-color": "#3D6C10"
                });
                $("#prop_options fieldset").css("border-color", "#3D6C10")
            }
        } else {
            if (B == "element_unique") {
                y.is_unique = w;
                if ((y.is_required == "1") || (y.is_unique == "1")) {
                    $("#prop_options legend").css({
                        "background-color": "#DC6666",
                        "border-color": "#DC6666"
                    });
                    $("#prop_options fieldset").css("border-color", "#DC6666")
                } else {
                    $("#prop_options legend").css({
                        "background-color": "#3D6C10",
                        "border-color": "#3D6C10"
                    });
                    $("#prop_options fieldset").css("border-color", "#3D6C10")
                }
            } else {
                if (B == "element_visibility") {
                    if (w == "1") {
                        $("#" + active_element).addClass("private");
                        $("#prop_access_control legend").css({
                            "background-color": "#DC6666",
                            "border-color": "#DC6666"
                        });
                        $("#prop_access_control fieldset").css("border-color", "#DC6666")
                    } else {
                        $("#" + active_element).removeClass("private");
                        $("#prop_access_control legend").css({
                            "background-color": "#3D6C10",
                            "border-color": "#3D6C10"
                        });
                        $("#prop_access_control fieldset").css("border-color", "#3D6C10")
                    }
                    y.is_private = w
                } else {
                    if (B == "element_guidelines") {
                        if (y.type != "section") {
                            if ($("#" + active_element + " > p.guidelines").length) {
                                $("#" + active_element + " > p.guidelines").html(w.replace(/\n/g, "<br />"));
                                if ($("#" + active_element + " > p.guidelines").text().length < 1) {
                                    $("#" + active_element + " > p.guidelines").remove();
                                    if ($("#form_builder_sortable p.guidelines").length == 0) {
                                        if ($("#form_builder_sortable > li").size() <= 50) {
                                            $("#form_builder_sortable > li").not(".li_pagination").animate({
                                                width: "97%"
                                            },
                                            {
                                                duration: 250,
                                                queue: true,
                                                complete: function() {
                                                    $("#main_body").addClass("no_guidelines")
                                                }
                                            })
                                        } else {
                                            $("#form_builder_sortable > li").not(".li_pagination").css("width", "97%")
                                        }
                                        $("#main_body").addClass("no_guidelines")
                                    }
                                }
                            } else {
                                if (w != "") {
                                    if ($("#main_body").hasClass("no_guidelines")) {
                                        var E = "61%";
                                        if ($("#form_header").data("form_properties").label_alignment != "top_label") {
                                            E = "76%"
                                        }
                                        if ($("#form_builder_sortable > li").size() <= 50) {
                                            $("#form_builder_sortable > li").not(".li_pagination").animate({
                                                width: E
                                            },
                                            {
                                                duration: 250,
                                                queue: true,
                                                complete: function() {
                                                    $("#main_body").removeClass("no_guidelines")
                                                }
                                            })
                                        } else {
                                            $("#form_builder_sortable > li").not(".li_pagination").css("width", E)
                                        }
                                        $("#main_body").removeClass("no_guidelines")
                                    }
                                    $("#" + active_element).append('<p class="guidelines">' + w.replace(/\n/g, "<br />") + "</p>")
                                }
                            }
                        } else {
                            $("#" + active_element + " > p").html(w.replace(/\n/g, "<br />"))
                        }
                        y.guidelines = w
                    } else {
                        if (B == "element_custom_css") {
                            y.css_class = w
                        } else {
                            if (B == "element_section_display_in_email") {
                                y.section_display_in_email = w
                            } else {
                                if (B == "element_date_enable_range") {
                                    if (w == 1) {
                                        $("#prop_date_range_details").slideDown();
                                        $("#prop_date_past_future").prop("disabled", true);
                                        $("#prop_date_past_future_selection").prop("checked", false);
                                        y.date_disable_past_future = 0
                                    } else {
                                        $("#prop_date_range_details").fadeOut("slow")
                                    }
                                    y.date_enable_range = w;
                                    if ((y.date_enable_range == 1) || (y.date_enable_selection_limit == 1) || (y.date_disable_past_future == 1) || (y.date_disable_weekend == 1) || (y.date_disable_specific == 1)) {
                                        $("#prop_date_options legend").css({
                                            "background-color": "#DC6666",
                                            "border-color": "#DC6666"
                                        });
                                        $("#prop_date_options fieldset").css("border-color", "#DC6666")
                                    } else {
                                        $("#prop_date_options legend").css({
                                            "background-color": "#3D6C10",
                                            "border-color": "#3D6C10"
                                        });
                                        $("#prop_date_options fieldset").css("border-color", "#3D6C10")
                                    }
                                } else {
                                    if (B == "element_date_range_min") {
                                        y.date_range_min = w
                                    } else {
                                        if (B == "element_date_range_max") {
                                            y.date_range_max = w
                                        } else {
                                            if (B == "element_date_enable_selection_limit") {
                                                if (w == 1) {
                                                    $("#form_date_selection_limit").slideDown()
                                                } else {
                                                    $("#form_date_selection_limit").fadeOut("slow")
                                                }
                                                y.date_enable_selection_limit = w;
                                                if ((y.date_enable_range == 1) || (y.date_enable_selection_limit == 1) || (y.date_disable_past_future == 1) || (y.date_disable_weekend == 1) || (y.date_disable_specific == 1)) {
                                                    $("#prop_date_options legend").css({
                                                        "background-color": "#DC6666",
                                                        "border-color": "#DC6666"
                                                    });
                                                    $("#prop_date_options fieldset").css("border-color", "#DC6666")
                                                } else {
                                                    $("#prop_date_options legend").css({
                                                        "background-color": "#3D6C10",
                                                        "border-color": "#3D6C10"
                                                    });
                                                    $("#prop_date_options fieldset").css("border-color", "#3D6C10")
                                                }
                                            } else {
                                                if (B == "element_section_enable_scroll") {
                                                    if (w == 1) {
                                                        $("#" + active_element).removeClass("section_scroll_small section_scroll_medium section_scroll_large").addClass("section_scroll_" + y.size);
                                                        $("#div_section_size").slideDown()
                                                    } else {
                                                        $("#" + active_element).removeClass("section_scroll_small section_scroll_medium section_scroll_large");
                                                        $("#div_section_size").fadeOut("fast")
                                                    }
                                                    y.section_enable_scroll = w
                                                } else {
                                                    if (B == "element_date_selection_max") {
                                                        y.date_selection_max = parseInt(w)
                                                    } else {
                                                        if (B == "element_date_disable_specific") {
                                                            if (w == 1) {
                                                                $("#form_date_disable_specific").slideDown()
                                                            } else {
                                                                $("#form_date_disable_specific").fadeOut("slow")
                                                            }
                                                            y.date_disable_specific = w;
                                                            if ((y.date_enable_range == 1) || (y.date_enable_selection_limit == 1) || (y.date_disable_past_future == 1) || (y.date_disable_weekend == 1) || (y.date_disable_specific == 1)) {
                                                                $("#prop_date_options legend").css({
                                                                    "background-color": "#DC6666",
                                                                    "border-color": "#DC6666"
                                                                });
                                                                $("#prop_date_options fieldset").css("border-color", "#DC6666")
                                                            } else {
                                                                $("#prop_date_options legend").css({
                                                                    "background-color": "#3D6C10",
                                                                    "border-color": "#3D6C10"
                                                                });
                                                                $("#prop_date_options fieldset").css("border-color", "#3D6C10")
                                                            }
                                                        } else {
                                                            if (B == "element_date_disabled_list") {
                                                                y.date_disabled_list = w
                                                            } else {
                                                                if (B == "element_date_disable_past_future") {
                                                                    if (w == 1) {
                                                                        $("#prop_date_past_future").prop("disabled", false);
                                                                        $("#prop_date_range_details").fadeOut("slow");
                                                                        $("#prop_date_range").prop("checked", false);
                                                                        y.date_enable_range = 0
                                                                    } else {
                                                                        $("#prop_date_past_future").prop("disabled", true)
                                                                    }
                                                                    y.date_disable_past_future = w;
                                                                    if ((y.date_enable_range == 1) || (y.date_enable_selection_limit == 1) || (y.date_disable_past_future == 1) || (y.date_disable_weekend == 1) || (y.date_disable_specific == 1)) {
                                                                        $("#prop_date_options legend").css({
                                                                            "background-color": "#DC6666",
                                                                            "border-color": "#DC6666"
                                                                        });
                                                                        $("#prop_date_options fieldset").css("border-color", "#DC6666")
                                                                    } else {
                                                                        $("#prop_date_options legend").css({
                                                                            "background-color": "#3D6C10",
                                                                            "border-color": "#3D6C10"
                                                                        });
                                                                        $("#prop_date_options fieldset").css("border-color", "#3D6C10")
                                                                    }
                                                                } else {
                                                                    if (B == "element_date_disable_weekend") {
                                                                        y.date_disable_weekend = w;
                                                                        if ((y.date_enable_range == 1) || (y.date_enable_selection_limit == 1) || (y.date_disable_past_future == 1) || (y.date_disable_weekend == 1) || (y.date_disable_specific == 1)) {
                                                                            $("#prop_date_options legend").css({
                                                                                "background-color": "#DC6666",
                                                                                "border-color": "#DC6666"
                                                                            });
                                                                            $("#prop_date_options fieldset").css("border-color", "#DC6666")
                                                                        } else {
                                                                            $("#prop_date_options legend").css({
                                                                                "background-color": "#3D6C10",
                                                                                "border-color": "#3D6C10"
                                                                            });
                                                                            $("#prop_date_options fieldset").css("border-color", "#3D6C10")
                                                                        }
                                                                    } else {
                                                                        if (B == "date_past_future") {
                                                                            y.date_past_future = w
                                                                        } else {
                                                                            if (B == "element_file_enable_type_limit") {
                                                                                if (w == 1) {
                                                                                    $("#form_file_limit_type").slideDown()
                                                                                } else {
                                                                                    $("#form_file_limit_type").fadeOut("slow")
                                                                                }
                                                                                y.file_enable_type_limit = w
                                                                            } else {
                                                                                if (B == "element_file_block_or_allow") {
                                                                                    y.file_block_or_allow = w;
                                                                                    y.file_type_list = "";
                                                                                    $("#file_type_list").val("")
                                                                                } else {
                                                                                    if (B == "element_file_type_list") {
                                                                                        y.file_type_list = w
                                                                                    } else {
                                                                                        if (B == "element_file_as_attachment") {
                                                                                            y.file_as_attachment = w
                                                                                        } else {
                                                                                            if (B == "element_file_auto_upload") {
                                                                                                y.file_auto_upload = w
                                                                                            } else {
                                                                                                if (B == "element_file_enable_multi_upload") {
                                                                                                    if (w == 1) {
                                                                                                        $("#form_file_max_selection").slideDown()
                                                                                                    } else {
                                                                                                        $("#form_file_max_selection").fadeOut("slow")
                                                                                                    }
                                                                                                    y.file_enable_multi_upload = w
                                                                                                } else {
                                                                                                    if (B == "element_file_max_selection") {
                                                                                                        y.file_max_selection = parseInt(w)
                                                                                                    } else {
                                                                                                        if (B == "element_file_enable_size_limit") {
                                                                                                            if (w == 1) {
                                                                                                                $("#form_file_limit_size").slideDown()
                                                                                                            } else {
                                                                                                                $("#form_file_limit_size").fadeOut("slow")
                                                                                                            }
                                                                                                            y.file_enable_size_limit = w
                                                                                                        } else {
                                                                                                            if (B == "element_file_size_max") {
                                                                                                                y.file_size_max = parseInt(w)
                                                                                                            } else {
                                                                                                                if (B == "element_file_enable_advance") {
                                                                                                                    if (w == 1) {
                                                                                                                        $("#prop_file_advance_options").slideDown()
                                                                                                                    } else {
                                                                                                                        $("#prop_file_advance_options").fadeOut("slow")
                                                                                                                    }
                                                                                                                    y.file_enable_advance = w
                                                                                                                } else {
                                                                                                                    if (B == "element_number_enable_quantity") {
                                                                                                                        if (w == 1) {
                                                                                                                            rebuild_quantity_link_dropdown();
                                                                                                                            $("#prop_number_quantity_link_div").slideDown()
                                                                                                                        } else {
                                                                                                                            $("#prop_number_quantity_link_div").fadeOut("slow")
                                                                                                                        }
                                                                                                                        y.number_enable_quantity = w
                                                                                                                    } else {
                                                                                                                        if (B == "element_number_quantity_link") {
                                                                                                                            y.number_quantity_link = w
                                                                                                                        } else {
                                                                                                                            if (B == "element_choice_columns") {
                                                                                                                                var q = "";
                                                                                                                                if (w == 1) {
                                                                                                                                    q = ""
                                                                                                                                } else {
                                                                                                                                    if (w == 2) {
                                                                                                                                        q = "two_columns"
                                                                                                                                    } else {
                                                                                                                                        if (w == 3) {
                                                                                                                                            q = "three_columns"
                                                                                                                                        } else {
                                                                                                                                            if (w == 9) {
                                                                                                                                                q = "inline_columns"
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                                $("#" + active_element).removeClass("two_columns three_columns inline_columns").addClass(q);
                                                                                                                                y.choice_columns = w
                                                                                                                            } else {
                                                                                                                                if (B == "element_range_min") {
                                                                                                                                    var K = parseInt(w);
                                                                                                                                    if (!isNaN(K)) {
                                                                                                                                        y.range_min = K
                                                                                                                                    } else {
                                                                                                                                        y.range_min = 0
                                                                                                                                    }
                                                                                                                                    if ((parseInt(y.range_min) + parseInt(y.range_max)) >= 1) {
                                                                                                                                        $("#prop_range legend").css({
                                                                                                                                            "background-color": "#DC6666",
                                                                                                                                            "border-color": "#DC6666"
                                                                                                                                        });
                                                                                                                                        $("#prop_range fieldset").css("border-color", "#DC6666")
                                                                                                                                    } else {
                                                                                                                                        $("#prop_range legend").css({
                                                                                                                                            "background-color": "#3D6C10",
                                                                                                                                            "border-color": "#3D6C10"
                                                                                                                                        });
                                                                                                                                        $("#prop_range fieldset").css("border-color", "#3D6C10")
                                                                                                                                    }
                                                                                                                                    $("#" + active_element + " div > label").remove();
                                                                                                                                    var r = "";
                                                                                                                                    if (y.range_limit_by == "c") {
                                                                                                                                        r = "characters"
                                                                                                                                    } else {
                                                                                                                                        if (y.range_limit_by == "w") {
                                                                                                                                            r = "words"
                                                                                                                                        } else {
                                                                                                                                            if (y.range_limit_by == "d") {
                                                                                                                                                r = "digits"
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                    if (y.range_limit_by == "c" || y.range_limit_by == "w" || y.range_limit_by == "d") {
                                                                                                                                        if ((y.range_min > 0 && y.range_max > 0) && (y.range_min == y.range_max)) {
                                                                                                                                            $("#element_" + u).after('<label for="element_' + u + '">Must be <var id="range_min_' + u + '">' + y.range_min + '</var> <var class="range_limit_by">' + r + '</var>.&nbsp;&nbsp; <em class="currently_entered">Currently Entered: <var id="currently_entered_' + u + '">0</var> <var class="range_limit_by">' + r + "</var>.</em></label>")
                                                                                                                                        } else {
                                                                                                                                            if (y.range_min > 0 && y.range_max > 0) {
                                                                                                                                                $("#element_" + u).after('<label for="element_' + u + '">Must be between <var id="range_min_' + u + '">' + y.range_min + '</var> and <var id="range_max_' + u + '">' + y.range_max + '</var> <var class="range_limit_by">' + r + '</var>.&nbsp;&nbsp; <em class="currently_entered">Currently Entered: <var id="currently_entered_' + u + '">0</var> <var class="range_limit_by">' + r + "</var>.</em></label>")
                                                                                                                                            } else {
                                                                                                                                                if (y.range_max > 0) {
                                                                                                                                                    $("#element_" + u).after('<label for="element_' + u + '">Maximum of <var id="range_max_' + u + '">' + y.range_max + '</var> <var class="range_limit_by">' + r + '</var> allowed.&nbsp;&nbsp; <em class="currently_entered">Currently Entered: <var id="currently_entered_' + u + '">0</var> <var class="range_limit_by">' + r + "</var>.</em></label>")
                                                                                                                                                } else {
                                                                                                                                                    if (y.range_min > 0) {
                                                                                                                                                        $("#element_" + u).after('<label for="element_' + u + '">Minimum of <var id="range_min_' + u + '">' + y.range_min + '</var> <var class="range_limit_by">' + r + '</var> required.&nbsp;&nbsp; <em class="currently_entered">Currently Entered: <var id="currently_entered_' + u + '">0</var> <var class="range_limit_by">' + r + "</var>.</em></label>")
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    } else {
                                                                                                                                        if (y.range_limit_by == "v") {
                                                                                                                                            if (y.range_min > 0 && y.range_max > 0) {
                                                                                                                                                $("#element_" + u).after('<label for="element_' + u + '">Must be a number between <var id="range_min_' + u + '">' + y.range_min + '</var> and <var id="range_max_' + u + '">' + y.range_max + "</var>.</label>")
                                                                                                                                            } else {
                                                                                                                                                if (y.range_max > 0) {
                                                                                                                                                    $("#element_" + u).after('<label for="element_' + u + '">Must be a number less than or equal to <var id="range_max_' + u + '">' + y.range_max + "</var>.</label>")
                                                                                                                                                } else {
                                                                                                                                                    if (y.range_min > 0) {
                                                                                                                                                        $("#element_" + u).after('<label for="element_' + u + '">Must be a number greater than or equal to <var id="range_min_' + u + '">' + y.range_min + "</var>.</label>")
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                } else {
                                                                                                                                    if (B == "element_range_max") {
                                                                                                                                        var o = parseInt(w);
                                                                                                                                        if (!isNaN(o)) {
                                                                                                                                            y.range_max = o
                                                                                                                                        } else {
                                                                                                                                            y.range_max = 0
                                                                                                                                        }
                                                                                                                                        if ((parseInt(y.range_min) + parseInt(y.range_max)) >= 1) {
                                                                                                                                            $("#prop_range legend").css({
                                                                                                                                                "background-color": "#DC6666",
                                                                                                                                                "border-color": "#DC6666"
                                                                                                                                            });
                                                                                                                                            $("#prop_range fieldset").css("border-color", "#DC6666")
                                                                                                                                        } else {
                                                                                                                                            $("#prop_range legend").css({
                                                                                                                                                "background-color": "#3D6C10",
                                                                                                                                                "border-color": "#3D6C10"
                                                                                                                                            });
                                                                                                                                            $("#prop_range fieldset").css("border-color", "#3D6C10")
                                                                                                                                        }
                                                                                                                                        $("#" + active_element + " div > label").remove();
                                                                                                                                        var r = "";
                                                                                                                                        if (y.range_limit_by == "c") {
                                                                                                                                            r = "characters"
                                                                                                                                        } else {
                                                                                                                                            if (y.range_limit_by == "w") {
                                                                                                                                                r = "words"
                                                                                                                                            } else {
                                                                                                                                                if (y.range_limit_by == "d") {
                                                                                                                                                    r = "digits"
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                        if (y.range_limit_by == "c" || y.range_limit_by == "w" || y.range_limit_by == "d") {
                                                                                                                                            if ((y.range_min > 0 && y.range_max > 0) && (y.range_min == y.range_max)) {
                                                                                                                                                $("#element_" + u).after('<label for="element_' + u + '">Must be <var id="range_min_' + u + '">' + y.range_min + '</var> <var class="range_limit_by">' + r + '</var>.&nbsp;&nbsp; <em class="currently_entered">Currently Entered: <var id="currently_entered_' + u + '">0</var> <var class="range_limit_by">' + r + "</var>.</em></label>")
                                                                                                                                            } else {
                                                                                                                                                if (y.range_min > 0 && y.range_max > 0) {
                                                                                                                                                    $("#element_" + u).after('<label for="element_' + u + '">Must be between <var id="range_min_' + u + '">' + y.range_min + '</var> and <var id="range_max_' + u + '">' + y.range_max + '</var> <var class="range_limit_by">' + r + '</var>.&nbsp;&nbsp; <em class="currently_entered">Currently Entered: <var id="currently_entered_' + u + '">0</var> <var class="range_limit_by">' + r + "</var>.</em></label>")
                                                                                                                                                } else {
                                                                                                                                                    if (y.range_max > 0) {
                                                                                                                                                        $("#element_" + u).after('<label for="element_' + u + '">Maximum of <var id="range_max_' + u + '">' + y.range_max + '</var> <var class="range_limit_by">' + r + '</var> allowed.&nbsp;&nbsp; <em class="currently_entered">Currently Entered: <var id="currently_entered_' + u + '">0</var> <var class="range_limit_by">' + r + "</var>.</em></label>")
                                                                                                                                                    } else {
                                                                                                                                                        if (y.range_min > 0) {
                                                                                                                                                            $("#element_" + u).after('<label for="element_' + u + '">Minimum of <var id="range_min_' + u + '">' + y.range_min + '</var> <var class="range_limit_by">' + r + '</var> required.&nbsp;&nbsp; <em class="currently_entered">Currently Entered: <var id="currently_entered_' + u + '">0</var> <var class="range_limit_by">' + r + "</var>.</em></label>")
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        } else {
                                                                                                                                            if (y.range_limit_by == "v") {
                                                                                                                                                if (y.range_min > 0 && y.range_max > 0) {
                                                                                                                                                    $("#element_" + u).after('<label for="element_' + u + '">Must be a number between <var id="range_min_' + u + '">' + y.range_min + '</var> and <var id="range_max_' + u + '">' + y.range_max + "</var>.</label>")
                                                                                                                                                } else {
                                                                                                                                                    if (y.range_max > 0) {
                                                                                                                                                        $("#element_" + u).after('<label for="element_' + u + '">Must be a number less than or equal to <var id="range_max_' + u + '">' + y.range_max + "</var>.</label>")
                                                                                                                                                    } else {
                                                                                                                                                        if (y.range_min > 0) {
                                                                                                                                                            $("#element_" + u).after('<label for="element_' + u + '">Must be a number greater than or equal to <var id="range_min_' + u + '">' + y.range_min + "</var>.</label>")
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    } else {
                                                                                                                                        if (B == "element_range_limit_by") {
                                                                                                                                            if (w == "c") {
                                                                                                                                                $("#" + active_element + " var.range_limit_by").text("characters")
                                                                                                                                            } else {
                                                                                                                                                if (w == "w") {
                                                                                                                                                    $("#" + active_element + " var.range_limit_by").text("words")
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                            if (y.type == "number") {
                                                                                                                                                $("#" + active_element + " div > label").remove();
                                                                                                                                                if (w == "d") {
                                                                                                                                                    var r = "digits";
                                                                                                                                                    if ((y.range_min > 0 && y.range_max > 0) && (y.range_min == y.range_max)) {
                                                                                                                                                        $("#element_" + u).after('<label for="element_' + u + '">Must be <var id="range_min_' + u + '">' + y.range_min + '</var> <var class="range_limit_by">' + r + '</var>.&nbsp;&nbsp; <em class="currently_entered">Currently Entered: <var id="currently_entered_' + u + '">0</var> <var class="range_limit_by">' + r + "</var>.</em></label>")
                                                                                                                                                    } else {
                                                                                                                                                        if (y.range_min > 0 && y.range_max > 0) {
                                                                                                                                                            $("#element_" + u).after('<label for="element_' + u + '">Must be between <var id="range_min_' + u + '">' + y.range_min + '</var> and <var id="range_max_' + u + '">' + y.range_max + '</var> <var class="range_limit_by">' + r + '</var>.&nbsp;&nbsp; <em class="currently_entered">Currently Entered: <var id="currently_entered_' + u + '">0</var> <var class="range_limit_by">' + r + "</var>.</em></label>")
                                                                                                                                                        } else {
                                                                                                                                                            if (y.range_max > 0) {
                                                                                                                                                                $("#element_" + u).after('<label for="element_' + u + '">Maximum of <var id="range_max_' + u + '">' + y.range_max + '</var> <var class="range_limit_by">' + r + '</var> allowed.&nbsp;&nbsp; <em class="currently_entered">Currently Entered: <var id="currently_entered_' + u + '">0</var> <var class="range_limit_by">' + r + "</var>.</em></label>")
                                                                                                                                                            } else {
                                                                                                                                                                if (y.range_min > 0) {
                                                                                                                                                                    $("#element_" + u).after('<label for="element_' + u + '">Minimum of <var id="range_min_' + u + '">' + y.range_min + '</var> <var class="range_limit_by">' + r + '</var> required.&nbsp;&nbsp; <em class="currently_entered">Currently Entered: <var id="currently_entered_' + u + '">0</var> <var class="range_limit_by">' + r + "</var>.</em></label>")
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                } else {
                                                                                                                                                    if (w == "v") {
                                                                                                                                                        if (y.range_min > 0 && y.range_max > 0) {
                                                                                                                                                            $("#element_" + u).after('<label for="element_' + u + '">Must be a number between <var id="range_min_' + u + '">' + y.range_min + '</var> and <var id="range_max_' + u + '">' + y.range_max + "</var>.</label>")
                                                                                                                                                        } else {
                                                                                                                                                            if (y.range_max > 0) {
                                                                                                                                                                $("#element_" + u).after('<label for="element_' + u + '">Must be a number less than or equal to <var id="range_max_' + u + '">' + y.range_max + "</var>.</label>")
                                                                                                                                                            } else {
                                                                                                                                                                if (y.range_min > 0) {
                                                                                                                                                                    $("#element_" + u).after('<label for="element_' + u + '">Must be a number greater than or equal to <var id="range_min_' + u + '">' + y.range_min + "</var>.</label>")
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                            y.range_limit_by = w
                                                                                                                                        } else {
                                                                                                                                            if (B == "element_size") {
                                                                                                                                                y.size = w;
                                                                                                                                                if (g.data("field_properties").type == "section") {
                                                                                                                                                    $("#" + active_element).removeClass("section_scroll_small section_scroll_medium section_scroll_large").addClass("section_scroll_" + w)
                                                                                                                                                } else {
                                                                                                                                                    if (g.data("field_properties").type == "signature") {
                                                                                                                                                        $("#" + active_element + " .signature_pad").removeClass("small medium large").addClass(w)
                                                                                                                                                    } else {
                                                                                                                                                        $("#" + active_element + " :input").removeClass("small medium large").addClass(w)
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            } else {
                                                                                                                                                if (B == "element_type_change") {
                                                                                                                                                    var j = y.position;
                                                                                                                                                    var l = g.html();
                                                                                                                                                    var F = $("#form_header").data("form_properties").id;
                                                                                                                                                    var z = $("#" + active_element).data("field_properties");
                                                                                                                                                    if (g.data("field_properties").is_db_live == 0) {
                                                                                                                                                        g.html('<img src="/GIedu/Public/plugins/forms/images/loader_small.gif" style="vertical-align: middle"/> changing field type ...').addClass("delete_processing");
                                                                                                                                                        $.ajax({
                                                                                                                                                            type: "POST",
                                                                                                                                                            async: true,
                                                                                                                                                            url: "delete_draft_field.php",
                                                                                                                                                            data: {
                                                                                                                                                                form_id: F,
                                                                                                                                                                element_id: g.data("field_properties").id,
                                                                                                                                                                element_type: g.data("field_properties").type
                                                                                                                                                            },
                                                                                                                                                            cache: false,
                                                                                                                                                            global: true,
                                                                                                                                                            dataType: "json",
                                                                                                                                                            error: function(S, Q, R) {
                                                                                                                                                                g.html(l).removeClass("delete_processing")
                                                                                                                                                            },
                                                                                                                                                            success: function(Q) {
                                                                                                                                                                if (Q.status == "ok") {
                                                                                                                                                                    z.type = w;
                                                                                                                                                                    $.ajax({
                                                                                                                                                                        type: "POST",
                                                                                                                                                                        async: true,
                                                                                                                                                                        url: "add_field.php",
                                                                                                                                                                        data: {
                                                                                                                                                                            element_type: w,
                                                                                                                                                                            form_id: F,
                                                                                                                                                                            holder_id: "li_" + y.id,
                                                                                                                                                                            position: j,
                                                                                                                                                                            action: "duplicate",
                                                                                                                                                                            field_properties: z
                                                                                                                                                                        },
                                                                                                                                                                        cache: false,
                                                                                                                                                                        global: true,
                                                                                                                                                                        dataType: "json",
                                                                                                                                                                        error: function(T, R, S) {
                                                                                                                                                                            g.html(l).removeClass("delete_processing");
                                                                                                                                                                            $("#dialog-message").dialog("open")
                                                                                                                                                                        },
                                                                                                                                                                        success: function(S) {
                                                                                                                                                                            if (S.status == "ok") {
                                                                                                                                                                                var R = $(S.markup);
                                                                                                                                                                                R.data("field_properties", g.data("field_properties"));
                                                                                                                                                                                R.data("field_properties").id = S.element_id;
                                                                                                                                                                                R.data("field_properties").type = w;
                                                                                                                                                                                $("#" + S.holder_id).replaceWith(R);
                                                                                                                                                                                $("#li_" + S.element_id).hide().fadeIn();
                                                                                                                                                                                reorganize_page_break();
                                                                                                                                                                                $("#form_builder_sortable").sortable("refreshPositions");
                                                                                                                                                                                select_element("#li_" + S.element_id)
                                                                                                                                                                            } else {
                                                                                                                                                                                $("#dialog-message").dialog("open");
                                                                                                                                                                                $("#form_builder_sortable .click_processing").remove()
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                    })
                                                                                                                                                                } else {
                                                                                                                                                                    g.html(l).removeClass("delete_processing");
                                                                                                                                                                    $("#dialog-message").dialog("open")
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        })
                                                                                                                                                    }
                                                                                                                                                } else {
                                                                                                                                                    if (B == "element_default_value") {
                                                                                                                                                        y.default_value = w;
                                                                                                                                                        if (y.type == "address") {
                                                                                                                                                            $("#element_" + y.id + "_6").val(w)
                                                                                                                                                        } else {
                                                                                                                                                            if (y.type == "date" || y.type == "europe_date") {} else {
                                                                                                                                                                if (y.type == "phone") {
                                                                                                                                                                    $("#element_" + y.id + "_1").val($("#element_default_phone1").val());
                                                                                                                                                                    $("#element_" + y.id + "_2").val($("#element_default_phone2").val());
                                                                                                                                                                    $("#element_" + y.id + "_3").val($("#element_default_phone3").val())
                                                                                                                                                                } else {
                                                                                                                                                                    $("#" + active_element + " :input").val(w)
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    } else {
                                                                                                                                                        if (B == "element_choice_other_label") {
                                                                                                                                                            y.choice_other_label = w;
                                                                                                                                                            $("#" + active_element + " label.other").html(w)
                                                                                                                                                        } else {
                                                                                                                                                            if (B == "element_choice_has_other") {
                                                                                                                                                                y.choice_has_other = w;
                                                                                                                                                                if (w == 1) {
                                                                                                                                                                    var A = "";
                                                                                                                                                                    A += '<input id="element_' + y.id + '_0" name="element_' + y.id + '" class="element radio" type="' + y.type + '" value="0" />';
                                                                                                                                                                    A += '<label class="choice other" for="element_' + y.id + '_0">' + y.choice_other_label + "</label>";
                                                                                                                                                                    A += '<input type="text" value="" class="element text other" name="element_' + y.id + '_other" id="element_' + y.id + '_other" />';
                                                                                                                                                                    A = "<span>" + A + "</span>";
                                                                                                                                                                    $("#" + active_element + " > div").append(A);
                                                                                                                                                                    $("#" + active_element + " > div > span").last().hide().slideDown();
                                                                                                                                                                    $("#prop_other_choices_label").prop("disabled", false).select().focus()
                                                                                                                                                                } else {
                                                                                                                                                                    $("#" + active_element + " div > span").last().slideUp("slow",
                                                                                                                                                                function() {
                                                                                                                                                                        $(this).remove()
                                                                                                                                                                    });
                                                                                                                                                                    $("#prop_other_choices_label").prop("disabled", true)
                                                                                                                                                                }
                                                                                                                                                            } else {
                                                                                                                                                                if (B == "constraint") {
                                                                                                                                                                    if (y.type == "money") {
                                                                                                                                                                        var I = "";
                                                                                                                                                                        var N = "";
                                                                                                                                                                        var L = "";
                                                                                                                                                                        if (w == "dollar" || w == "") {
                                                                                                                                                                            I = "&#36;";
                                                                                                                                                                            N = "Dollars";
                                                                                                                                                                            L = "Cents"
                                                                                                                                                                        } else {
                                                                                                                                                                            if (w == "euro") {
                                                                                                                                                                                I = "&#8364;";
                                                                                                                                                                                N = "Euros";
                                                                                                                                                                                L = "Cents"
                                                                                                                                                                            } else {
                                                                                                                                                                                if (w == "pound") {
                                                                                                                                                                                    I = "&#163;";
                                                                                                                                                                                    N = "Pounds";
                                                                                                                                                                                    L = "Pence"
                                                                                                                                                                                } else {
                                                                                                                                                                                    if (w == "baht") {
                                                                                                                                                                                        I = "&#3647;";
                                                                                                                                                                                        N = "Baht";
                                                                                                                                                                                        L = "Satang"
                                                                                                                                                                                    } else {
                                                                                                                                                                                        if (w == "rupees") {
                                                                                                                                                                                            I = "Rs";
                                                                                                                                                                                            N = "Rupees";
                                                                                                                                                                                            L = "Paise"
                                                                                                                                                                                        } else {
                                                                                                                                                                                            if (w == "rand") {
                                                                                                                                                                                                I = "R";
                                                                                                                                                                                                N = "Rand";
                                                                                                                                                                                                L = "Cents"
                                                                                                                                                                                            } else {
                                                                                                                                                                                                if (w == "forint") {
                                                                                                                                                                                                    I = "&#70;&#116;";
                                                                                                                                                                                                    N = "Forint";
                                                                                                                                                                                                    L = "Filler"
                                                                                                                                                                                                } else {
                                                                                                                                                                                                    if (w == "franc") {
                                                                                                                                                                                                        I = "CHF";
                                                                                                                                                                                                        N = "Francs";
                                                                                                                                                                                                        L = "Rappen"
                                                                                                                                                                                                    } else {
                                                                                                                                                                                                        if (w == "koruna") {
                                                                                                                                                                                                            I = "&#75;&#269;";
                                                                                                                                                                                                            N = "Koruna";
                                                                                                                                                                                                            L = "Haléřů"
                                                                                                                                                                                                        } else {
                                                                                                                                                                                                            if (w == "krona") {
                                                                                                                                                                                                                I = "kr";
                                                                                                                                                                                                                N = "Kroner";
                                                                                                                                                                                                                L = "Øre"
                                                                                                                                                                                                            } else {
                                                                                                                                                                                                                if (w == "pesos") {
                                                                                                                                                                                                                    I = "&#36;";
                                                                                                                                                                                                                    N = "Pesos";
                                                                                                                                                                                                                    L = "Cents"
                                                                                                                                                                                                                } else {
                                                                                                                                                                                                                    if (w == "ringgit") {
                                                                                                                                                                                                                        I = "RM";
                                                                                                                                                                                                                        N = "Ringgit";
                                                                                                                                                                                                                        L = "Sen"
                                                                                                                                                                                                                    } else {
                                                                                                                                                                                                                        if (w == "zloty") {
                                                                                                                                                                                                                            I = "&#122;&#322;";
                                                                                                                                                                                                                            N = "Złoty";
                                                                                                                                                                                                                            L = "Grosz"
                                                                                                                                                                                                                        } else {
                                                                                                                                                                                                                            if (w == "riyals") {
                                                                                                                                                                                                                                I = "&#65020;";
                                                                                                                                                                                                                                N = "Riyals";
                                                                                                                                                                                                                                L = "Halalah"
                                                                                                                                                                                                                            } else {
                                                                                                                                                                                                                                if (w == "yen") {
                                                                                                                                                                                                                                    I = "&#165;";
                                                                                                                                                                                                                                    N = "Yen"
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                            }
                                                                                                                                                                                                                        }
                                                                                                                                                                                                                    }
                                                                                                                                                                                                                }
                                                                                                                                                                                                            }
                                                                                                                                                                                                        }
                                                                                                                                                                                                    }
                                                                                                                                                                                                }
                                                                                                                                                                                            }
                                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                        $("#" + active_element + " > span.symbol").html(I);
                                                                                                                                                                        if (w == "yen" && y.constraint != "yen") {
                                                                                                                                                                            $("#" + active_element + " > span").last().remove();
                                                                                                                                                                            $("#" + active_element + " > span").last().contents().filter(function() {
                                                                                                                                                                                return this.nodeType == 3
                                                                                                                                                                            }).remove();
                                                                                                                                                                            $("#element_" + y.id + "_1").attr("size", 15);
                                                                                                                                                                            $("#" + active_element + " > span label").first().text(N)
                                                                                                                                                                        } else {
                                                                                                                                                                            if (w != "yen" && y.constraint == "yen") {
                                                                                                                                                                                $("#element_" + y.id + "_1").attr("size", 10);
                                                                                                                                                                                $("#" + active_element + " > span").first().next().children().first().after(" . ");
                                                                                                                                                                                $("#" + active_element).append('<span><input type="text" size="2" class="text" readonly="readonly"><label>' + L + "</label></span>");
                                                                                                                                                                                $("#" + active_element + " > span label").first().text(N)
                                                                                                                                                                            } else {
                                                                                                                                                                                if (w != "yen" && y.constraint != "yen") {
                                                                                                                                                                                    $("#" + active_element + " > span label").first().text(N).end().last().text(L)
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                    } else {
                                                                                                                                                                        if (y.type == "text") {
                                                                                                                                                                            var C = "";
                                                                                                                                                                            if (w == "password") {
                                                                                                                                                                                C = "password"
                                                                                                                                                                            } else {
                                                                                                                                                                                C = "text"
                                                                                                                                                                            }
                                                                                                                                                                            var n = '<input type="' + C + '" title="" value="' + $("#element_" + y.id).val() + '" class="element text ' + y.size + '" name="element_' + y.id + '" id="element_' + y.id + '">';
                                                                                                                                                                            $("#element_" + y.id).remove();
                                                                                                                                                                            $("#" + active_element + " > div").append(n)
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                    y.constraint = w
                                                                                                                                                                } else {
                                                                                                                                                                    if (B == "element_type") {
                                                                                                                                                                        if (y.is_db_live != 1 && (w == "simple_name" || w == "name" || w == "simple_name_wmiddle" || w == "name_wmiddle")) {
                                                                                                                                                                            $("#" + active_element + " > span").remove();
                                                                                                                                                                            var c = "";
                                                                                                                                                                            var D = "";
                                                                                                                                                                            var h = "";
                                                                                                                                                                            var P = "";
                                                                                                                                                                            var e = "";
                                                                                                                                                                            if (w == "simple_name") {
                                                                                                                                                                                D = '<span><input value="" size="8" maxlength="255" class="element text" name="element_' + y.id + '_1" id="element_' + y.id + '_1"><label>First</label></span>';
                                                                                                                                                                                P = '<span><input value="" size="14" maxlength="255" class="element text" name="element_' + y.id + '_2" id="element_' + y.id + '_2"><label>Last</label></span>';
                                                                                                                                                                                $("#" + active_element + " > label").after(D + P)
                                                                                                                                                                            } else {
                                                                                                                                                                                if (w == "name") {
                                                                                                                                                                                    c = '<span><input value="" size="2" maxlength="255" class="element text" name="element_' + y.id + '_1" id="element_' + y.id + '_1"><label>Title</label></span>';
                                                                                                                                                                                    D = '<span><input value="" size="8" maxlength="255" class="element text" name="element_' + y.id + '_2" id="element_' + y.id + '_2"><label>First</label></span>';
                                                                                                                                                                                    P = '<span><input value="" size="14" maxlength="255" class="element text" name="element_' + y.id + '_3" id="element_' + y.id + '_3"><label>Last</label></span>';
                                                                                                                                                                                    e = '<span><input value="" size="3" maxlength="255" class="element text" name="element_' + y.id + '_4" id="element_' + y.id + '_4"><label>Suffix</label></span>';
                                                                                                                                                                                    $("#" + active_element + " > label").after(c + D + P + e)
                                                                                                                                                                                } else {
                                                                                                                                                                                    if (w == "simple_name_wmiddle") {
                                                                                                                                                                                        D = '<span><input value="" size="8" maxlength="255" class="element text" name="element_' + y.id + '_1" id="element_' + y.id + '_1"><label>First</label></span>';
                                                                                                                                                                                        h = '<span><input value="" size="8" maxlength="255" class="element text" name="element_' + y.id + '_2" id="element_' + y.id + '_2"><label>Middle</label></span>';
                                                                                                                                                                                        P = '<span><input value="" size="14" maxlength="255" class="element text" name="element_' + y.id + '_3" id="element_' + y.id + '_3"><label>Last</label></span>';
                                                                                                                                                                                        $("#" + active_element + " > label").after(D + h + P)
                                                                                                                                                                                    } else {
                                                                                                                                                                                        if (w == "name_wmiddle") {
                                                                                                                                                                                            c = '<span class="namewm_ext"><input value="" maxlength="255" class="element text large" name="element_' + y.id + '_1" id="element_' + y.id + '_1"><label>Title</label></span>';
                                                                                                                                                                                            D = '<span class="namewm_first"><input value="" maxlength="255" class="element text large" name="element_' + y.id + '_2" id="element_' + y.id + '_2"><label>First</label></span>';
                                                                                                                                                                                            h = '<span class="namewm_middle"><input value="" maxlength="255" class="element text large" name="element_' + y.id + '_3" id="element_' + y.id + '_3"><label>Middle</label></span>';
                                                                                                                                                                                            P = '<span class="namewm_last"><input value="" maxlength="255" class="element text large" name="element_' + y.id + '_4" id="element_' + y.id + '_4"><label>Last</label></span>';
                                                                                                                                                                                            e = '<span class="namewm_ext"><input value="" maxlength="255" class="element text large" name="element_' + y.id + '_5" id="element_' + y.id + '_5"><label>Suffix</label></span>';
                                                                                                                                                                                            $("#" + active_element + " > label").after(c + D + h + P + e)
                                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                        if (w == "date") {
                                                                                                                                                                            $("#" + active_element + " > span > label").eq(0).text("MM").end().eq(1).text("DD");
                                                                                                                                                                            $("#element_" + y.id + "_1").val("");
                                                                                                                                                                            $("#element_" + y.id + "_2").val("");
                                                                                                                                                                            $("#element_" + y.id + "_3").val("");
                                                                                                                                                                            $("#element_default_date").val("");
                                                                                                                                                                            y.default_value = ""
                                                                                                                                                                        } else {
                                                                                                                                                                            if (w == "europe_date") {
                                                                                                                                                                                $("#" + active_element + " > span > label").eq(0).text("DD").end().eq(1).text("MM");
                                                                                                                                                                                $("#element_" + y.id + "_1").val("");
                                                                                                                                                                                $("#element_" + y.id + "_2").val("");
                                                                                                                                                                                $("#element_" + y.id + "_3").val("");
                                                                                                                                                                                $("#element_default_date").val("");
                                                                                                                                                                                y.default_value = ""
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                        if (w == "simple_phone") {
                                                                                                                                                                            $("#" + active_element + " > span").remove();
                                                                                                                                                                            var x = '<div><input id="element_' + y.id + '" name="element_' + y.id + '" class="element text medium" type="text" maxlength="255" value=""/></div>';
                                                                                                                                                                            $("#" + active_element).append(x);
                                                                                                                                                                            $("#element_default_value").val("");
                                                                                                                                                                            y.default_value = "";
                                                                                                                                                                            $("#prop_default_phone").hide();
                                                                                                                                                                            $("#prop_default_value").show()
                                                                                                                                                                        } else {
                                                                                                                                                                            if (w == "phone") {
                                                                                                                                                                                var t = "element_" + y.id + "_1";
                                                                                                                                                                                var s = "element_" + y.id + "_2";
                                                                                                                                                                                var p = "element_" + y.id + "_3";
                                                                                                                                                                                var d = '<span><input id="' + t + '" name="' + t + '" class="element text" size="3" maxlength="3" value="" type="text" /> -<label for="' + t + '">###</label></span><span><input id="' + s + '" name="' + s + '" class="element text" size="3" maxlength="3" value="" type="text" /> -<label for="' + s + '">###</label></span><span><input id="' + p + '" name="' + p + '" class="element text" size="4" maxlength="4" value="" type="text" /><label for="' + p + '">####</label></span>';
                                                                                                                                                                                $("#" + active_element + " > div").remove();
                                                                                                                                                                                $("#" + active_element).append(d);
                                                                                                                                                                                y.default_value = "";
                                                                                                                                                                                $("#element_default_phone1").val("");
                                                                                                                                                                                $("#element_default_phone2").val("");
                                                                                                                                                                                $("#element_default_phone3").val("");
                                                                                                                                                                                $("#prop_default_value").hide();
                                                                                                                                                                                $("#prop_default_phone").show()
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                        y.type = w
                                                                                                                                                                    } else {
                                                                                                                                                                        if (B == "element_time_showsecond") {
                                                                                                                                                                            if (w == 1) {
                                                                                                                                                                                var H = '<span><input type="text" size="2" class="text" readonly="readonly"> : <label>MM</label></span><span><input type="text" size="2" class="text" readonly="readonly"><label>SS</label></span>';
                                                                                                                                                                                $("#" + active_element + " > span").first().next().replaceWith(H)
                                                                                                                                                                            } else {
                                                                                                                                                                                var G = '<span><input type="text" size="2" class="text" readonly="readonly"><label>MM</label></span>';
                                                                                                                                                                                $("#" + active_element + " > span").first().next().next().remove().end().prev().next().replaceWith(G)
                                                                                                                                                                            }
                                                                                                                                                                            y.time_showsecond = w
                                                                                                                                                                        } else {
                                                                                                                                                                            if (B == "element_time_24hour") {
                                                                                                                                                                                if (w == 1) {
                                                                                                                                                                                    $("#" + active_element + " > span").last().remove()
                                                                                                                                                                                } else {
                                                                                                                                                                                    var O = '<span><select name="element_' + y.id + '_4" id="element_' + y.id + '_4" style="width: 4em;" class="element select"><option value="AM">AM</option><option value="PM">PM</option></select><label>AM/PM</label></span>';
                                                                                                                                                                                    $("#" + active_element).append(O)
                                                                                                                                                                                }
                                                                                                                                                                                y.time_24hour = w
                                                                                                                                                                            } else {
                                                                                                                                                                                if (B == "submit_use_image") {
                                                                                                                                                                                    $("#" + active_element + " input").removeClass("hide");
                                                                                                                                                                                    if (w == 1) {
                                                                                                                                                                                        $("#" + active_element + " input.btn_submit").addClass("hide");
                                                                                                                                                                                        if (y.submit_primary_img == "" || y.submit_primary_img == null) {
                                                                                                                                                                                            $("#submit_primary_img").val("http://")
                                                                                                                                                                                        } else {
                                                                                                                                                                                            $("#submit_primary_img").val(y.submit_primary_img)
                                                                                                                                                                                        }
                                                                                                                                                                                        if (y.submit_secondary_img == "" || y.submit_secondary_img == null) {
                                                                                                                                                                                            $("#submit_secondary_img").val("http://")
                                                                                                                                                                                        } else {
                                                                                                                                                                                            $("#submit_secondary_img").val(y.submit_secondary_img)
                                                                                                                                                                                        }
                                                                                                                                                                                        if ($("#" + active_element).hasClass("firstpage")) {
                                                                                                                                                                                            $("#lbl_submit_secondary_img").hide();
                                                                                                                                                                                            $("#submit_secondary_img").hide()
                                                                                                                                                                                        } else {
                                                                                                                                                                                            $("#lbl_submit_secondary_img").show();
                                                                                                                                                                                            $("#submit_secondary_img").show()
                                                                                                                                                                                        }
                                                                                                                                                                                        $("#div_submit_use_text").hide();
                                                                                                                                                                                        $("#div_submit_use_image").show()
                                                                                                                                                                                    } else {
                                                                                                                                                                                        $("#" + active_element + " input.img_submit").addClass("hide");
                                                                                                                                                                                        $("#submit_primary_text").val(y.submit_primary_text);
                                                                                                                                                                                        $("#submit_secondary_text").val(y.submit_secondary_text);
                                                                                                                                                                                        if ($("#" + active_element).hasClass("firstpage")) {
                                                                                                                                                                                            $("#lbl_submit_secondary_text").hide();
                                                                                                                                                                                            $("#submit_secondary_text").hide()
                                                                                                                                                                                        } else {
                                                                                                                                                                                            $("#lbl_submit_secondary_text").show();
                                                                                                                                                                                            $("#submit_secondary_text").show()
                                                                                                                                                                                        }
                                                                                                                                                                                        $("#div_submit_use_image").hide();
                                                                                                                                                                                        $("#div_submit_use_text").show()
                                                                                                                                                                                    }
                                                                                                                                                                                    y.submit_use_image = w
                                                                                                                                                                                } else {
                                                                                                                                                                                    if (B == "submit_primary_text") {
                                                                                                                                                                                        $("#btn_submit_" + y.id).val(w);
                                                                                                                                                                                        y.submit_primary_text = w
                                                                                                                                                                                    } else {
                                                                                                                                                                                        if (B == "submit_secondary_text") {
                                                                                                                                                                                            $("#btn_prev_" + y.id).val(w);
                                                                                                                                                                                            y.submit_secondary_text = w
                                                                                                                                                                                        } else {
                                                                                                                                                                                            if (B == "submit_primary_img") {
                                                                                                                                                                                                $("#img_submit_" + y.id).attr("src", w);
                                                                                                                                                                                                y.submit_primary_img = w
                                                                                                                                                                                            } else {
                                                                                                                                                                                                if (B == "submit_secondary_img") {
                                                                                                                                                                                                    $("#img_prev_" + y.id).attr("src", w);
                                                                                                                                                                                                    y.submit_secondary_img = w
                                                                                                                                                                                                } else {
                                                                                                                                                                                                    if (B == "element_matrix_allow_multiselect") {
                                                                                                                                                                                                        var i = "";
                                                                                                                                                                                                        var b = "";
                                                                                                                                                                                                        if (w == 1) {
                                                                                                                                                                                                            i = "checkbox";
                                                                                                                                                                                                            b = "radio"
                                                                                                                                                                                                        } else {
                                                                                                                                                                                                            i = "radio";
                                                                                                                                                                                                            b = "checkbox"
                                                                                                                                                                                                        }
                                                                                                                                                                                                        var m = "";
                                                                                                                                                                                                        var v = "";
                                                                                                                                                                                                        var J = "";
                                                                                                                                                                                                        $("#" + active_element + " table tbody").find("tr").each(function() {
                                                                                                                                                                                                            $(this).find("td input[type=" + b + "]").each(function() {
                                                                                                                                                                                                                m = $(this).attr("id");
                                                                                                                                                                                                                v = $(this).attr("name");
                                                                                                                                                                                                                J = $(this).val();
                                                                                                                                                                                                                $(this).replaceWith($('<input type="' + i + '" id="' + m + '" name="' + v + '" value="' + J + '" />'))
                                                                                                                                                                                                            })
                                                                                                                                                                                                        });
                                                                                                                                                                                                        y.matrix_allow_multiselect = w
                                                                                                                                                                                                    } else {
                                                                                                                                                                                                        if (B == "element_address_hideline2") {
                                                                                                                                                                                                            if (w == 1) {
                                                                                                                                                                                                                $("#" + active_element + "_span_2").slideUp()
                                                                                                                                                                                                            } else {
                                                                                                                                                                                                                $("#" + active_element + "_span_2").slideDown()
                                                                                                                                                                                                            }
                                                                                                                                                                                                            y.address_hideline2 = w
                                                                                                                                                                                                        } else {
                                                                                                                                                                                                            if (B == "element_address_us_only") {
                                                                                                                                                                                                                if (w == 1) {
                                                                                                                                                                                                                    $("#element_" + y.id + "_6").val("United States").prop("disabled", true);
                                                                                                                                                                                                                    $("#element_countries").val("United States").prop("disabled", true);
                                                                                                                                                                                                                    var f = '<select class="element select large" id="element_' + y.id + '_4" name="element_' + y.id + '_4"><option value="">Select a State</option><option value="Alabama" >Alabama</option><option value="Alaska" >Alaska</option><option value="Arizona" >Arizona</option><option value="Arkansas" >Arkansas</option><option value="California" >California</option><option value="Colorado" >Colorado</option><option value="Connecticut" >Connecticut</option><option value="Delaware" >Delaware</option><option value="Delaware" >District of Columbia</option><option value="Florida" >Florida</option><option value="Georgia" >Georgia</option><option value="Hawaii" >Hawaii</option><option value="Idaho" >Idaho</option><option value="Illinois" >Illinois</option><option value="Indiana" >Indiana</option><option value="Iowa" >Iowa</option><option value="Kansas" >Kansas</option><option value="Kentucky" >Kentucky</option><option value="Louisiana" >Louisiana</option><option value="Maine" >Maine</option><option value="Maryland" >Maryland</option><option value="Massachusetts" >Massachusetts</option><option value="Michigan" >Michigan</option><option value="Minnesota" >Minnesota</option><option value="Mississippi" >Mississippi</option><option value="Missouri" >Missouri</option><option value="Montana" >Montana</option><option value="Nebraska" >Nebraska</option><option value="Nevada" >Nevada</option><option value="New Hampshire" >New Hampshire</option><option value="New Jersey" >New Jersey</option><option value="New Mexico" >New Mexico</option><option value="New York" >New York</option><option value="North Carolina" >North Carolina</option><option value="North Dakota" >North Dakota</option><option value="Ohio" >Ohio</option><option value="Oklahoma" >Oklahoma</option><option value="Oregon" >Oregon</option><option value="Pennsylvania" >Pennsylvania</option><option value="Rhode Island" >Rhode Island</option><option value="South Carolina" >South Carolina</option><option value="South Dakota" >South Dakota</option><option value="Tennessee" >Tennessee</option><option value="Texas" >Texas</option><option value="Utah" >Utah</option><option value="Vermont" >Vermont</option><option value="Virginia" >Virginia</option><option value="Washington" >Washington</option><option value="West Virginia" >West Virginia</option><option value="Wisconsin" >Wisconsin</option><option value="Wyoming" >Wyoming</option></select>';
                                                                                                                                                                                                                    $("#element_" + y.id + "_4").replaceWith(f)
                                                                                                                                                                                                                } else {
                                                                                                                                                                                                                    $("#element_" + y.id + "_6").val("United States").prop("disabled", false);
                                                                                                                                                                                                                    $("#element_countries").val("United States").prop("disabled", false);
                                                                                                                                                                                                                    var a = '<input type="text" value="" class="element text large" name="element_' + y.id + '_4" id="element_' + y.id + '_4">';
                                                                                                                                                                                                                    $("#element_" + y.id + "_4").replaceWith(a)
                                                                                                                                                                                                                }
                                                                                                                                                                                                                y.address_us_only = w;
                                                                                                                                                                                                                y.default_value = "United States"
                                                                                                                                                                                                            }
                                                                                                                                                                                                        }
                                                                                                                                                                                                    }
                                                                                                                                                                                                }
                                                                                                                                                                                            }
                                                                                                                                                                                        }
                                                                                                                                                                                    }
                                                                                                                                                                                }
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                    }
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function add_element(a) {
    var c = $("#form_header").data("form_properties").id;
    if ($("#li_dummy").length) {
        $("#li_dummy").remove();
        $("#no_fields_notice").remove()
    }
    var b = $("#form_builder_sortable > li").not(".li_pagination").size() + 1;
    var d = b;
    if ($("#li_lastpage").length == 0) {
        $('<li id="li_temp_' + d + '" class="click_processing"><img src="/GIedu/Public/plugins/forms/images/loader_small.gif" style="vertical-align: middle"/> creating field ...</li>').appendTo("#form_builder_sortable").hide().fadeIn()
    } else {
        $('<li id="li_temp_' + d + '" class="click_processing"><img src="/GIedu/Public/plugins/forms/images/loader_small.gif" style="vertical-align: middle"/> creating field ...</li>').insertBefore("#li_lastpage").hide().fadeIn()
    }
    $.ajax({
        type: "POST",
        async: true,
        url: "add_field.php",
        data: {
            element_type: a,
            form_id: c,
            holder_id: "li_temp_" + d,
            position: b,
            action: "click_new"
        },
        cache: false,
        global: true,
        dataType: "json",
        error: function(h, f, g) {
            $("#form_builder_sortable .click_processing").remove()
        },
        success: function(f) {
            if (f.status == "ok") {
                var e = $(f.markup);
                e.data("field_properties", f.field_properties).addClass("synched");
                $("#" + f.holder_id).replaceWith(e);
                $("#li_" + f.element_id).hide().fadeIn();
                reorganize_page_break();
                $("#form_builder_sortable").sortable("refreshPositions")
            } else {
                $("#dialog-message").dialog("open");
                $("#form_builder_sortable .click_processing").remove()
            }
        }
    })
}

function add_matrix_row(d) {
    var h = $("#form_header").data("form_properties").id;
    var j = $("#" + active_element);
    var f = $("#form_builder_sortable > li").not(".li_pagination").size() + 1;
    var a = f + $("#form_builder_sortable li.matrix table tr").length;
    var e = d.attr("id").split("_");
    var b = e[1];
    var i = $("#" + active_element + " table th").length;
    var g = '<tr id="mr_temp_' + a + '" class="matrix_row_processing"><td colspan="' + i + '"><img src="/GIedu/Public/plugins/forms/images/loader_small.gif" style="vertical-align: middle"/> creating new row ...</td></tr>';
    var k = $("#element_matrix_row li").index(d.parent()) + 1;
    $("#" + active_element + " table tr:eq(" + k + ")").after(g);
    var c = '<li id="li_mr_temp_' + a + '" class="li_mr_temp_holder"><input type="text" disabled="disabled" value="creating new row ..." autocomplete="off" class="text" id="matrixrow_' + a + '" /> <img class="add_choice" title="Add" alt="Add" src="/GIedu/Public/plugins/forms/images/icons/add.png" style="vertical-align: middle" id="matrixrowadd_' + a + '"><img class="del_choice" title="Delete" alt="Delete" src="/GIedu/Public/plugins/forms/images/icons/delete.png" style="vertical-align: middle" id="matrixrowdel_' + a + '"></li>';
    d.parent().after(c);
    $.ajax({
        type: "POST",
        async: true,
        url: "add_matrix_row.php",
        data: {
            form_id: h,
            row_holder_id: "mr_temp_" + a,
            prop_holder_id: "li_mr_temp_" + a,
            allow_multiselect: j.data("field_properties").matrix_allow_multiselect,
            matrix_parent_id: j.data("field_properties").id,
            position: k + 1,
            column_data: j.data("field_properties").options[j.data("field_properties").id].column_data,
            total_column: i - 1
        },
        cache: false,
        global: true,
        dataType: "json",
        error: function(n, l, m) {
            $("#mr_temp_" + a).remove();
            $("#li_mr_temp_" + a).remove()
        },
        success: function(o) {
            if (o.status == "ok") {
                var m = o.element_id;
                var l = j.data("field_properties").options;
                l[m] = o.new_row_data;
                j.data("field_properties").options = l;
                $("#" + o.row_holder_id).replaceWith(o.new_row_markup);
                $("#" + o.prop_holder_id).replaceWith(o.new_prop_markup);
                $("#matrixrow_" + m).focus();
                var n = $("#matrixrow_" + m).parent().nextAll().children().filter("input.text");
                $.each(n,
                function(p, r) {
                    var q = null;
                    q = $(r).attr("id").split("_");
                    j.data("field_properties").options[q[1]].position++
                })
            } else {
                $("#dialog-message").dialog("open");
                $("#mr_temp_" + a).remove();
                $("#li_mr_temp_" + a).remove()
            }
        }
    })
}

function delete_matrix_row(g) {
    var f = g.attr("id").split("_");
    var a = f[1];
    var b = $("#" + active_element);
    var c = $("#form_header").data("form_properties").id;
    if ($("#element_matrix_row > li").size() <= 1) {
        $("#ui-dialog-title-dialog-warning").html("Unable to delete this row!");
        $("#dialog-warning-msg").html("You cannot delete all rows! <br />At least 1 row is required.");
        $("#dialog-warning").dialog("open");
        return false
    }
    var e = $("#" + active_element + " table th").length;
    var d = $("#mr_" + a).html();
    $("#mr_" + a).addClass("matrix_row_processing").html('<td colspan="' + e + '"><img src="/GIedu/Public/plugins/forms/images/loader_small.gif" style="vertical-align: middle"/> deleting row ...</td>');
    $("#matrixrow_" + a).prop("disabled", true);
    $("#matrixrowadd_" + a).fadeOut("fast");
    $("#matrixrowdel_" + a).fadeOut("fast");
    $.ajax({
        type: "POST",
        async: true,
        url: "delete_matrix_row.php",
        data: {
            form_id: c,
            element_id: a
        },
        cache: false,
        global: true,
        dataType: "json",
        error: function(j, h, i) {
            $("#mr_" + a).removeClass("matrix_row_processing").html(d);
            $("#matrixrow_" + a).prop("disabled", false);
            $("#matrixrowadd_" + a).show();
            $("#matrixrowdel_" + a).show()
        },
        success: function(l) {
            if (l.status == "ok") {
                var i = l.element_id;
                var j = $("#" + active_element);
                var h = j.data("field_properties").options;
                delete h[i];
                j.data("field_properties").options = h;
                var k = $("#matrixrow_" + i).parent().nextAll().children().filter("input.text");
                $.each(k,
                function(m, o) {
                    var n = null;
                    n = $(o).attr("id").split("_");
                    j.data("field_properties").options[n[1]].position--
                });
                $("#matrixrow_" + i).parent().fadeOut("normal",
            function() {
                    $(this).remove()
                });
                $("#mr_" + i).fadeOut("normal",
            function() {
                    $(this).remove();
                    if ($("#" + active_element + " tbody tr:gt(0)").length > 0) {
                        var n = $("#" + active_element + " tbody tr:gt(0)");
                        var m = new Array();
                        n.each(function(p) {
                            var q = null;
                            q = $(this).attr("id").split("_");
                            m[p] = q[1]
                        });
                        var o = m.join(",");
                        j.data("field_properties").constraint = o
                    } else {
                        j.data("field_properties").constraint = ""
                    }
                })
            } else {
                $("#dialog-message").dialog("open");
                $("#mr_" + i).removeClass("matrix_row_processing").html(d);
                $("#matrixrow_" + i).prop("disabled", false);
                $("#matrixrowadd_" + i).show();
                $("#matrixrowdel_" + i).show()
            }
        }
    })
}

function add_matrix_column(a) {
    var h = a.attr("id").split("_");
    var m = h[1];
    var q = $("#" + active_element);
    var c = q.data("field_properties").id;
    var l = parseInt(q.data("field_properties").last_option_id) + 1;
    q.data("field_properties").last_option_id = l;
    var k = $("#mc_" + c + "_" + m).index();
    $("#mc_" + c + "_" + m).after('<th scope="col" id="mc_' + c + "_" + l + '">&nbsp;</th>');
    var n = "";
    if (q.data("field_properties").matrix_allow_multiselect == 1) {
        n = "checkbox"
    } else {
        n = "radio"
    }
    var p = new Array();
    var d = "";
    $("#" + active_element + " table tbody").find("tr").each(function() {
        p = $(this).attr("id").split("_");
        d = p[1];
        $(this).find("td").eq(k).after('<td><input type="' + n + '" value="' + l + '" name="element_' + d + '" id="element_' + d + "_" + l + '"></td>')
    });
    var i = $("#" + active_element + " table th").length;
    var o = 100 / i;
    var e = 2 * o;
    e = Math.round(e);
    var g = (100 - e) / (i - 1);
    g = Math.round(g);
    $("#" + active_element + " table th:eq(0)").css("width", e + "%");
    $("#" + active_element + " table th:gt(0)").css("width", g + "%");
    var f = '<li><input type="text" value="" autocomplete="off" class="text" id="matrixcol_' + l + '" /> <img class="add_choice" title="Add" alt="Add" src="/GIedu/Public/plugins/forms/images/icons/add.png" style="vertical-align: middle" id="matrixcoladd_' + l + '"><img class="del_choice" title="Delete" alt="Delete" src="/GIedu/Public/plugins/forms/images/icons/delete.png" style="vertical-align: middle" id="matrixcoldel_' + l + '"></li>';
    a.parent().after(f);
    $("#matrixcol_" + l).focus();
    var j = q.data("field_properties").options[c].column_data;
    var b = k + 1;
    j[l] = {
        column_title: "",
        is_db_live: 0,
        position: b
    };
    q.data("field_properties").options[c].column_data = j;
    var r = $("#matrixcol_" + l).parent().nextAll().children().filter("input.text");
    $.each(r,
    function(s, u) {
        var t = null;
        t = $(u).attr("id").split("_");
        q.data("field_properties").options[c].column_data[t[1]].position++
    })
}

function delete_matrix_column(h) {
    var g = h.attr("id").split("_");
    var e = g[1];
    var c = $("#" + active_element);
    var a = c.data("field_properties").id;
    if ($("#element_matrix_column > li").size() <= 1) {
        $("#ui-dialog-title-dialog-warning").html("Unable to delete this column!");
        $("#dialog-warning-msg").html("You cannot delete all columns! <br />At least 1 column is required.");
        $("#dialog-warning").dialog("open");
        return false
    }
    var d = c.data("field_properties").options[a].column_data;
    delete d[e];
    c.data("field_properties").options[a].column_data = d;
    var f = $("#matrixcol_" + e).parent().nextAll().children().filter("input.text");
    $.each(f,
    function(i, k) {
        var j = null;
        j = $(k).attr("id").split("_");
        c.data("field_properties").options[a].column_data[j[1]].position--
    });
    $("#matrixcol_" + e).parent().remove();
    var b = $("#mc_" + a + "_" + e).index();
    $("#mc_" + a + "_" + e).remove();
    $("#" + active_element + " table tbody").find("tr").each(function() {
        $(this).find("td").eq(b).remove()
    })
}

function set_form_properties(l, a) {
    var d = $("#form_header").data("form_properties");
    if (l == "form_title") {
        $("#form_header_title").html(a.replace(/\n/g, "<br />"));
        d.name = a
    } else {
        if (l == "form_description") {
            $("#form_header_desc").html(a.replace(/\n/g, "<br />"));
            d.description = a
        } else {
            if (l == "form_review_title") {
                d.review_title = a
            } else {
                if (l == "form_review_description") {
                    d.review_description = a
                } else {
                    if (l == "form_label_alignment") {
                        $("#form_builder_sortable > li").not(".li_pagination").css("width", "");
                        $("#form_builder_preview").removeClass("top_label right_label left_label").addClass(a);
                        d.label_alignment = a
                    } else {
                        if (l == "form_language") {
                            d.language = a
                        } else {
                            if (l == "form_redirect_enable") {
                                if (a == 1) {
                                    $("#form_success_message").hide();
                                    $("#form_redirect_url").show().focus().select()
                                } else {
                                    $("#form_success_message").show().focus().select();
                                    $("#form_redirect_url").hide()
                                }
                                d.redirect_enable = a
                            } else {
                                if (l == "form_review_use_image") {
                                    if (a == 1) {
                                        $("#div_review_use_image").show();
                                        $("#div_review_use_text").hide()
                                    } else {
                                        $("#div_review_use_image").hide();
                                        $("#div_review_use_text").show()
                                    }
                                    d.review_use_image = a
                                } else {
                                    if (l == "form_success_message") {
                                        d.success_message = a
                                    } else {
                                        if (l == "form_redirect") {
                                            d.redirect = a
                                        } else {
                                            if (l == "form_custom_script_url") {
                                                d.custom_script_url = a
                                            } else {
                                                if (l == "form_review") {
                                                    d.review = a;
                                                    if (($("#li_lastpage").length == 1) && (a == 1)) {
                                                        if ($("#li_lastpage").data("field_properties").submit_primary_text == "Submit") {
                                                            $("#li_lastpage").data("field_properties").submit_primary_text = "Continue";
                                                            $("#btn_submit_lastpage").val("Continue")
                                                        }
                                                    } else {
                                                        if (($("#li_lastpage").length == 1) && (a == 0)) {
                                                            if ($("#li_lastpage").data("field_properties").submit_primary_text == "Continue") {
                                                                $("#li_lastpage").data("field_properties").submit_primary_text = "Submit";
                                                                $("#btn_submit_lastpage").val("Submit")
                                                            }
                                                        }
                                                    }
                                                    if (a == 1) {
                                                        $("#form_prop_review").slideDown("slow",
                                                    function() {
                                                            adjust_main_height();
                                                            $("#form_prop_review").show()
                                                        })
                                                    } else {
                                                        $("#form_prop_review").slideUp("slow",
                                                    function() {
                                                            adjust_main_height()
                                                        })
                                                    }
                                                } else {
                                                    if (l == "review_primary_text") {
                                                        d.review_primary_text = a
                                                    } else {
                                                        if (l == "review_primary_img") {
                                                            d.review_primary_img = a
                                                        } else {
                                                            if (l == "review_secondary_text") {
                                                                d.review_secondary_text = a
                                                            } else {
                                                                if (l == "review_secondary_img") {
                                                                    d.review_secondary_img = a
                                                                } else {
                                                                    if (l == "form_resume_enable") {
                                                                        d.resume_enable = a
                                                                    } else {
                                                                        if (l == "form_password") {
                                                                            d.password = a
                                                                        } else {
                                                                            if (l == "form_limit") {
                                                                                d.limit = parseInt(a)
                                                                            } else {
                                                                                if (l == "form_pagination_type") {
                                                                                    var j = $("#form_builder_sortable > li.page_break");
                                                                                    var e = j.length;
                                                                                    var g = 1;
                                                                                    var b = "";
                                                                                    var k = "";
                                                                                    var f = "";
                                                                                    j.each(function(m) {
                                                                                        var n = $(this);
                                                                                        g = m + 1;
                                                                                        if (n.attr("id") != "li_lastpage") {
                                                                                            var o = n.data("field_properties").id;
                                                                                            $("#pagenum_" + o).text(g);
                                                                                            $("#pagetotal_" + o).text("Page " + g + " of " + e);
                                                                                            if (g == 1) {
                                                                                                k = " ap_tp_num_active";
                                                                                                f = " ap_tp_text_active"
                                                                                            } else {
                                                                                                k = "";
                                                                                                f = ""
                                                                                            }
                                                                                            if (a == "steps") {
                                                                                                b += '<td align="center"><span id="page_num_' + g + '" class="ap_tp_num' + k + '">' + g + '</span><span id="page_title_' + g + '" class="ap_tp_text' + f + '">' + n.data("field_properties").page_title + '</span></td><td align="center" class="ap_tp_arrow">&gt;</td>'
                                                                                            }
                                                                                        } else {
                                                                                            $("#pagenum_lastpage").text(g);
                                                                                            $("#pagetotal_lastpage").text("Page " + g + " of " + e);
                                                                                            b += '<td align="center"><span id="page_num_' + g + '" class="ap_tp_num">' + g + '</span><span id="page_title_' + g + '" class="ap_tp_text">' + n.data("field_properties").page_title + "</span></td>"
                                                                                        }
                                                                                    });
                                                                                    $("#pagination_header").children().remove();
                                                                                    if (a == "steps") {
                                                                                        var i = '<table class="ap_table_pagination" width="100%" border="0" cellspacing="0" cellpadding="0"><tr>' + b + "</tr></table>";
                                                                                        $("#pagination_header").append(i)
                                                                                    } else {
                                                                                        if (a == "percentage") {
                                                                                            var h = '<h3 id="page_title_1">Page 1 of 1 - Page Title</h3><div class="mf_progress_container"><div id="mf_progress_percentage" class="mf_progress_value" style="width: 1%"><span>1%</span></div></div>';
                                                                                            $("#pagination_header").append(h);
                                                                                            $("#page_title_1").html("Page 1 of " + e + " - " + j.eq(0).data("field_properties").page_title);
                                                                                            var c = Math.round((1 / e) * 100);
                                                                                            $("#mf_progress_percentage > span").html(c + "%");
                                                                                            $("#mf_progress_percentage").animate({
                                                                                                width: c + "%"
                                                                                            },
                                                                                            {
                                                                                                duration: 200,
                                                                                                queue: false
                                                                                            })
                                                                                        } else {
                                                                                            $("#pagination_header").append('<h3 class="no_header">Pagination Header Disabled</h3>')
                                                                                        }
                                                                                    }
                                                                                    if (a == "disabled") {
                                                                                        $("#prop_pagination_style legend").css({
                                                                                            "background-color": "#DC6666",
                                                                                            "border-color": "#DC6666"
                                                                                        });
                                                                                        $("#prop_pagination_style fieldset").css("border-color", "#DC6666");
                                                                                        $("#prop_pagination_titles").fadeOut("slow")
                                                                                    } else {
                                                                                        $("#prop_pagination_style legend").css({
                                                                                            "background-color": "#3D6C10",
                                                                                            "border-color": "#3D6C10"
                                                                                        });
                                                                                        $("#prop_pagination_style fieldset").css("border-color", "#3D6C10");
                                                                                        if (d.pagination_type == "disabled") {
                                                                                            $("#prop_pagination_titles").slideDown()
                                                                                        }
                                                                                    }
                                                                                    d.pagination_type = a
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function adjust_main_height() {
    var d = 75;
    if ($.browser.msie) {
        d = -10
    }
    var b = ($("#sidebar").offset().top + $("#sidebar").outerHeight()) - d;
    var c = $("#header").outerHeight() + $("#navigation").outerHeight() + $("#content").outerHeight();
    if (b > c) {
        var a = (b - c);
        $("#main").animate({
            "padding-bottom": a + "px"
        },
        {
            duration: 200,
            queue: true
        })
    }
}
function update_date_range_min_linked(b) {
    $("#date_range_min_mm").val(b.length ? b[0].getMonth() + 1 : "");
    $("#date_range_min_dd").val(b.length ? b[0].getDate() : "");
    $("#date_range_min_yyyy").val(b.length ? b[0].getFullYear() : "");
    var a = $("#date_range_min_yyyy").val() + "-" + $("#date_range_min_mm").val() + "-" + $("#date_range_min_dd").val();
    set_properties("element_date_range_min", a)
}
function update_date_range_max_linked(b) {
    $("#date_range_max_mm").val(b.length ? b[0].getMonth() + 1 : "");
    $("#date_range_max_dd").val(b.length ? b[0].getDate() : "");
    $("#date_range_max_yyyy").val(b.length ? b[0].getFullYear() : "");
    var a = $("#date_range_max_yyyy").val() + "-" + $("#date_range_max_mm").val() + "-" + $("#date_range_max_dd").val();
    set_properties("element_date_range_max", a)
}
function update_scheduling_start_linked(b) {
    $("#scheduling_start_mm").val(b.length ? b[0].getMonth() + 1 : "");
    $("#scheduling_start_dd").val(b.length ? b[0].getDate() : "");
    $("#scheduling_start_yyyy").val(b.length ? b[0].getFullYear() : "");
    var a = $("#scheduling_start_yyyy").val() + "-" + $("#scheduling_start_mm").val() + "-" + $("#scheduling_start_dd").val();
    $("#form_header").data("form_properties").schedule_start_date = a
}
function update_scheduling_end_linked(b) {
    $("#scheduling_end_mm").val(b.length ? b[0].getMonth() + 1 : "");
    $("#scheduling_end_dd").val(b.length ? b[0].getDate() : "");
    $("#scheduling_end_yyyy").val(b.length ? b[0].getFullYear() : "");
    var a = $("#scheduling_end_yyyy").val() + "-" + $("#scheduling_end_mm").val() + "-" + $("#scheduling_end_dd").val();
    $("#form_header").data("form_properties").schedule_end_date = a
}
function reorganize_page_break() {
    var i = $("#form_builder_sortable > li.page_break");
    var d = $("#form_header").data("form_properties").pagination_type;
    var h = '<li class="no_fields_in_page" title="Drag the button on the right side here to add new field."><span style="float: none;font-family: machform;margin-bottom: 20px;color: #529214;font-size: 50px;display: block" class="icon-arrow-right"></span><h3>This page has no fields!</h3><p><span style="color: #529214; font-weight: bold; float: none">Drag the button</span> on the right sidebar here to add new field.</p></li>';
    if (i.not("#li_lastpage").length >= 1) {
        if ($("#li_lastpage").length == 1) {
            $("#li_lastpage").appendTo("#form_builder_sortable")
        }
        if (i.not("#li_lastpage").length == 1) {
            if ($("#pagination_header").length == 0) {
                var c = '<li id="pagination_header" style="display: none" class="li_pagination" title="Click to edit"><table class="ap_table_pagination" width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td align="center"><span id="page_num_1" class="ap_tp_num ap_tp_num_active">1</span><span id="page_title_1" class="ap_tp_text ap_tp_text_active">Untitled Page</span></td><td align="center" class="ap_tp_arrow">&gt;</td><td align="center"><span id="page_num_2" class="ap_tp_num">2</span><span id="page_title_2" class="ap_tp_text">Untitled Page</span></td></tr></table></li>';
                $("#form_builder_sortable").prepend(c);
                $("#pagination_header").fadeIn();
                $("#pagination_header").click(function(k) {
                    $("#form_header").data("coming_from_click", 1);
                    var l = $(this).attr("id");
                    select_form_header(l)
                })
            } else {
                if (d == "steps") {
                    $("#pagination_header td:gt(2)").remove();
                    $("#page_num_1").html("1");
                    $("#page_num_2").html("2");
                    $("#page_title_1").html($("#form_builder_sortable > li.page_break").not(".li_pagination").not("#li_lastpage").data("field_properties").page_title);
                    $("#page_title_2").html($("#li_lastpage").data("field_properties").page_title)
                } else {
                    if (d == "percentage") {
                        $("#page_title_1").html("Page 1 of 2 - " + $("#form_builder_sortable > li.page_break").not(".li_pagination").not("#li_lastpage").data("field_properties").page_title);
                        $("#mf_progress_percentage").animate({
                            width: "50%"
                        },
                        {
                            duration: 200,
                            queue: false
                        });
                        $("#mf_progress_percentage > span").html("50%")
                    }
                }
            }
            if ($("#li_lastpage").length == 0) {
                $('<li id="li_lastpage" class="page_break" title="Click to edit">' + i.html().replace(/_[0-9]+/g, "_lastpage") + "</li>").appendTo("#form_builder_sortable").addClass("synched");
                $("#pagenum_lastpage").text("2");
                $("#pagetotal_lastpage").text("Page 2 of 2");
                $("#btn_submit_lastpage").val("Submit");
                if ($("#li_lastpage").prev().hasClass("page_break")) {
                    $("#li_lastpage").before(h)
                }
                $("#li_lastpage").data("field_properties", {
                    id: "lastpage",
                    type: "page_break",
                    page_title: "Untitled Page",
                    submit_primary_text: "Submit",
                    submit_secondary_text: "Previous"
                })
            } else {
                var e = 2;
                $("#form_builder_sortable > li.page_break").each(function(l) {
                    var k = l + 1;
                    if ($(this).attr("id") != "li_lastpage") {
                        var m = $(this).data("field_properties").id;
                        $("#pagenum_" + m).text(k);
                        $("#pagetotal_" + m).text("Page " + k + " of " + e)
                    } else {
                        $("#pagenum_lastpage").text(k);
                        $("#pagetotal_lastpage").text("Page " + k + " of " + e)
                    }
                })
            }
            if (i.index() == 1) {
                if ($("#form_builder_sortable > li").not(".li_pagination").not(".page_break").not(".li_lastpage").length == 0) {
                    i.before(h);
                    i.after(h)
                } else {
                    i.before(h)
                }
            }
        } else {
            var e = i.length;
            var g = 1;
            var a = "";
            var j = "";
            var f = "";
            if (d == "steps") {
                $("#pagination_header td").remove()
            }
            i.each(function(k) {
                var l = $(this);
                if (l.index() == 1) {
                    l.before(h)
                }
                if (l.prev().hasClass("page_break")) {
                    l.before(h)
                }
                if (l.next().hasClass("page_break")) {
                    l.after(h)
                }
                g = k + 1;
                if (l.attr("id") != "li_lastpage") {
                    var m = l.data("field_properties").id;
                    $("#pagenum_" + m).text(g);
                    $("#pagetotal_" + m).text("Page " + g + " of " + e);
                    if (g == 1) {
                        j = " ap_tp_num_active";
                        f = " ap_tp_text_active"
                    } else {
                        j = "";
                        f = ""
                    }
                    if (d == "steps") {
                        a += '<td align="center"><span id="page_num_' + g + '" class="ap_tp_num' + j + '">' + g + '</span><span id="page_title_' + g + '" class="ap_tp_text' + f + '">' + l.data("field_properties").page_title + '</span></td><td align="center" class="ap_tp_arrow">&gt;</td>'
                    }
                } else {
                    $("#pagenum_lastpage").text(g);
                    $("#pagetotal_lastpage").text("Page " + g + " of " + e);
                    a += '<td align="center"><span id="page_num_' + g + '" class="ap_tp_num">' + g + '</span><span id="page_title_' + g + '" class="ap_tp_text">' + l.data("field_properties").page_title + "</span></td>"
                }
            });
            if (d == "steps") {
                $("#pagination_header tr").append(a)
            } else {
                if (d == "percentage") {
                    $("#page_title_1").html("Page 1 of " + e + " - " + i.eq(0).data("field_properties").page_title);
                    var b = Math.round((1 / e) * 100);
                    $("#mf_progress_percentage").animate({
                        width: b + "%"
                    },
                    {
                        duration: 200,
                        queue: false
                    });
                    $("#mf_progress_percentage > span").html(b + "%")
                }
            }
        }
        $("#form_builder_sortable > li.no_fields_in_page").each(function(l) {
            var k = $(this);
            if (k.index() == 1) {
                if (k.next().hasClass("page_break") == false) {
                    k.remove()
                }
            } else {
                if (k.prev().hasClass("page_break") == false || k.next().hasClass("page_break") == false) {
                    k.remove()
                }
            }
        });
        $("#form_builder_sortable > li.firstpage").removeClass("firstpage");
        $("#form_builder_sortable > li.page_break:eq(0)").addClass("firstpage");
        $("#form_resume").prop("disabled", false)
    } else {
        $("#pagination_header").remove();
        $("#li_lastpage").remove();
        if ($("#form_builder_sortable > li").not(".no_fields_in_page").length > 0) {
            $("#form_builder_sortable > li.no_fields_in_page").remove()
        } else {
            $("#form_builder_sortable > li.no_fields_in_page").remove();
            $("#form_builder_sortable").append(h)
        }
        $("#form_header").data("form_properties").resume_enable = 0;
        $("#form_resume").prop("checked", false);
        $("#form_resume").prop("disabled", true)
    }
}
function rebuild_quantity_link_dropdown() {
    var b = $("#form_builder_sortable > li.multiple_choice,#form_builder_sortable > li.dropdown,#form_builder_sortable > li.checkboxes,#form_builder_sortable > li.price");
    var c = 0;
    var d = new Array();
    var a = new Array();
    b.each(function(f) {
        var h = null;
        var e = 0;
        h = $(this).data("field_properties");
        if ($("#pagination_header").length > 0) {
            e = h.position
        } else {
            e = parseInt(h.position) + 1
        }
        if (h.type == "checkbox") {
            var g = h.options;
            $.each(g,
            function(i, j) {
                d[c] = j.option + " (#" + e + ")";
                a[c] = "element_" + h.id + "_" + i;
                c++
            })
        } else {
            d[c] = h.title + " (#" + e + ")";
            a[c] = "element_" + h.id;
            c++
        }
    });
    $("#prop_number_quantity_link > option").remove();
    $("#prop_number_quantity_link").append('<option value="">-- Please Select --</option>');
    $.each(d,
    function(e, g) {
        var f = '<option value="' + a[e] + '">' + g + "</option>";
        $("#prop_number_quantity_link").append(f)
    });
    if (d.length == 0) {
        $("#prop_number_quantity_link > option").remove();
        $("#prop_number_quantity_link").append('<option value=""> -- No supported fields available --</option>')
    }
}


$(function() {
    $("#tab_field_properties").show();
    $("#tab_form_properties").show();
    $("#builder_tabs_btn").show();
    $("#builder_tabs").tabs();
    $("#builder_tabs").bind("tabsshow",function(c, d) {
        if (d.index === 0) {
            $("#" + active_element).removeClass("highlighted");
            active_element = null;
            $("#form_header .highlighted").removeClass("highlighted");
            $("#pagination_header").removeClass("highlighted");
            $("#selected_field_image").css("visibility", "hidden");
            $("#form_prop_toggle_a").text("show more options");
            $("#form_prop_toggle_img").attr("src", "/GIedu/Public/plugins/forms/images/icons/resultset_next.gif");
            $("#all_form_properties .advanced_prop").hide();
            $("#bottom_bar_field_action").fadeOut("fast",
        function() {
                $("#bottom_bar_content").animate({
                    "margin-left": "160px"
                },
                {
                    duration: 200,
                    queue: false
                })
            });
            check_synch_fields()
        } else {
            if (d.index === 1) {
                $("#form_header .highlighted").removeClass("highlighted");
                $("#pagination_header").removeClass("highlighted");
                $("#form_prop_toggle_a").text("show more options");
                $("#form_prop_toggle_img").attr("src", "/GIedu/Public/plugins/forms/images/icons/resultset_next.gif");
                $("#all_form_properties .advanced_prop").hide();
                if (active_element === null) {
                    $("#element_properties_form").hide();
                    $("#element_inactive_msg").show()
                }
            } else {
                if (d.index === 2) {
                    if ($("#form_header").data("coming_from_click") != 1) {
                        select_form_header("form_header_title")
                    }
                }
            }
        }
    });
    $("#form_builder_sortable").sortable({
        items: "li:not(.li_pagination,#li_lastpage)",
        axis: "y",
        opacity: 0.7,
        placeholder: "ui-state-highlight",
        scrollSensitivity: 100,
        scrollSpeed: 40,
        receive: function(g, i) {
            var e = $("#form_header").data("form_properties").id;
            if ($("#li_dummy").length) {
                $("#li_dummy").remove();
                $("#no_fields_notice").remove()
            }
            var h = $("#form_builder_sortable > li").not(".li_pagination").size() + 1;
            var f = $(i.sender).attr("id");
            $("#form_builder_sortable .ui-draggable").attr("id", "li_temp_" + h).removeClass("box ui-draggable").addClass("drop_processing").html('<img src="/GIedu/Public/plugins/forms/images/loader_small.gif" style="vertical-align: middle"/> creating field ...').hide().fadeIn();
            var d = $("#li_temp_" + h).index() + 1;
            var c;
            switch (f) {
            case "btn_single_line_text":
                c = "text";
                break;
            case "btn_number":
                c = "number";
                break;
            case "btn_paragraph_text":
                c = "textarea";
                break;
            case "btn_checkboxes":
                c = "checkbox";
                break;
            case "btn_multiple_choice":
                c = "radio";
                break;
            case "btn_drop_down":
                c = "select";
                break;
            case "btn_name":
                c = "simple_name";
                break;
            case "btn_date":
                c = "date";
                break;
            case "btn_time":
                c = "time";
                break;
            case "btn_phone":
                c = "phone";
                break;
            case "btn_address":
                c = "address";
                break;
            case "btn_website":
                c = "url";
                break;
            case "btn_price":
                c = "money";
                break;
            case "btn_email":
                c = "email";
                break;
            case "btn_section_break":
                c = "section";
                break;
            case "btn_file_upload":
                c = "file";
                break;
            case "btn_page_break":
                c = "page_break";
                break;
            case "btn_matrix":
                c = "matrix";
                break;
            case "btn_signature":
                c = "signature";
                break;
            default:
                c = "text";
                break
            }
            $.ajax({
                type: "POST",
                async: true,
                url: "add_field.php",
                data: {
                    element_type: c,
                    form_id: e,
                    holder_id: "li_temp_" + h,
                    position: d,
                    action: "drag_new"
                },
                cache: false,
                global: true,
                dataType: "json",
                error: function(l, j, k) {
                    $("#form_builder_sortable .drop_processing").remove()
                },
                success: function(k) {
                    if (k.status == "ok") {
                        var j = $(k.markup);
                        j.data("field_properties", k.field_properties).addClass("synched");
                        $("#" + k.holder_id).replaceWith(j);
                        $("#li_" + k.element_id).hide().fadeIn();
                        reorganize_page_break();
                        $("#form_builder_sortable").sortable("refreshPositions")
                    } else {
                        $("#dialog-message").dialog("open");
                        $("#form_builder_sortable .drop_processing").remove()
                    }
                }
            })
        },
        update: function(c, d) {
            if ($(d.item).hasClass("no_fields_in_page")) {
                $(this).sortable("cancel")
            } else {
                if ($(d.item).hasClass("drop_processing") === false) {
                    $("#builder_tabs").tabs("select", 1);
                    select_element("#" + $(d.item).attr("id"))
                }
                reorganize_page_break();
                if ($(d.item).hasClass("firstpage") == true) {
                    select_element("#" + $(d.item).attr("id"))
                }
            }
        }
    });
    $("#form_builder_sortable").disableSelection();
    $(document).ready(function() {
        sidebar_scroll_pos = $("#sidebar").position().top;
        if (isScrolledIntoView("#bottom_bar_limit")) {
            $("#bottom_bar").css("position", "relative")
        } else {
            $("#bottom_bar").css("position", "fixed")
        }
        $(window).scroll(function() {
            if (isScrolledIntoView("#navigation")) {
                sidebar_pos = sidebar_scroll_pos
            } else {
                sidebar_pos = sidebar_scroll_pos - 135
            }
            var c = sidebar_pos + $(document).scrollTop() + "px";
            if ($("#builder_tabs").tabs("option", "selected") === 0) {
                $("#sidebar").animate({
                    top: c
                },
                {
                    duration: 500,
                    queue: false
                })
            }
            if (isScrolledIntoView("#bottom_bar_limit")) {
                $("#bottom_bar").css("position", "relative")
            } else {
                $("#bottom_bar").css("position", "fixed")
            }
        })
    });
    $("#form_builder_preview").delegate("li:not(#pagination_header):not(.no_fields_in_page)", "click",
    function(c) {
        $("#builder_tabs").tabs("select", 1);
        select_element("#" + $(this).attr("id"))
    });
    $("#form_header_title,#form_header_desc,#pagination_header").click(function(c) {
        $("#form_header").data("coming_from_click", 1);
        var d = $(this).attr("id");
        select_form_header(d)
    });
    $("#bottom_bar_add_field").click(function() {
        $("#builder_tabs").tabs("select", 0);
        if (isScrolledIntoView("#navigation")) {
            sidebar_pos = sidebar_scroll_pos
        } else {
            sidebar_pos = sidebar_scroll_pos - 100
        }
        var c = sidebar_pos + $(document).scrollTop() + "px";
        $("#sidebar").animate({
            top: c
        },
        {
            duration: 500,
            queue: false
        });
        $("#" + active_element).removeClass("highlighted");
        active_element = null;
        $("#form_header .highlighted").removeClass("highlighted");
        $("#selected_field_image").css("visibility", "hidden");
        $("#bottom_bar_field_action").fadeOut("fast",
    function() {
            $("#bottom_bar_content").animate({
                "margin-left": "160px"
            },
            {
                duration: 200,
                queue: false
            })
        });
        return false
    });

    $("#bottom_bar_save_form").click(function() {
        if ($("#form_builder_sortable > li.no_fields_in_page").length > 0) {
            $("#ui-dialog-title-dialog-warning").html("Unable to save. Your form contain empty pages!");
            $("#dialog-warning-msg").html("Your form contain one or more empty pages<br />Please add a field into the empty page or delete the empty page.");
            $("#dialog-warning").dialog("open");
            return false
        }
        $("#bottom_bar_msg").text("Please wait... Synching...");
        $("#bottom_bar_content").fadeOut("fast",
    function() {
            $("#bottom_bar_loader").fadeIn()
        });
        var c = $("#form_header").data("form_properties").id;
        var e = $("#form_builder_sortable > li").not(".dblive").not(".synched").not(".li_pagination").not("#li_lastpage");
        if (e.length >= 1) {
            var d = new Array();
            e.each(function(f) {
                d[f] = $(this).data("field_properties")
            });
            $.ajax({
                type: "POST",
                async: true,
                url: "synch_fields.php",
                data: {
                    form_id: c,
                    fp: d
                },
                cache: false,
                global: false,
                dataType: "json",
                error: function(h, f, g) {},
                success: function(f) {
                    if (f.status == "ok") {
                        $(f.updated_element_id).addClass("synched");
                        save_form()
                    }
                }
            })
        } else {
            save_form()
        }
        return false
    });


    $("#field_properties_pane img[title].helpmsg,#form_properties_pane img[title].helpmsg").tooltip({
        position: "bottom center",
        offset: [10, 20],
        effect: "fade",
        opacity: 0.8,
        events: {
            def: "click,mouseout"
        }
    });
    $("#element_label").bind("keyup mouseout",    function() {
        set_properties("element_label", $(this).val())
    });
    $("#element_required").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = "1"
        } else {
            c = "0"
        }
        set_properties("element_required", c)
    });
    $("#element_unique").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = "1"
        } else {
            c = "0"
        }
        set_properties("element_unique", c)
    });
    $("#element_public").bind("click",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = "0"
        } else {
            c = "1"
        }
        set_properties("element_visibility", c)
    });
    $("#element_private").bind("click",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = "1"
        } else {
            c = "0"
        }
        set_properties("element_visibility", c)
    });
    $("#element_instructions").bind("keyup mouseout",    function() {
        set_properties("element_guidelines", $(this).val())
    });
    $("#element_custom_css").bind("keyup mouseout",    function() {
        set_properties("element_custom_css", $(this).val())
    });
    $("#element_choices").delegate("input.text", "keyup", function(p) {
        var n = $(this);
        var g = n.attr("id").split("_");
        var i = g[1];
        var h = "&nbsp;";
        var r = $("#" + active_element);
        var l = r.data("field_properties").options[i].position;
        var d = r.data("field_properties").id;
        var f = r.data("field_properties").type;
        if (p.keyCode == 13) {
            var k = parseInt(r.data("field_properties").last_option_id) + 1;
            var m = "";
            if (f == "radio" || f == "select") {
                m = "radio"
            } else {
                if (f == "checkbox") {
                    m = "checkbox"
                }
            }
            var c = '<li><input type="' + m + '" title="Select this choice as the default." class="choices_default" name="choices_default" id="choicedef_' + k + '" /><input type="text" value="" autocomplete="off" class="text" id="choice_' + k + '" /> <img class="add_choice" title="Add" alt="Add" src="/GIedu/Public/plugins/forms/images/icons/add.png" style="vertical-align: middle" id="choiceadd_' + k + '" ><img class="del_choice" title="Delete" alt="Delete" src="/GIedu/Public/plugins/forms/images/icons/delete.png" style="vertical-align: middle" id="choicedel_' + k + '" ></li>';
            n.parent().after(c);
            r.data("field_properties").last_option_id = k;
            var o = "";
            if (f == "radio") {
                o = '<span><input type="radio" value="1" class="element radio" name="element_' + d + '" id="element_' + d + "_" + k + '"><label for="element_' + d + "_" + k + '" class="choice">&nbsp;</label></span>';
                $("#element_" + d + "_" + i).parent().after(o)
            } else {
                if (f == "checkbox") {
                    o = '<span><input type="checkbox" value="1" class="element checkbox" name="element_' + d + '" id="element_' + d + "_" + k + '"><label for="element_' + d + "_" + k + '" class="choice">&nbsp;</label></span>';
                    $("#element_" + d + "_" + i).parent().after(o)
                } else {
                    if (f == "select") {
                        o = '<option value="' + k + '">&nbsp;</option>';
                        $("#element_" + d + " option[value=" + i + "]").after(o)
                    }
                }
            }
            $("#choice_" + k).focus();
            var j = r.data("field_properties").options;
            j[k] = {
                position: l + 1,
                option: "",
                is_default: 0,
                is_db_live: "0"
            };
            r.data("field_properties").options = j;
            var q = $("#choice_" + k).parent().nextAll().children().filter("input.text");
            $.each(q,
            function(e, t) {
                var s = null;
                s = $(t).attr("id").split("_");
                r.data("field_properties").options[s[1]].position++
            })
        } else {
            if (n.val() != "") {
                h = n.val()
            }
            if (f == "select") {
                $("#element_" + d + " option[value=" + i + "]").text(h)
            } else {
                $("#element_" + d + "_" + i).next().html(h)
            }
            r.data("field_properties").options[i].option = n.val()
        }
    });
    $("#element_choices").delegate("input.choices_default", "click",function(k) {
        var i = $(this);
        var g = i.attr("id").split("_");
        var h = g[1];
        var c = active_element;
        var j = c.split("_");
        var d = j[1];
        var l = $("#" + active_element);
        var f = l.data("field_properties").type;
        if (f == "radio" || f == "select") {
            if (l.data("field_properties").options[h].is_default == "0") {
                if (f == "radio") {
                    $("#element_" + d + "_" + h).prop("checked", true)
                } else {
                    if (f == "select") {
                        $("#element_" + d).val(h)
                    }
                }
                $(l.data("field_properties").options).each(function(e, m) {
                    $.each(m,
                    function(n, o) {
                        l.data("field_properties").options[n].is_default = "0"
                    })
                });
                l.data("field_properties").options[h].is_default = "1"
            } else {
                if (f == "radio") {
                    $("#element_" + d + "_" + h).prop("checked", false)
                } else {
                    if (f == "select") {
                        if ($("#element_" + d).find('option[value=""]').length == 0) {
                            $("#element_" + d).prepend('<option value=""></option>')
                        }
                        $("#element_" + d).val("")
                    }
                }
                $(l.data("field_properties").options).each(function(e, m) {
                    $.each(m,
                    function(n, o) {
                        l.data("field_properties").options[n].is_default = "0"
                    })
                });
                $(this).prop("checked", false)
            }
        } else {
            if (f == "checkbox") {
                if (i.prop("checked") == true) {
                    $("#element_" + d + "_" + h).prop("checked", true);
                    l.data("field_properties").options[h].is_default = "1"
                } else {
                    $("#element_" + d + "_" + h).prop("checked", false);
                    l.data("field_properties").options[h].is_default = "0"
                }
            }
        }
    });
    $("#element_choices").delegate("img.add_choice", "click",function(p) {
        var n = $(this);
        var g = n.attr("id").split("_");
        var i = g[1];
        var h = "&nbsp;";
        var r = $("#" + active_element);
        var l = r.data("field_properties").options[i].position;
        var d = r.data("field_properties").id;
        var f = r.data("field_properties").type;
        var m = "";
        if (f == "radio" || f == "select") {
            m = "radio"
        } else {
            if (f == "checkbox") {
                m = "checkbox"
            }
        }
        var k = parseInt(r.data("field_properties").last_option_id) + 1;
        var c = '<li><input type="' + m + '" title="Select this choice as the default." class="choices_default" name="choices_default" id="choicedef_' + k + '" /><input type="text" value="" autocomplete="off" class="text" id="choice_' + k + '" /> <img class="add_choice" title="Add" alt="Add" src="/GIedu/Public/plugins/forms/images/icons/add.png" style="vertical-align: middle" id="choiceadd_' + k + '" ><img class="del_choice" title="Delete" alt="Delete" src="/GIedu/Public/plugins/forms/images/icons/delete.png" style="vertical-align: middle" id="choicedel_' + k + '" ></li>';
        n.parent().after(c);
        r.data("field_properties").last_option_id = k;
        var o = "";
        if (f == "radio") {
            o = '<span><input type="radio" value="1" class="element radio" name="element_' + d + '" id="element_' + d + "_" + k + '"><label for="element_' + d + "_" + k + '" class="choice">&nbsp;</label></span>'
        } else {
            if (f == "checkbox") {
                o = '<span><input type="checkbox" value="1" class="element checkbox" name="element_' + d + '" id="element_' + d + "_" + k + '"><label for="element_' + d + "_" + k + '" class="choice">&nbsp;</label></span>'
            } else {
                if (f == "select") {
                    o = '<option value="' + k + '">&nbsp;</option>';
                    $("#element_" + d + " option[value=" + i + "]").after(o)
                }
            }
        }
        $("#element_" + d + "_" + i).parent().after(o);
        $("#choice_" + k).focus();
        var j = r.data("field_properties").options;
        j[k] = {
            position: l + 1,
            option: "",
            is_default: 0,
            is_db_live: "0"
        };
        r.data("field_properties").options = j;
        var q = $("#choice_" + k).parent().nextAll().children().filter("input.text");
        $.each(q,
        function(e, t) {
            var s = null;
            s = $(t).attr("id").split("_");
            r.data("field_properties").options[s[1]].position++
        })
    });
    $("#element_choices").delegate("img.del_choice", "click",function(k) {
        if ($("#element_choices > li").size() <= 1) {
            $("#ui-dialog-title-dialog-warning").html("Unable to delete this choice!");
            $("#dialog-warning-msg").html("You cannot delete all choices! <br />At least 1 choice is required.");
            $("#dialog-warning").dialog("open");
            return false
        }
        var j = $(this);
        var d = j.attr("id").split("_");
        var g = d[1];
        var m = $("#" + active_element);
        var i = m.data("field_properties").options[g].position;
        var c = m.data("field_properties").id;
        var f = m.data("field_properties").type;
        var h = m.data("field_properties").options;
        delete h[g];
        m.data("field_properties").options = h;
        var l = $("#choice_" + g).parent().nextAll().children().filter("input.text");
        $.each(l,
        function(e, o) {
            var n = null;
            n = $(o).attr("id").split("_");
            m.data("field_properties").options[n[1]].position--
        });
        $("#choicedel_" + g).parent().remove();
        if (f == "radio" || f == "checkbox") {
            $("#element_" + c + "_" + g).parent().remove()
        } else {
            if (f == "select") {
                $("#element_" + c + " option[value=" + g + "]").remove()
            }
        }
    });
    $("#bulk_import_choices").click(function() {
        $("#bulk_insert_choices").val("");
        if ($("#" + active_element).data("field_properties").options[1] !== undefined) {
            if (($("#" + active_element).data("field_properties").options[1].option == "First option") && ($("#element_choices > li").size() == 3)) {
                $("#bulk_insert_choices").val("New option 1\nNew option 2\nNew option 3")
            }
        }
        $("#dialog-insert-choices").next().children().eq(1).addClass("negative_btn");
        $("#dialog-insert-choices").dialog("open");
        $("#bulk_insert_choices").focus();
        return false
    });
    $("#bulk_import_matrix_row").click(function() {
        $("#bulk_insert_rows").val("");
        if ($("#" + active_element + " table td.first_col").eq(0).text() == "First Question" && $("#" + active_element + " table td.first_col").eq(1).text() == "Second Question" && $("#" + active_element + " table td.first_col").eq(2).text() == "Third Question" && $("#" + active_element + " table td.first_col").eq(3).text() == "Fourth Question") {
            $("#bulk_insert_rows").val("New question 1\nNew question 2\nNew question 3")
        }
        $("#dialog-insert-matrix-rows").next().children().eq(1).addClass("negative_btn");
        $("#dialog-insert-matrix-rows").dialog("open");
        $("#bulk_insert_rows").focus();
        return false
    });
    $("#bulk_import_matrix_column").click(function() {
        $("#bulk_insert_columns").val("");
        if ($("#" + active_element + " table thead th").eq(1).text() == "Answer A" && $("#" + active_element + " table thead th").eq(2).text() == "Answer B" && $("#" + active_element + " table thead th").eq(3).text() == "Answer C" && $("#" + active_element + " table thead th").eq(4).text() == "Answer D") {
            $("#bulk_insert_columns").val("Answer E\nAnswer F\nAnswer G")
        }
        $("#dialog-insert-matrix-columns").next().children().eq(1).addClass("negative_btn");
        $("#dialog-insert-matrix-columns").dialog("open");
        $("#bulk_insert_columns").focus();
        return false
    });
    $("#element_choice_columns").bind("change",    function() {
        set_properties("element_choice_columns", $(this).val())
    });
    $("#element_range_min").bind("keyup mouseout",    function() {
        set_properties("element_range_min", $(this).val())
    });
    $("#element_range_max").bind("keyup mouseout",    function() {
        set_properties("element_range_max", $(this).val())
    });
    $("#element_range_limit_by").bind("change",    function() {
        set_properties("element_range_limit_by", $(this).val())
    });
    $("#element_range_number_limit_by").bind("change",    function() {
        set_properties("element_range_limit_by", $(this).val())
    });
    $("#element_type").bind("change",    function() {
        set_properties("element_type_change", $(this).val())
    });
    $("#element_size").bind("change",    function() {
        set_properties("element_size", $(this).val())
    });
    $("#name_format").bind("change",    function() {
        set_properties("element_type", $(this).val())
    });
    $("#phone_format").bind("change",    function() {
        set_properties("element_type", $(this).val())
    });
    $("#element_default_value").bind("keyup mouseout",    function() {
        set_properties("element_default_value", $(this).val())
    });
    $("#element_default_phone1,#element_default_phone2,#element_default_phone3").bind("keyup mouseout",    function() {
        var c = $("#element_default_phone1").val() + $("#element_default_phone2").val() + $("#element_default_phone3").val();
        set_properties("element_default_value", c)
    });
    $("#element_default_value_textarea").bind("keyup mouseout",    function() {
        set_properties("element_default_value", $(this).val())
    });
    $("#element_default_date").bind("keyup mouseout",    function() {
        set_properties("element_default_value", $(this).val());
        var c = $("#" + active_element).data("field_properties");
        $.ajax({
            type: "POST",
            async: true,
            url: "string_to_time.php",
            data: {
                default_date: $(this).val(),
                date_format: c.type
            },
            cache: false,
            global: false,
            dataType: "json",
            error: function(g, d, f) {},
            success: function(e) {
                if (e.status == "ok") {
                    if (c.type == "date") {
                        var d = e.default_date.split("-");
                        $("#element_" + c.id + "_1").val(d[1]);
                        $("#element_" + c.id + "_2").val(d[0]);
                        $("#element_" + c.id + "_3").val(d[2])
                    } else {
                        if (c.type == "europe_date") {
                            var d = e.default_date.split("-");
                            $("#element_" + c.id + "_1").val(d[0]);
                            $("#element_" + c.id + "_2").val(d[1]);
                            $("#element_" + c.id + "_3").val(d[2])
                        }
                    }
                }
            }
        })
    });
    $("#prop_other_choices_label").bind("keyup mouseout",    function() {
        set_properties("element_choice_other_label", $(this).val())
    });
    $("#prop_choices_other_checkbox").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_choice_has_other", c)
    });
    $("#prop_choices_randomize").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = "random"
        } else {
            c = ""
        }
        set_properties("constraint", c)
    });
    $("#prop_text_as_password").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = "password"
        } else {
            c = ""
        }
        set_properties("constraint", c)
    });
    $("#prop_section_email_display").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_section_display_in_email", c)
    });
    $("#prop_section_size").bind("change",    function() {
        set_properties("element_size", $(this).val())
    });
    $("#prop_section_enable_scroll").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_section_enable_scroll", c)
    });
    $("#prop_time_showsecond").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_time_showsecond", c)
    });
    $("#prop_time_24hour").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_time_24hour", c)
    });
    $("#element_countries").bind("change",    function() {
        set_properties("element_default_value", $(this).val())
    });
    $("#money_format").bind("change",    function() {
        set_properties("constraint", $(this).val())
    });
    $("#prop_address_hideline2").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_address_hideline2", c)
    });
    $("#prop_address_us_only").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_address_us_only", c)
    });
    $("#prop_date_range").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_date_enable_range", c)
    });
    $("#prop_date_selection_limit").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_date_enable_selection_limit", c)
    });
    $("#prop_date_past_future_selection").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_date_disable_past_future", c)
    });
    $("#date_selection_max").bind("keyup mouseout",    function() {
        set_properties("element_date_selection_max", $(this).val())
    });
    $("#prop_date_disable_specific").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_date_disable_specific", c)
    });
    $("#date_disabled_list").bind("keyup mouseout",    function() {
        set_properties("element_date_disabled_list", $(this).val())
    });
    $("#prop_date_past_future").bind("change",    function() {
        set_properties("date_past_future", $(this).val())
    });
    $("#prop_date_disable_weekend").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_date_disable_weekend", c)
    });
    $("#date_type").bind("change",    function() {
        set_properties("element_type", $(this).val())
    });
    $("#linked_picker_range_min").datepick({
        onSelect: update_date_range_min_linked,
        showTrigger: "#date_range_min_pick_img"
    });
    $("#date_range_min_mm,#date_range_min_dd,#date_range_min_yyyy").bind("blur mouseout",    function() {
        var c = parseInt($("#date_range_min_dd").val(), 10);
        var f = parseInt($("#date_range_min_mm").val(), 10) - 1;
        var d = parseInt($("#date_range_min_yyyy").val(), 10);
        if (!isNaN(c) && !isNaN(f) && !isNaN(d) && (c != 0) && (f != -1)) {
            $("#linked_picker_range_min").datepick("setDate", new Date(d, f, c));
            var e = $("#date_range_min_yyyy").val() + "-" + $("#date_range_min_mm").val() + "-" + $("#date_range_min_dd").val();
            set_properties("element_date_range_min", e)
        }
    });
    $("#linked_picker_range_max").datepick({
        onSelect: update_date_range_max_linked,
        showTrigger: "#date_range_max_pick_img"
    });
    $("#date_range_max_mm,#date_range_max_dd,#date_range_max_yyyy").bind("blur mouseout",    function() {
        var f = parseInt($("#date_range_max_dd").val(), 10);
        var e = parseInt($("#date_range_max_mm").val(), 10) - 1;
        var c = parseInt($("#date_range_max_yyyy").val(), 10);
        if (!isNaN(f) && !isNaN(e) && !isNaN(c) && (f != 0) && (e != -1)) {
            $("#linked_picker_range_max").datepick("setDate", new Date(c, e, f));
            var d = $("#date_range_max_yyyy").val() + "-" + $("#date_range_max_mm").val() + "-" + $("#date_range_max_dd").val();
            set_properties("element_date_range_max", d)
        }
    });
    $("#date_disabled_list").datepick({
        multiSelect: 999,
        multiSeparator: ", ",
        showTrigger: "#date_disable_specific_pick_img",
        onClose: function(e) {
            var c = e.length;
            for (var d = 0; d < c; d++) {
                e[d] = $.datepick.formatDate("mm/dd/yyyy", e[d])
            }
            var f = e.join(", ");
            set_properties("element_date_disabled_list", f)
        }
    });
    $("#prop_file_enable_type_limit").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_file_enable_type_limit", c)
    });
    $("#prop_file_block_or_allow").bind("change",    function() {
        set_properties("element_file_block_or_allow", $(this).val())
    });
    $("#file_type_list").bind("keyup mouseout",    function() {
        set_properties("element_file_type_list", $(this).val())
    });
    $("#prop_file_as_attachment").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_file_as_attachment", c)
    });
    $("#prop_file_enable_advance").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_file_enable_advance", c)
    });
    $("#prop_file_auto_upload").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_file_auto_upload", c)
    });
    $("#prop_file_multi_upload").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_file_enable_multi_upload", c)
    });
    $("#file_max_selection").bind("keyup mouseout change",    function() {
        set_properties("element_file_max_selection", $(this).val())
    });
    $("#prop_file_limit_size").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_file_enable_size_limit", c)
    });
    $("#file_size_max").bind("keyup mouseout",    function() {
        set_properties("element_file_size_max", $(this).val())
    });
    $("#prop_number_enable_quantity").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_number_enable_quantity", c)
    });
    $("#prop_number_quantity_link").bind("change",    function() {
        set_properties("element_number_quantity_link", $(this).val())
    });
    $("#prop_submit_use_text").bind("click",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 0
        } else {
            c = 1
        }
        set_properties("submit_use_image", c)
    });
    $("#prop_submit_use_image").bind("click",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("submit_use_image", c)
    });
    $("#submit_primary_text").bind("keyup mouseout",    function() {
        set_properties("submit_primary_text", $(this).val())
    });
    $("#submit_secondary_text").bind("keyup mouseout",    function() {
        set_properties("submit_secondary_text", $(this).val())
    });
    $("#submit_primary_img").bind("keyup mouseout",    function() {
        set_properties("submit_primary_img", $(this).val())
    });
    $("#submit_secondary_img").bind("keyup mouseout",    function() {
        set_properties("submit_secondary_img", $(this).val())
    });
    $("#element_matrix_row").delegate("input.text", "keyup", function(g) {
        var i = $(this);
        var h = i.attr("id").split("_");
        var c = h[1];
        var f = "&nbsp;";
        var d = $("#" + active_element);
        if (g.keyCode == 13) {
            if ($("#element_matrix_row li.li_mr_temp_holder").length == 0) {
                add_matrix_row(i)
            }
        } else {
            if (i.parent().hasClass("li_mr_temp_holder") == false) {
                if (i.val() != "") {
                    f = i.val()
                }
                $("#mr_" + c + " td.first_col").html(f);
                d.data("field_properties").options[c].row_title = i.val()
            }
        }
    });
    $("#element_matrix_row").delegate("img.add_choice", "click",   function(c) {
        var d = $(this);
        if ($("#element_matrix_row li.li_mr_temp_holder").length == 0) {
            add_matrix_row(d)
        }
    });
    $("#element_matrix_row").delegate("img.del_choice", "click",   function(c) {
        var d = $(this);
        delete_matrix_row(d)
    });
    $("#element_matrix_column").delegate("input.text", "keyup",   function(h) {
        var j = $(this);
        var i = j.attr("id").split("_");
        var f = i[1];
        var g = "&nbsp;";
        var d = $("#" + active_element);
        var c = d.data("field_properties").id;
        if (h.keyCode == 13) {
            add_matrix_column(j)
        } else {
            if (j.val() != "") {
                g = j.val()
            }
            $("#mc_" + c + "_" + f).html(g);
            d.data("field_properties").options[c].column_data[f].column_title = j.val()
        }
    });
    $("#element_matrix_column").delegate("img.add_choice", "click",  function(c) {
        var d = $(this);
        add_matrix_column(d)
    });
    $("#element_matrix_column").delegate("img.del_choice", "click",    function(c) {
        var d = $(this);
        delete_matrix_column(d)
    });
    $("#prop_matrix_allow_multiselect").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        set_properties("element_matrix_allow_multiselect", c)
    });
    $("#form_title").bind("keyup mouseout",    function() {
        set_form_properties("form_title", $(this).val())
    });
    $("#form_description").bind("keyup mouseout",    function() {
        set_form_properties("form_description", $(this).val())
    });
    $("#form_success_message_option").click(function() {
        set_form_properties("form_redirect_enable", 0)
    });
    $("#form_redirect_option").click(function() {
        set_form_properties("form_redirect_enable", 1)
    });
    $("#form_success_message").bind("keyup mouseout",    function() {
        set_form_properties("form_success_message", $(this).val())
    });
    $("#form_redirect_url").bind("keyup mouseout",    function() {
        set_form_properties("form_redirect", $(this).val())
    });
    $("#form_review,#form_resume").bind("change",    function() {
        var c;
        if ($(this).prop("checked") == true) {
            c = 1
        } else {
            c = 0
        }
        if ($(this).attr("id") == "form_review") {
            set_form_properties("form_review", c)
        } else {
            set_form_properties("form_resume_enable", c)
        }
    });
    $("#form_review_title").bind("keyup mouseout",    function() {
        set_form_properties("form_review_title", $(this).val())
    });
    $("#form_review_description").bind("keyup mouseout",    function() {
        set_form_properties("form_review_description", $(this).val())
    });
    $("#form_review_use_text").click(function() {
        set_form_properties("form_review_use_image", 0)
    });
    $("#form_review_use_image").click(function() {
        set_form_properties("form_review_use_image", 1)
    });
    $("#review_primary_text").bind("keyup mouseout",    function() {
        set_form_properties("review_primary_text", $(this).val())
    });
    $("#review_primary_img").bind("keyup mouseout",    function() {
        set_form_properties("review_primary_img", $(this).val())
    });
    $("#review_secondary_text").bind("keyup mouseout",    function() {
        set_form_properties("review_secondary_text", $(this).val())
    });
    $("#review_secondary_img").bind("keyup mouseout",    function() {
        set_form_properties("review_secondary_img", $(this).val())
    });
    $("#form_password_option").bind("change",    function() {
        $("#form_header").data("form_properties").password = "";
        $("#form_password_data").val("");
        if ($(this).prop("checked") == true) {
            $("#form_password").slideDown()
        } else {
            $("#form_password").fadeOut("slow")
        }
    });
    $("#form_password_data").bind("keyup mouseout",    function() {
        set_form_properties("form_password", $(this).val())
    });
    $("#form_captcha").bind("change",    function() {
        if ($(this).prop("checked") == true) {
            $("#form_header").data("form_properties").captcha = 1;
            $("#form_captcha_type_option").slideDown()
        } else {
            $("#form_header").data("form_properties").captcha = 0;
            $("#form_captcha_type_option").fadeOut("slow")
        }
    });
    $("#form_captcha_type").bind("change",    function() {
        $("#form_header").data("form_properties").captcha_type = $(this).val()
    });
    $("#form_unique_ip").bind("change",    function() {
        if ($(this).prop("checked") == true) {
            $("#form_header").data("form_properties").unique_ip = 1
        } else {
            $("#form_header").data("form_properties").unique_ip = 0
        }
    });
    $("#form_limit_option").bind("change",    function() {
        if ($(this).prop("checked") == true) {
            $("#form_limit_div").slideDown();
            $("#form_header").data("form_properties").limit_enable = 1
        } else {
            $("#form_limit_div").fadeOut("slow");
            $("#form_header").data("form_properties").limit_enable = 0
        }
    });
    $("#form_limit").bind("keyup mouseout",    function() {
        set_form_properties("form_limit", $(this).val())
    });
    $("#form_prop_toggle_a,#form_prop_toggle_img").click(function() {
        if ($("#form_prop_toggle_a").text() == "show more options") {
            $("#form_prop_toggle_a").text("show less options");
            $("#form_prop_toggle_img").attr("src", "/GIedu/Public/plugins/forms/images/icons/resultset_up.gif");
            if ($("#form_review").prop("checked") == true) {
                $("#all_form_properties .advanced_prop").slideDown("slow",
            function() {
                    adjust_main_height()
                })
            } else {
                $("#all_form_properties .advanced_prop").not("#form_prop_review").slideDown("slow",
            function() {
                    adjust_main_height()
                })
            }
            $("#form_prop_toggle_a").data("expand", 1)
        } else {
            $("#form_prop_toggle_a").text("show more options");
            $("#form_prop_toggle_img").attr("src", "/GIedu/Public/plugins/forms/images/icons/resultset_next.gif");
            $("#form_prop_review").hide();
            $("#all_form_properties .advanced_prop").slideUp("slow",
        function() {
                adjust_main_height()
            });
            $("#form_prop_toggle_a").data("expand", 0)
        }
        return false
    });
    $("#form_label_alignment").bind("change",    function() {
        set_form_properties("form_label_alignment", $(this).val())
    });
    $("#form_language").bind("change",    function() {
        set_form_properties("form_language", $(this).val())
    });
    $("#pagination_style_steps,#pagination_style_percentage,#pagination_style_disabled").bind("click",    function() {
        var d;
        var c = $(this).attr("id");
        if (c == "pagination_style_steps") {
            d = "steps"
        } else {
            if (c == "pagination_style_percentage") {
                d = "percentage"
            } else {
                if (c == "pagination_style_disabled") {
                    d = "disabled"
                }
            }
        }
        set_form_properties("form_pagination_type", d)
    });
    $("#pagination_title_list").delegate("input.text", "keyup",   function(j) {
        var h = $(this);
        var k = h.attr("id").split("_");
        var c = parseInt(k[1]);
        var g = c + 1;
        var i = $("#form_header").data("form_properties");
        var d = $("#form_builder_sortable > li.page_break");
        var f = i.pagination_type;
        if (f == "steps") {
            if (j.keyCode == 13) {
                $("#pagetitleinput_" + g).focus().select()
            } else {
                $("#page_title_" + c).text(h.val())
            }
        } else {
            if (f == "percentage") {
                if (j.keyCode == 13) {
                    $("#pagetitleinput_" + g).focus().select()
                } else {
                    if (c == 1) {
                        $("#page_title_1").html("Page 1 of " + d.length + " - " + h.val())
                    }
                }
            }
        }
        d.eq(c - 1).data("field_properties").page_title = h.val();
        d.eq(c - 1).removeClass("synched")
    });
    $("#form_schedule_enable").bind("change",    function() {
        if ($(this).prop("checked") == true) {
            $("#form_header").data("form_properties").schedule_enable = 1;
            $("#form_prop_scheduling_start").fadeIn();
            $("#form_prop_scheduling_end").fadeIn()
        } else {
            $("#form_header").data("form_properties").schedule_enable = 0;
            $("#form_prop_scheduling_start").fadeOut("slow");
            $("#form_prop_scheduling_end").fadeOut("slow")
        }
    });
    $("#linked_picker_scheduling_start").datepick({
        onSelect: update_scheduling_start_linked,
        showTrigger: "#scheduling_start_pick_img"
    });
    $("#scheduling_start_mm,#scheduling_start_dd,#scheduling_start_yyyy").bind("blur mouseout",    function() {
        var c = parseInt($("#scheduling_start_dd").val(), 10);
        var f = parseInt($("#scheduling_start_mm").val(), 10) - 1;
        var e = parseInt($("#scheduling_start_yyyy").val(), 10);
        if (!isNaN(c) && !isNaN(f) && !isNaN(e) && (c != 0) && (f != -1)) {
            $("#linked_picker_scheduling_start").datepick("setDate", new Date(e, f, c));
            var d = $("#scheduling_start_yyyy").val() + "-" + $("#scheduling_start_mm").val() + "-" + $("#scheduling_start_dd").val();
            $("#form_header").data("form_properties").schedule_start_date = d
        }
    });
    $("#scheduling_start_hour,#scheduling_start_minute,#scheduling_start_ampm").bind("change",    function() {
        $("#form_header").data("form_properties").schedule_start_hour = $("#scheduling_start_hour").val() + ":" + $("#scheduling_start_minute").val() + ":" + $("#scheduling_start_ampm").val()
    });
    $("#linked_picker_scheduling_end").datepick({
        onSelect: update_scheduling_end_linked,
        showTrigger: "#scheduling_end_pick_img"
    });
    $("#scheduling_end_mm,#scheduling_end_dd,#scheduling_end_yyyy").bind("blur mouseout",    function() {
        var c = parseInt($("#scheduling_end_dd").val(), 10);
        var f = parseInt($("#scheduling_end_mm").val(), 10) - 1;
        var d = parseInt($("#scheduling_end_yyyy").val(), 10);
        if (!isNaN(c) && !isNaN(f) && !isNaN(d) && (c != 0) && (f != -1)) {
            $("#linked_picker_scheduling_end").datepick("setDate", new Date(d, f, c));
            var e = $("#scheduling_end_yyyy").val() + "-" + $("#scheduling_end_mm").val() + "-" + $("#scheduling_end_dd").val();
            $("#form_header").data("form_properties").schedule_end_date = e
        }
    });
    $("#scheduling_end_hour,#scheduling_end_minute,#scheduling_end_ampm").bind("change",    function() {
        $("#form_header").data("form_properties").schedule_end_hour = $("#scheduling_end_hour").val() + ":" + $("#scheduling_end_minute").val() + ":" + $("#scheduling_end_ampm").val()
    });
    $("#form_custom_script_enable").bind("change",    function() {
        if ($(this).prop("checked") == true) {
            $("#form_header").data("form_properties").custom_script_enable = 1;
            $("#form_custom_script_div").slideDown()
        } else {
            $("#form_header").data("form_properties").custom_script_enable = 0;
            $("#form_custom_script_div").fadeOut("slow")
        }
    });
    $("#form_custom_script_url").bind("keyup mouseout",    function() {
        set_form_properties("form_custom_script_url", $(this).val())
    });
    $("#social a").click(function() {
        var d = $(this).attr("id");
        var c;
        switch (d) {
        case "a_single_line_text":
            c = "text";
            break;
        case "a_number":
            c = "number";
            break;
        case "a_paragraph_text":
            c = "textarea";
            break;
        case "a_checkboxes":
            c = "checkbox";
            break;
        case "a_multiple_choice":
            c = "radio";
            break;
        case "a_drop_down":
            c = "select";
            break;
        case "a_name":
            c = "simple_name";
            break;
        case "a_date":
            c = "date";
            break;
        case "a_time":
            c = "time";
            break;
        case "a_phone":
            c = "phone";
            break;
        case "a_address":
            c = "address";
            break;
        case "a_website":
            c = "url";
            break;
        case "a_price":
            c = "money";
            break;
        case "a_email":
            c = "email";
            break;
        case "a_section_break":
            c = "section";
            break;
        case "a_file_upload":
            c = "file";
            break;
        case "a_page_break":
            c = "page_break";
            break;
        case "a_matrix":
            c = "matrix";
            break;
        case "a_signature":
            c = "signature";
            break;
        default:
            c = "text";
            break
        }
        add_element(c);
        return false
    });
    $("#dialog-message").dialog({
        modal: true,
        autoOpen: false,
        closeOnEscape: false,
        width: 600,
        draggable: false,
        resizable: false,
        position: ["center", "center"],
        open: function() {
            $(this).next().find("button").blur()
        },
        buttons: [{
            text: "Close",
            "class": "bb_button bb_small bb_green",
            click: function() {
                $("#bottom_bar_loader").hide();
                $("#bottom_bar_content").show();
                $(this).dialog("close")
            }
        }]
    });
    $("#dialog-warning").dialog({
        modal: true,
        autoOpen: false,
        closeOnEscape: false,
        width: 600,
        position: ["center", "center"],
        draggable: false,
        resizable: false,
        open: function() {
            $(this).next().find("button").blur()
        },
        buttons: [{
            text: "OK",
            "class": "bb_button bb_small bb_green",
            click: function() {
                $(this).dialog("close")
            }
        }]
    });
    $("#dialog-confirm-field-delete").dialog({
        modal: true,
        autoOpen: false,
        closeOnEscape: false,
        width: 550,
        resizable: false,
        draggable: false,
        position: ["center", "center"],
        open: function() {
            $("#btn-field-delete-ok").blur()
        },
        buttons: [{
            text: "确定",
            id: "btn-field-delete-ok",
            "class": "bb_button bb_small bb_green",
            click: function() {
                var d = $("#" + active_element);
                var c = d.html();
                var e = $("#form_header").data("form_properties").id;
                d.html('<img src="/GIedu/Public/plugins/forms/images/loader_small.gif" style="vertical-align: middle"/> deleting field ...').addClass("delete_processing");
                $(this).dialog("close");
                $.ajax({
                    type: "POST",
                    async: true,
                    url: "delete_live_field.php",
                    data: {
                        form_id: e,
                        element_id: d.data("field_properties").id
                    },
                    cache: false,
                    global: true,
                    dataType: "json",
                    error: function(h, f, g) {
                        d.html(c).removeClass("delete_processing")
                    },
                    success: function(f) {
                        if (f.status == "ok") {
                            $("#li_" + f.element_id).fadeOut("normal",
                        function() {
                                $(this).remove();
                                reorganize_page_break();
                                $("#form_builder_sortable").sortable("refreshPositions")
                            });
                            active_element = null;
                            $("#selected_field_image").css("visibility", "hidden");
                            $("#bottom_bar_field_action").fadeOut("fast",
                        function() {
                                $("#bottom_bar_content").animate({
                                    "margin-left": "160px"
                                },
                                {
                                    duration: 200,
                                    queue: false
                                })
                            });
                            $("#builder_tabs").tabs("select", 0)
                        } else {
                            $(this).dialog("close");
                            d.html(c).removeClass("delete_processing");
                            $("#dialog-message").dialog("open")
                        }
                    }
                })
            }
        },
        {
            text: "取消",
            id: "btn-field-delete-cancel",
            "class": "btn_secondary_action",
            click: function() {
                $(this).dialog("close")
            }
        }]
    });
    $("#dialog-form-saved").dialog({
        modal: true,
        autoOpen: false,
        closeOnEscape: false,
        width: 450,
        resizable: false,
        draggable: false,
        position: ["center", "center"],
        open: function() {
            $("#btn-form-saved-ok").blur()
        },
        buttons: [{
            text: "完成",
            id: "btn-form-saved-cancel",
            "class": "btn_secondary_action",
            click: function() {
                var c = $("#form_header").data("form_properties").id;
                window.location.replace("index.php")
            }
        }]
    });
    $("#dialog-insert-choices").dialog({
        modal: true,
        autoOpen: false,
        closeOnEscape: false,
        width: 515,
        position: ["center", "center"],
        draggable: false,
        resizable: false,
        open: function() {
            $(this).next().find("button").blur()
        },
        buttons: [{
            text: "Add Choices",
            "class": "bb_button bb_small bb_green",
            click: function() {
                if ($("#bulk_insert_choices").val() == "") {
                    $(this).dialog("close")
                } else {
                    var c = $("#bulk_insert_choices").val().split("\n");
                    var k = $("#" + active_element);
                    var f = parseInt(k.data("field_properties").last_option_id) + 1;
                    var g = f - 1;
                    var i = $("#element_choices > li").size() + 1;
                    var h = k.data("field_properties").options;
                    var j = "";
                    var d = k.data("field_properties").id;
                    var e = k.data("field_properties").type;
                    $.each(c,
                    function(l, m) {
                        h[f] = {
                            position: i,
                            option: m,
                            is_default: 0,
                            is_db_live: "0"
                        };
                        if (e == "radio") {
                            j += '<span><input type="radio" value="1" class="element radio" name="element_' + d + '" id="element_' + d + "_" + f + '"><label for="element_' + d + "_" + f + '" class="choice">' + m + "</label></span>"
                        } else {
                            if (e == "checkbox") {
                                j += '<span><input type="checkbox" value="1" class="element checkbox" name="element_' + d + '" id="element_' + d + "_" + f + '"><label for="element_' + d + "_" + f + '" class="choice">' + m + "</label></span>"
                            } else {
                                if (e == "select") {
                                    j += '<option value="' + f + '">' + m + "</option>"
                                }
                            }
                        }
                        f++;
                        i++
                    });
                    if (e == "radio") {
                        if (k.data("field_properties").choice_has_other == 1) {
                            $("#element_" + d + "_other").parent().before(j)
                        } else {
                            $("#li_" + d + " > div").append(j)
                        }
                    } else {
                        if (e == "checkbox") {
                            if (k.data("field_properties").choice_has_other == 1) {
                                $("#element_" + d + "_other").parent().before(j)
                            } else {
                                $("#li_" + d + " > div").append(j)
                            }
                        } else {
                            if (e == "select") {
                                $("#element_" + d).append(j)
                            }
                        }
                    }
                    k.data("field_properties").options = h;
                    k.data("field_properties").last_option_id = f - 1;
                    $(this).dialog("close");
                    load_properties("#" + active_element)
                }
            }
        },
        {
            text: "Cancel",
            "class": "btn_secondary_action",
            click: function() {
                $(this).dialog("close")
            }
        }]
    });
    $("#dialog-insert-matrix-rows").dialog({
        modal: true,
        autoOpen: false,
        closeOnEscape: false,
        width: 500,
        draggable: false,
        resizable: false,
        open: function() {
            $(this).next().find("button").blur()
        },
        position: ["center", "center"],
        buttons: [{
            text: "Add Rows",
            "class": "bb_button bb_small bb_green",
            click: function() {
                if ($("#bulk_insert_rows").val() == "") {
                    $(this).dialog("close")
                } else {
                    var e = $("#form_header").data("form_properties").id;
                    var g = $("#bulk_insert_rows").val().split("\n");
                    var d = $("#" + active_element);
                    var c = $("#form_builder_sortable > li").not(".li_pagination").size() + 1;
                    var h = c + $("#form_builder_sortable li.matrix table tr").length;
                    var i = $("#" + active_element + " table th").length;
                    var f = '<tr id="mr_temp_' + h + '" class="matrix_row_processing"><td colspan="' + i + '"><img src="/GIedu/Public/plugins/forms/images/loader_small.gif" style="vertical-align: middle"/> creating new rows ...</td></tr>';
                    $("#" + active_element + " table tbody").append(f);
                    $.ajax({
                        type: "POST",
                        async: true,
                        url: "add_matrix_row.php",
                        data: {
                            form_id: e,
                            row_holder_id: "mr_temp_" + h,
                            allow_multiselect: d.data("field_properties").matrix_allow_multiselect,
                            matrix_parent_id: d.data("field_properties").id,
                            position: $("#" + active_element + " table tbody tr").length,
                            total_column: i - 1,
                            column_data: d.data("field_properties").options[d.data("field_properties").id].column_data,
                            rows_titles: g
                        },
                        cache: false,
                        global: true,
                        dataType: "json",
                        error: function(l, j, k) {
                            $("#mr_temp_" + h).remove()
                        },
                        success: function(k) {
                            if (k.status == "ok") {
                                var j = d.data("field_properties").options;
                                $.each(k.new_row_data,
                                function(l, m) {
                                    j[l] = m
                                });
                                d.data("field_properties").options = j;
                                $("#" + k.row_holder_id).replaceWith(k.new_row_markup);
                                load_properties("#" + active_element)
                            } else {
                                $("#dialog-message").dialog("open");
                                $("#mr_temp_" + h).remove()
                            }
                        }
                    });
                    $(this).dialog("close")
                }
            }
        },
        {
            text: "Cancel",
            "class": "btn_secondary_action",
            click: function() {
                $(this).dialog("close")
            }
        }]
    });
    $("#dialog-insert-matrix-columns").dialog({
        modal: true,
        autoOpen: false,
        closeOnEscape: false,
        draggable: false,
        resizable: false,
        open: function() {
            $(this).next().find("button").blur()
        },
        width: 515,
        position: ["center", "center"],
        buttons: [{
            text: "Add Columns",
            "class": "bb_button bb_small bb_green",
            click: function() {
                if ($("#bulk_insert_columns").val() == "") {
                    $(this).dialog("close")
                } else {
                    var o = $("#form_header").data("form_properties").id;
                    var m = $("#" + active_element + " table th").length;
                    var j = $("#bulk_insert_columns").val().split("\n");
                    var t = $("#" + active_element);
                    var d = t.data("field_properties").id;
                    var n = parseInt(t.data("field_properties").last_option_id) + 1;
                    var h = n;
                    t.data("field_properties").last_option_id = n + j.length - 1;
                    var f = "";
                    var u = n;
                    $.each(j,
                    function(v, w) {
                        f += '<th scope="col" id="mc_' + d + "_" + u + '">' + w + "</th>";
                        u++
                    });
                    $("#" + active_element + " table thead tr").append(f);
                    var p = "";
                    if (t.data("field_properties").matrix_allow_multiselect == 1) {
                        p = "checkbox"
                    } else {
                        p = "radio"
                    }
                    var r = new Array();
                    var e = "";
                    var s = "";
                    $("#" + active_element + " table tbody").find("tr").each(function() {
                        r = $(this).attr("id").split("_");
                        e = r[1];
                        s = "";
                        u = n;
                        $.each(j,
                        function(v, w) {
                            s += '<td><input type="' + p + '" value="' + u + '" name="element_' + e + '" id="element_' + e + "_" + u + '"></td>';
                            u++
                        });
                        n++;
                        $(this).append(s)
                    });
                    var k = $("#" + active_element + " table th").length;
                    var q = 100 / k;
                    var g = 2 * q;
                    g = Math.round(g);
                    var i = (100 - g) / (k - 1);
                    i = Math.round(i);
                    $("#" + active_element + " table th:eq(0)").css("width", g + "%");
                    $("#" + active_element + " table th:gt(0)").css("width", i + "%");
                    var l = t.data("field_properties").options[d].column_data;
                    var c = m;
                    $.each(j,
                    function(v, w) {
                        l[h] = {
                            column_title: w,
                            is_db_live: 0,
                            position: c
                        };
                        c++;
                        h++
                    });
                    t.data("field_properties").options[d].column_data = l;
                    load_properties("#" + active_element);
                    $(this).dialog("close")
                }
            }
        },
        {
            text: "Cancel",
            "class": "btn_secondary_action",
            click: function() {
                $(this).dialog("close")
            }
        }]
    });
    $(document).ajaxError(function(f, g, d, c) {
        $("#dialog-message").dialog("open")
    });
    $("#social li").draggable({
        connectToSortable: "#form_builder_sortable",
        helper: "clone",
        revert: "invalid",
        revertDuration: 300,
        addClasses: true
    });
    $("#form_builder_sortable li").not(".li_pagination").addClass("synched dblive");
    $("#bottom_bar_duplicate_field").click(function() {
        var e = $("#form_builder_sortable > li").not(".li_pagination").size() + 1;
        $('<li id="li_temp_' + e + '" class="duplicate_processing"><img src="/GIedu/Public/plugins/forms/images/loader_small.gif" style="vertical-align: middle"/> duplicating field ...</li>').insertAfter("#" + active_element).hide().fadeIn();
        var d = $("#form_header").data("form_properties").id;
        var f = $("#" + active_element).data("field_properties");
        var c = f.position + 1;
        $.ajax({
            type: "POST",
            async: true,
            url: "add_field.php",
            data: {
                element_type: f.type,
                form_id: d,
                holder_id: "li_temp_" + e,
                position: c,
                action: "duplicate",
                field_properties: f
            },
            cache: false,
            global: true,
            dataType: "json",
            error: function(i, g, h) {
                $("#form_builder_sortable .duplicate_processing").remove()
            },
            success: function(h) {
                if (h.status == "ok") {
                    var g = $(h.markup);
                    g.data("field_properties", h.field_properties);
                    $("#" + h.holder_id).replaceWith(g);
                    if (g.data("field_properties").type == "section") {
                        $("#li_" + h.element_id + " > h3").html($("#li_" + h.element_id + " > h3").html().replace(/\n/g, "<br />"))
                    } else {
                        if (g.data("field_properties").type == "page_break") {} else {
                            if (g.data("field_properties").type == "matrix") {} else {
                                $("#li_" + h.element_id + " > label").html($("#li_" + h.element_id + " > label").html().replace(/\n/g, "<br />"))
                            }
                        }
                    }
                    $("#li_" + h.element_id).hide().fadeIn();
                    reorganize_page_break();
                    $("#form_builder_sortable").sortable("refreshPositions")
                } else {
                    $("#dialog-message").dialog("open");
                    $("#form_builder_sortable .duplicate_processing").remove()
                }
            }
        });
        return false
    });
    $("#bottom_bar_delete_field").click(function() {
        var d = $("#" + active_element);
	if ($("#form_builder_sortable > li").not(".li_pagination").not(".page_break").size() <= 1) {
            $("#ui-dialog-title-dialog-warning").html("无法删除该题目");
            $("#dialog-warning-msg").html("您不能删除问卷中的所有元素 <br />您至少得保留一个问题.");
            $("#dialog-warning").dialog("open")
        } else {
            if (d.data("field_properties").type == "page_break") {
                d.data("field_properties").is_db_live = 0
            }
            if (d.data("field_properties").is_db_live == 0) {
                var c = d.html();
                var e = $("#form_header").data("form_properties").id;
                d.html('<img src="/GIedu/Public/plugins/forms/images/loader_small.gif" style="vertical-align: middle"/> deleting field ...').addClass("delete_processing");
                $.ajax({
                    type: "POST",
                    async: true,
                    url: "delete_draft_field.php",
                    data: {
                        form_id: e,
                        element_id: d.data("field_properties").id,
                        element_type: d.data("field_properties").type
                    },
                    cache: false,
                    global: true,
                    dataType: "json",
                    error: function(h, f, g) {
                        d.html(c).removeClass("delete_processing")
                    },
                    success: function(f) {
                        if (f.status == "ok") {
                            $("#li_" + f.element_id).fadeOut("normal",
                        function() {
                                $(this).remove();
                                reorganize_page_break();
                                $("#form_builder_sortable").sortable("refreshPositions")
                            });
                            active_element = null;
                            $("#selected_field_image").css("visibility", "hidden");
                            $("#bottom_bar_field_action").fadeOut("fast",
                        function() {
                                $("#bottom_bar_content").animate({
                                    "margin-left": "160px"
                                },
                                {
                                    duration: 200,
                                    queue: false
                                })
                            });
                            $("#builder_tabs").tabs("select", 0)
                        } else {
                            d.html(c).removeClass("delete_processing");
                            $("#dialog-message").dialog("open")
                        }
                    }
                })
            } else {
                $("#dialog-confirm-field-delete").dialog("open")
            }
        }
        return false
    });
    $("#bottom_bar").fadeIn();
    $("#editor_loading").fadeOut("slow");
    $(window).on("beforeunload",    function() {
        var c = b();
        return c
    });

    function b() {
        if ($(".form_editor").data("form_saved") === true) {
            return null
        } else {
            return "Your changes haven't been saved! \nLeaving this page will discard all changes."
        }
    }

    function a() {
        var c = $("#form_header").data("form_properties").id;
        $.ajax({
            type: "POST",
            async: true,
            url: "ping.php",
            data: {
                form_id: c
            },
            cache: false,
            global: true,
            dataType: "json",
            complete: function(d) {
                setTimeout(a, 300000)
            }
        })
    }
    window.setTimeout(a, 300000)
});
