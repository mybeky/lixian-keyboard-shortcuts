// ==UserScript==
// @name           Xunlei Lixian Keyboard Shortcuts
// @namespace      mybeky
// @include        http://dynamic.cloud.vip.xunlei.com/*
// ==/UserScript==

(function () {
    var unsafe = window;
    try {
        unsafe = unsafeWindow;
    } catch (e) {
    }

    var $ = unsafe.$;

    if (!$) return;

    GM_addStyle('div.rw_focus {border-left: 2px solid #4D90F0; background-position: -2px bottom !important;}' + 
                'div.rw_focus div.rw_inter {margin-left: -2px;}' + 
                'div.rwli_focus {border-left: 2px solid #4D90F0; background-position: -2px bottom !important;}');

    var NORMAL_MODE = 'normal-mode';
    var SELECTION_MODE = 'selection-mode';
    var NAVIGATION_MODE = 'navigation-mode';

    var mode = NORMAL_MODE;
    var in_bt_list = false;
    var current_focused_task = null;
    var last_focused_task = null;

    var task_list_box = $('div#rowbox_list');
    var task_list = $('div#rowbox_list div.rw_list');
    var bt_list_box;
    var bt_list;
    var nav_links = $('div.side_nav ul.lx_ul a');
    var nav_all_link = nav_links.eq(0);
    var nav_downloading_link = nav_links.eq(1);
    var nav_downloaded_link = nav_links.eq(2);
    var nav_expired_link = nav_links.eq(3);
    var nav_trash_link = nav_links.eq(4);

    var nav_lixian_link = $('div.side_nav h2').eq(0).find('a');
    var nav_cloud_link = $('div.side_nav h2').eq(1).find('a');
    var nav_storage_link = $('div.side_nav h2').eq(2).find('a');

    var pause_all_link = $('a#li_task_pause');
    var start_all_link = $('a#li_task_start');
    var new_link = $('a.sit_new');
    var back_link;

    var focus_task = function (task) {
        if (current_focused_task) {
            current_focused_task.removeClass('rw_focus');
            current_focused_task.find('.rwset').hide();
        };

        task.find('.rwset').show();

        var list_box;
        if (in_bt_list) {
            list_box = bt_list_box;
        } else{
            list_box = task_list_box;
        };

        var pos = task.position();
        var h = task.outerHeight(true);
        var diff_top = pos.top;
        var diff_bottom = pos.top + h - list_box.height();

        if (diff_top < 0) {
            list_box.scrollTop(list_box.scrollTop() + diff_top);
        } else if (diff_bottom > 0) {
            list_box.scrollTop(list_box.scrollTop() + diff_bottom);
        }

        current_focused_task = task;
        current_focused_task.addClass('rw_focus');
    };

    var back_to_list = function () {
        if (!back_link)
            back_link = $('div#view_bt_list_nav em.icback').parents('a.btn_m');
        back_link.click();
        in_bt_list = false;
        if (last_focused_task) {
            focus_task(last_focused_task);
        };
    };

    var reverse_checkbox = function (checkbox) {
        if (checkbox.attr('checked')) {
            checkbox.attr('checked', false);
        } else {
            checkbox.attr('checked', true);
        }
    };

    var click_checkbox = function (checkbox) {
        if (checkbox.length) {
            // reverse_checkbox(checkbox);
            checkbox[0].click();
            // reverse_checkbox(checkbox);
        }
    };

    var scroll_to_top = function () {
        if (in_bt_list) {
            bt_list_box.scrollTop(0);
            focus_task(bt_list.first());
        } else {
            task_list_box.scrollTop(0);
            focus_task(task_list.first());
        };
    };

    var scroll_to_bottom = function () {
        if (in_bt_list) {
            bt_list_box.scrollTop(bt_list_box[0].scrollHeight);
            focus_task(bt_list.last());
        } else {
            task_list_box.scrollTop(task_list[0].scrollHeight);
            focus_task(task_list.last());
        };
    };

    var is_task_selected = function (task) {
        return task.find('input[name=ck]').attr('checked');
    };

    var select_task = function (task) {
        current_focused_task.addClass('rw_bg');
        task.find('input[name=ck]').attr('checked', true);
    };

    var deselect_task = function (task) {
        current_focused_task.removeClass('rw_bg');
        task.find('input[name=ck]').attr('checked', false);
    };

    var select_all = function () {
        var ck = $('input[name=ckbutton]');
        if (!ck.attr('checked'))
            click_checkbox(ck);
    };

    var select_none = function () {
        var ck = $('input[name=ckbutton]');
        if (!ck.attr('checked'))
            click_checkbox(ck);
        click_checkbox(ck);
    };

    var reverse_selection_task = function (task) {
        var checkbox_selector = 'input[name=ck]';
        if (in_bt_list) {
            checkbox_selector = 'input[name=bt_list_ck]';
        }
        click_checkbox(task.find(checkbox_selector));
        if (task.find(checkbox_selector).attr('checked')) {
            current_focused_task.addClass('rw_bg');
        } else {
            current_focused_task.removeClass('rw_bg');
        }
    };

    var delete_tasks = function () {
        var delete_link = $('a#li_task_del');
        if (delete_link.length && !delete_link.hasClass('noit')) {
            delete_link.click();
        } else {
            delete_link = $('a#history_nav_delete');
            if (!delete_link.length) {
                delete_link = current_focused_task.find('a[cmd=del]');
            }
            delete_link.click();
        }
    };

    var download_tasks = function () {
        var download_link = current_focused_task.find('a.ic_redownloca');
        if (download_link.length) {
            download_link.click();
        } else {
            download_link = current_focused_task.find('a.ic_redown');
            download_link.click();
        }
    };

    var pause_tasks = function () {
        if (!pause_all_link.length) {
            return;
        }
        if (pause_all_link.hasClass('noit')) {
            current_focused_task.find('a[cmd=pause]').click();
        } else {
            pause_all_link.click();
        }
    };

    var start_tasks = function () {
        if (!start_all_link.length) {
            return;
        }
        if (start_all_link.hasClass('noit')) {
            current_focused_task.find('a[cmd=start]').click();
        } else {
            start_all_link.click();
        }
    };

    var new_task = function () {
        new_link.click();
    };

    if (task_list.length) {
        focus_task(task_list.first());
    };

    task_list.click(function () {
        focus_task($(this));
    });

    var old_fill_bt_list = unsafe.fill_bt_list;
    unsafe.fill_bt_list = function () {
        old_fill_bt_list.apply(this, arguments);
        in_bt_list = true;
        bt_list_box = $('div#rwbox_bt_list');
        bt_list = $('div#rwbox_bt_list div.rw_list');
        last_focused_task = current_focused_task;
        scroll_to_top();
    };

    $(document).keydown(function (e) {
        if (e.shiftKey || e.altKey || e.ctrlKey) {
            var keyCodes = [56, 71]; // *,G
            if (keyCodes.indexOf(e.keyCode) == -1) {
                return;
            }
        }
        var popup = $('div.pop_rwbox:visible');
        if (popup.length) {
            switch (e.keyCode) {

                case 13: //enter
                    $('button#down_but').click();
                    break;

                case 27: //esc
                    popup.find('a.close').click();
                    break;

                default:
                    break;
            }
            mode = NORMAL_MODE;
            return;
        }

        if (mode == SELECTION_MODE) {
            switch (e.keyCode) {

                case 65: //*,a
                    select_all();
                    break;

                case 78: //*,n
                    select_none();
                    break;

                default:
                    break;
            }
            mode = NORMAL_MODE;
            return;
        }

        if (mode == NAVIGATION_MODE) {
            var link;
            switch(e.keyCode) {

                case 49: //g,1
                    link = nav_lixian_link;
                    break;

                case 50: //g,2
                    link = nav_cloud_link;
                    break;

                case 51: //g,3
                    link = nav_storage_link;
                    break;

                case 65: //g,a
                    link = nav_all_link;
                    break;

                case 67: //g,c
                    link = nav_downloading_link;
                    break;

                case 68: //g,d
                    link = nav_downloaded_link;
                    break;

                case 69: //g,e
                    link = nav_expired_link;
                    break;

                case 71: //g,g
                    scroll_to_top();
                    break;

                case 84: //g,t
                    link = nav_trash_link;
                    break;

                default:
                    break;
            }

            if (link && link.length) {
                link.click();
                location.href = link.attr('href');
            }

            mode = NORMAL_MODE;
            return;
        }

        switch(e.keyCode) {

            case 56: //8
                if (e.shiftKey) {
                    mode = SELECTION_MODE;
                }
                break;

            case 68: //d
                download_tasks();
                break;

            case 69: //e
                delete_tasks();
                break;

            case 71: //g
                if (e.shiftKey) {
                    scroll_to_bottom();
                } else {
                    mode = NAVIGATION_MODE;
                }
                break;

            case 74: //j
                if (current_focused_task) {
                    var next_task = current_focused_task.nextAll('div.rw_list').eq(0);
                    if (next_task.length) {
                        focus_task(next_task);
                    }
                }
                break;
            
            case 75: //k
                if (current_focused_task) {
                    var prev_task = current_focused_task.prevAll('div.rw_list').eq(0);
                    if (prev_task.length) {
                        focus_task(prev_task);
                    }
                }
                break;

            case 67: //c
            case 78: //n
                new_task();
                break;

            case 79: //o
                if (current_focused_task) {
                    var open_link = current_focused_task.find('a.ic_open, a.link_yuntxt, a.ic_openimg');
                    if (open_link.length) {
                        open_link.click();
                    };
                }
                break;

            case 80: //p
                pause_tasks();
                break;

            case 83: //s
                start_tasks();
                break;

            case 85: //u
                back_to_list();
                break;

            case 88: //x
                reverse_selection_task(current_focused_task);
                break;

            default:
                break;
        }
    });
})();
