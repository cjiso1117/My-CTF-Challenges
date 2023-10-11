const app = require('express')()
const fetch = require('node-fetch')

app.get('/', (req, res)=>{
    res.send(process.env.FLAG)
})

app.post('/haas', async (req, res) =>{
    let task = {
        url: req.query.url,
        status: req.query.status,
    }  
    try{
        let res =  await fetch(task.url,{timeout:2000})
        console.log(res)
        if(res.status != task.status){
            let errmsg = {text: await res.text(), expected: task.status, actual: res.status}
            let err = new Error('Failed')
            err.detail = errmsg
            throw err
        } 
    }catch(e){
        console.log('failed')
        console.log(e)
        return res.json({msg:e.message, detail: e.detail})
    }
    return res.json('Alive')
})


app.listen(80)
