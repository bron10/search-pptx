const Hapi = require('hapi');
const fs = require('fs');
const path = require('path');
_   = require('lodash');

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

// fs.readFile(path.join(__dirname, 'templates/index.html'), { encoding: 'utf8' }, function(err, data) {
//   dust.loadSource(data);
//   dust.render(templateName, {}, function(err, out) {
//     console.log(out);
//   });
// });

//console.log("dictionary", dictionary);
// Add the route
server.route({
    method: 'GET',
    path:'/', 
    handler: function (request, reply) {
            //reply.view('index');
        dust.render('dictionary', { dictionary}, function(err, out) {
            reply(out);
        });
        
    }
});

createDictionary(function(){
    server.start((err) => {
        if (err) {
            throw err;
        }
        
        let preCompiledTemplateSrc = fs.readFileSync(path.join(__dirname, 'templates/index.dust'), 'utf8');
        //dust.loadSource(list);
        dust.loadSource(dust.compile(preCompiledTemplateSrc, 'dictionary'));
        console.log('Server running at:', server.info.uri);
    });
})
// Start the server

function createDictionary(onComplete) {
    fs.readdir(path.resolve(__dirname, 'ppts'), function(err, filenames) {
            //let dictionary = {};
            _.each(dictionary, function(datum){
                let alpha = _.lowerCase(datum.group);
                console.log("alpha", alpha);
                let foundName = _.find(filenames, function(fileName){
                    if(_.startsWith(fileName, (alpha)))
                        return fileName;
                });
                if(foundName)
                    datum.list.push(foundName);

            })
            //console.log("dictionary", JSON.stringify(dictionary));
            onComplete();
            //reply(filenames);
    });
  //fs.readdir(path.resolve(__dirname, './ppts'), function(err, filenames) {
    // if (err) {
    //   onError(err);
    //   return;
    // }
    // filenames.forEach(function(filename) {
    //   fs.readFile(path.resolve(dirname, filename), 'utf-8', function(err, content) {
    //     if (err) {
    //       onError(err);
    //       return;
    //     }
    //     onFileContent(filename, content);
    //   });
    // });
  //});
}