// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: magic;

username = "";
password = "";

userdata={"username": username,"password":password};

login_url = "https://app.buaa.edu.cn/uc/wap/login/check";
info_url = "https://app.buaa.edu.cn/buaaxsncov/wap/default/get-info";
save_url = "https://app.buaa.edu.cn/buaaxsncov/wap/default/save";

notify = new Notification();
notify.title = "今日打卡";

function encode_formdata(obj){
    var str = [];
    for (var key in obj) {
         if (obj.hasOwnProperty(key)) {
               str.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]))                  
//                console.log(key + " -> " + obj[key]);
         }
    }
    return str.join("&");
};


async function check(){
    var req_login = new Request(login_url);
    req_login.headers = {"Content-Type":"application/x-www-form-urlencoded"};
    req_login.method = "POST";
    req_login.body = encode_formdata(userdata);
    await req_login.load();
    
    var resp = req_login.response;

    if(resp.statusCode != 200){
        console.log("login failed.");
        notify.body="登陆失败";
        return false;
    };
    console.log("login success!");
    var cookie = "";
    resp.cookies.forEach(element => {
        cookie = cookie+element["name"]+"="+element["value"]+"; "
    });
    
//     console.log(cookie);

    var req_info = new Request(info_url);
//     req_info.headers = {"Cookie": cookie};
    
    var info_data = await req_info.loadJSON();
    
    if(req_info.response.statusCode!=200){
        console.log("rediret failed.")
            notify.body="获取信息失败";
        return false;
    }
    
//     console.log(info_data)

    var save_data = {
"sfzs": "1", 
"bzxyy": "", "bzxyy_other": "", 
"brsfzc": "1", "tw": "", "sfcxzz": "", "zdjg": "", 
"zdjg_other": "", "sfgl": "", "gldd": "", 
"gldd_other": "", "glyy": "", "glyy_other": "", 
"gl_start": "", "gl_end": "", "sfmqjc": "", 
"sfzc_14": "1", "sfqw_14": "0", "sfqw_14_remark": "", 
"sfzgfx": "0", "sfzgfx_remark": "", 
"sfjc_14": "0", "sfjc_14_remark": "", "sfjcqz_14": "0", 
"sfjcqz_14_remark": "", "sfgtjz_14": "0", 
"sfgtjz_14_remark": "", "szsqqz": "0", "sfyqk": "", 
    "szdd": "1", "area": "北京市 海淀区", 
    "city": "北京市", "province": "北京市", 
    "address": "北京市海淀区花园路街道北京航空航天大学学生公寓13号楼北京航空航天大学学院路校区", 
    "gwdz": "", "is_move": "0", "move_reason": "", "move_remark": "", 
    "realname": "XX", "number": "XX", "uid": "XX", "created": "XX", 
    "date": "XX", "id": "XX"
    };

    save_data["realname"] = info_data["d"]["uinfo"]["realname"];
    save_data["number"] = info_data["d"]["uinfo"]["role"]["number"];
    save_data["uid"] = info_data["d"]["info"]["uid"];
    save_data["created"] = info_data["d"]["info"]["created"];
    save_data["date"] = info_data["d"]["info"]["date"];
    save_data["id"] = info_data["d"]["info"]["id"];

    var req_save = new Request(save_url);
    req_save.method = "POST";
//     req_save.headers = {"Cookie": cookie,"Content-Type":"application/x-www-form-urlencoded"};

    req_save.body = encode_formdata(save_data);
    var resp_json = await req_save.loadJSON();
    
    console.log(resp_json);
    notify.body=JSON.stringify(resp_json);
    return true;
};

await check();
notify.schedule();
Script.complete();