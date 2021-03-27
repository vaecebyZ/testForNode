const fs = require('fs')
const conn = require('./conn')
const template = require('art-template')
const moment = require('moment')

template.defaults.root = './'

module.exports = (req, res) => {

    let url = new URL('http://localhost'+req.url)

    let urls = url.pathname


    if (req.method == 'GET') {

        if ( urls == '/') {

            conn.connect('select * from users', () => {
                // console.log(conn.result);
                let result = conn.result

                if (result.err == null) {

                    result.data.forEach(e => {
                        e.date = moment(e.date).format('YYYY-MM-DD hh:mm:ss')
                    })

                    let htmls = template('./viwes/index.html', {
                        value: result.data
                    })

                    res.end(htmls)
                }
            })

        } else if ( urls == "/add") {

            let htmls = template('./viwes/edit.html', {
                value: '{}'
            })

            res.end(htmls)

            //console.log(url);

        }else if ( urls == "/edit") {
            
           let userId =  url.searchParams.get('id') 
           
            if(userId!=null){
                conn.connect('select * from users where userId = '+userId,()=>{
                    let result = conn.result

                    if (result.err == null) {

                        result.data.forEach(e => {
                            e.date = moment(e.date).format('YYYY-MM-DD hh:mm:ss')
                        })
    
                        let htmls = template('./viwes/edit.html', {
                            value: result.data
                        })
    
                        res.end(htmls)
                    }
                })
               // console.log(url.searchParams.get('id'));
            }
           // console.log(url);
        } else if ( urls== "/search") {
            console.log(url);
        } else {
            fs.readFile('.' + urls, (err, data) => {
                if (err) throw err
                res.end(data)
            })
        }

    }else if (req.method =='POST'){
        if(urls=="/edit"){
           console.log(req);
           res.end(JSON.stringify('edit post'))
        }
       
    }else{
        res.end(JSON.stringify('下次一定'))
    }

}