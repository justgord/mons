var sys         = require('sys');
var test        = require('assert');
var serialq     = require('serialq');
var mongo       = require('mongodb');


var _host   = 'localhost';
var _port   = 27017;


function mons_get(spath, callback)
{
    // get mongo data with path : database.collection.document_id.this.that.other

    function showerr(err)
    {
        sys.log('ERROR: '+sys.inspect(err));
        if (client)
            client.close();
        process.exit(-1);
    }

    function onresult(data)
    {
        if (client)
            client.close();

        callback(data); 
    }

    function descend(tree, pth)
    {
        var dir = pth.shift(); 
        if (!dir || !tree)
            return tree;

        if (tree instanceof Array) 
        {
            var n = parseInt(dir);
            sub = tree[n]; 
            return descend(sub, pth); 
        }

        var sub = tree[dir];
        if (pth.length==0)
           return sub;

        return descend(sub, pth); 
    }

    function descend_colln()
    {
        db.collection(scolln, function(err, coll) {

            if (err) 
                return onresult();

            var match = {};
            if (sid)
                match = {_id:sid};

            coll.find(match, {'limit':5000 }, function(err, cursor) {

                if (err) 
                    return onresult();

                cursor.toArray(function(err, items) {          

                    if (err) 
                    {
                        sys.log('ERROR:toArray: '+err);
                        return onresult();
                    }

                    var d = items;
                    if (items.length && items.length==1)
                        d = items[0];

                    var ob = descend(d, path);

                    onresult(ob);
                });
            });
        });
    }

    function list_colls()
    {
        db.collections(function(err, colls) {

            if (err) 
                return showerr(err);

            var mycolls=[]; 
            colls.forEach(function(coll) {          
                var scoll = coll.collectionName;
                if (scoll!='system.indexes')            //HACK :]
                    mycolls.push(scoll);
            });

            onresult(mycolls);
        });
    }

    function descend_db()
    {
        client = new mongo.Db(sdb, new mongo.Server(_host, _port, {auto_reconnect: true, poolSize: 1}), {});

        client.open(function(err, mdb) {
            if (err) 
                return showerr(err);

            db = mdb;
            if (scolln)
                descend_colln();
            else
                list_colls();
        });
    }

    var client;
    var db;
    var tree;

    var path    = spath.split('.');

    var sdb     = path.shift();
    var scolln  = path.shift();
    var sid     = path.shift();

    descend_db();
}


exports.get             = mons_get;
