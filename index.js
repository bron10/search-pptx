const Hapi = require('hapi');
const fs = require('fs');
const path = require('path');
_   = require('lodash');
const toPdf = require("office-to-pdf")

let dictionary = require('./dictionary.json');
const dust = require('dustjs-linkedin');

const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

server.register(require('vision'), (err) => {
    //console.log("err", err)
    //Hoek.assert(!err, err);

    // server.views({
    //     engines: {
    //         html: require('dustjs-linkedin')
    //     },
    //     relativeTo: __dirname,
    //     path: 'templates'
    // });
    server.views({
      engines: { dust:  require('hapi-dust')},
      relativeTo: path.join(__dirname),
      path: 'templates'
      //partialsPath: 'path/to/partials',
      //helpersPath: 'path/to/helpers',
    })
});


//console.log("dictionary", dictionary);
// Add the route
server.route([{
    method: 'GET',
    path:'/', 
    handler: function (request, reply) {
            //reply.view('index');
        dust.render('dictionary', { dictionary}, function(err, out) {
            reply(out);
        });
        
    }
}, {
    method: 'GET',
    path:'/list/{encname}', 
    handler: function (request, reply) {
            //reply.view('index');request.params.encname
            let encname = request.params.encname;
            if(!encname){
                return reply("<h3>File name is incorrect</h2>");

            }

            let fileName  = new Buffer(encname, 'base64').toString()

            //console.log("getPPTPath(fileName)", getPPTPath(fileName));

            fs.stat(getPPTPath(fileName), function(err, stat) {
                if(err == null) {
                    
                } else
                    return reply("<h3>File doesnot exist</h3>")
            });
        
    }
}]);

createDictionary(function(){
    server.start((err) => {
        if (err) {
            throw err;
        }
        
        let preCompiledTemplateSrc = fs.readFileSync(getTemplatePath('index'), 'utf8');
        //dust.loadSource(list);
        dust.loadSource(dust.compile(preCompiledTemplateSrc, 'dictionary'));
        console.log('Server running at:', server.info.uri);
    });
})
// Start the server

function getTemplatePath(name){
    return path.join(__dirname, `templates/${name}.dust`)
}
function getPPTPath(name){
    return path.join(__dirname, `ppts/${name}`);
}

function createDictionary(onComplete) {
    fs.readdir(path.resolve(__dirname, 'ppts'), function(err, filenames) {

        _.each(filenames, function(filename){
            let encfilename = new Buffer(filename).toString('base64');
            var wordBuffer = fs.readFileSync(path.resolve(__dirname, `ppts/${filename}`))
            // toPdf(wordBuffer)
            // .then(
            //   (pdfBuffer) => {
            //     fs.writeFileSync(path.resolve(__dirname, `ppts/${encfilename}.pdf`), pdfBuffer)
            //   }, (err) => {
            //     console.log(err)
            //   }
            // )
            // .then(()=>{

            //     //Creating dictionary
            //     _.each(dictionary, function(datum){
            //         let alpha = _.lowerCase(datum.group);
            //         //console.log("alpha", alpha);
            //         let foundName = _.startsWith(filename, (alpha)) ? true : false;
            //         if(foundName)
            //             datum.list.push({
            //                 name : foundName,
            //                 enc : encfilename
            //             });

            //     })
            // })    
        })





            
            
            //console.log("dictionary", JSON.stringify(dictionary));
            onComplete();
            //reply(filenames);
    });
}


