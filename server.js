const express= require('express');
const app= express();
const fs= require('fs');
const path= require('path');
const PORT =3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

const messagesFile= path.join(__dirname,'messages.json');
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,'/public/login.html'))
});

app.post('/login',(req,res)=>{
    const {username}= req.body;
    res.redirect(`/?username=${username}`);
});

app.get('/',(req,res)=>{
    res.sendFile((path.join(__dirname,"public/index.html")));

})
app.post('/send-message',(req,res)=>{
    const {username,message}= req.body;

    fs.readFile(messagesFile,(err,data)=>{
        let messageText= [];
        if(!err){
            messageText=JSON.parse(data);
        }
        messageText.push({username,message});
        
        fs.writeFile(messagesFile,JSON.stringify(messageText,null,2),(err)=>{
            if(err){
                return res.status(500).send('Error saving message');
                
            }
            res.status(200).send('Message saved');
        });
    });
});

app.get('/messages',(req,res)=>{
    fs.readFile(messagesFile,(err,data)=>{
        if(err){
            return res.status(500).send("Error reading message");

        }
        res.json(JSON.parse(data));
    });
})

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});