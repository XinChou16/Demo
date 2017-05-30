
var express  = require('express');

var app = express();

app.get('/',function(req,res){
    res.send('success');
});

// app.set('title','Mytitle');
// 托管静态文件
app.use(express.static('public'));

app.listen(8000);
console.log('running');