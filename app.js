/**
 * Created by 刘永明 on 2017/9/11.
 */
var fs = require('fs');
var http = require('http');
var URL = require('url');
function setdb(fn,msg_) {
    fs.readFile('db_.json', 'utf8', function(err, data){
        // console.log()
        var file = JSON.parse(data);
        // console.log(msg_)
        file.push(
            {
                "sum" : file[file.length - 1].sum + 1,
                "time" : new Date(),
                "msg":msg_?msg_:""
            }
        )
        JSON.parse(data).push()
        var msg =
            ++data
        fs.writeFile('db_.json',JSON.stringify(file),{flag:'w',encoding:'utf-8',mode:'0666'},function(err){
            if(err){
                console.log("文件写入失败");

            }else{
                console.log("文件写入成功"+new Date());
                if(fn){fn(file)}

            }

        })
    });
}

var server = http.createServer(function (req, res) {
    //如果你发一个GET到http://127.0.0.1:9000/test
    var url_info = require('url').parse(req.url, true);
    var qiery = URL.parse(req.url).query
    //检查是不是给/test的request
    if (url_info.pathname === '/test') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        setdb(function (data) {
            res.end("callback("+JSON.stringify({
                "flag" :"yes",
                "data" :data,

            }) + ")"
            );
        },GetHref('type',req.url))

    } else if(url_info.pathname === '/get'){ //读取不写入
        res.writeHead(200, {'Content-Type': 'text/plain'});
        fs.readFile('db_.json', 'utf8', function(err, data){

            res.end(data)
        })


    }else{
        req.pipe(res);
    }
});

function GetHref(sArgName,href){
    let sHref =  href ;
    // console.log(sHref)
    let args = sHref.split("?");

    let retval = "";
    if(args[0] == sHref) /*参数为空*/
    {
        return retval; /*无需做任何处理*/
    }
    let str = args[1];
    args = str.split("&");
    for(let i = 0; i < args.length; i ++)
    {
        str = args[i];
        let arg = str.split("=");
        if(arg.length <= 1) continue;
        if(arg[0] == sArgName) retval = arg[1];
    }
    return retval;
}
server.listen(3000);

console.log('listening on port  3000');

