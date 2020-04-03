var coordinates;
var whitelist;
var custom;
var commands;
var checkbox;
var calc;
var copy;
var input_tip;
var copy_tip;
var input_tip_thread;
var copy_tip_thread;

window.onload = function () {
    coordinates = document.getElementById("input_form").getElementsByTagName("input");
    whitelist = document.getElementById("whitelist");
    custom = document.getElementById("custom");
    calc = document.getElementById("calc");
    let outputs = document.getElementById("output_list").getElementsByTagName("input");
    commands = [outputs[0], outputs[2], outputs[4], outputs[6], outputs[8]];
    checkbox = document.getElementsByClassName("check");
    copy = [outputs[1], outputs[3], outputs[5], outputs[7], outputs[9]];
    input_tip = document.getElementById("input_tip");
    copy_tip = document.getElementById("copy_tip");
};

function calc_click() {
    for (let i = 0; i < 4; i++)
        if (coordinates[i].value === "" || coordinates[i].value % 1 !== 0 || coordinates[i].value < -30000000 || coordinates[i].value > 30000000) {
            input_tip_set(0, "生成失败，坐标必填且必须为整数！");
            for (let i = 0; i < 5; i++)
                commands[i].value = "";
            return;
        }

    let start_x;
    let start_z;
    let dx;
    let dz;
    let wl;
    let cstm="";
    let out_mode = document.input.out_mode.value;
    let in_mode = document.input.in_mode.value;
    let command_wl = "";
    //获取起始x坐标
    if (parseInt(coordinates[0].value) < parseInt(coordinates[2].value))
        start_x = parseInt(coordinates[0].value);
    else
        start_x = parseInt(coordinates[2].value);
    //获取起始z坐标
    if (parseInt(coordinates[1].value) < parseInt(coordinates[3].value))
        start_z = parseInt(coordinates[1].value);
    else
        start_z = parseInt(coordinates[3].value);
    //获取增量
    dx = Math.abs(coordinates[0].value - coordinates[2].value);
    dz = Math.abs(coordinates[1].value - coordinates[3].value);

    //处理白名单
    wl = whitelist.value.split("，").join(",").split(",");
    if (wl.length !== 0)
        for (let i = 0; i < wl.length; i++)
            if (wl[i] !== "")
                command_wl += (',name=!"' + wl[i] + '"');

    if(custom.value!=="")
        cstm=","+custom.value;

    commands[0].value = "/gamemode " + in_mode + " @e[type=player,x=" + start_x + ",y=0,z=" + start_z + ",dx=" + dx + ",dy=65535,dz=" + dz + ",m=!" + in_mode + command_wl + cstm + "]";
    commands[1].value = "/gamemode " + out_mode + " @e[type=player,x=" + (parseInt(start_x) - 1).toString() + ",y=0,z=" + (parseInt(start_z) - 1).toString() + ",dx=0,dy=65535,dz=" + (parseInt(dz) + 1).toString() + ",m=!" + out_mode + command_wl + cstm + "]";
    commands[2].value = "/gamemode " + out_mode + " @e[type=player,x=" + start_x + ",y=0,z=" + (parseInt(start_z) - 1).toString() + ",dx=" + (parseInt(dx) + 1).toString() + ",dy=65535,dz=0,m=!" + out_mode + command_wl + cstm + "]";
    commands[3].value = "/gamemode " + out_mode + " @e[type=player,x=" + (parseInt(start_x) + dx + 1).toString() + ",y=0,z=" + start_z + ",dx=0,dy=65535,dz=" + (parseInt(dz) + 1).toString() + ",m=!" + out_mode + command_wl + cstm + "]";
    commands[4].value = "/gamemode " + out_mode + " @e[type=player,x=" + start_x + ",y=0,z=" + (parseInt(start_z) + dz + 1).toString() + ",dx=" + (parseInt(dx) + 1).toString() + ",dy=65535,dz=0,m=!" + out_mode + command_wl + cstm + "]";

    input_tip_set(1, "生成成功！");
}

function copy_click(me) {
    let text = me.previousElementSibling;
    if (text.value === "") {
        text.previousElementSibling.innerHTML.replace(/\s*/g, "");
        copy_tip_set(0, "无法复制，内容为空！");
        return;
    }
    text.select();
    document.execCommand("Copy");
    copy_tip_set(1, text.previousElementSibling.innerHTML.replace(/\s*/g, "") + "已复制！");
}

function reset_click() {
    for (let i = 0; i < 4; i++)
        coordinates[i].value = "";
    whitelist.value = "";
    custom.value = "";
    for (let i = 0; i < 5; i++)
        commands[i].value = "";
    for (let i = 0; i < 6; i++)
        checkbox[i].checked = false;
    checkbox[0].checked = true;
    checkbox[5].checked = true;
    input_tip_set(1, "内容已重置！");
}

function input_tip_set(val, str) {
    clearTimeout(input_tip_thread);
    if (val === 0)
        input_tip.setAttribute("class", "input_tip_no");
    else
        input_tip.setAttribute("class", "input_tip_yes");

    input_tip.innerText = str;
    input_tip_thread = self.setTimeout(function () {
        input_tip.innerHTML = "";
        input_tip.append(document.createElement("br"));
    }, 3000);
}

function copy_tip_set(val, str) {
    clearTimeout(copy_tip_thread);
    if (val === 0)
        copy_tip.setAttribute("class", "copy_tip_no");
    else
        copy_tip.setAttribute("class", "copy_tip_yes");
    copy_tip.innerText = str;
    copy_tip_thread = self.setTimeout(function () {
        copy_tip.innerHTML = "";
        copy_tip.append(document.createElement("br"));
    }, 3000);
}
