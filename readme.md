Mongo Namespace : monsget / monsput
========

The idea is to treat the whole of mongo datastore as a single namespaced heirarchy,
where each piece of json can be addressed via a path.

so all data can be addressed like : project.database.collection.objectid.property.arry.item.attribute.value

This makes it easier to do shell scripting tasks with data,
and can also be a nice interface to use within node.js programs.

Alpha status as of 2011.10


Paths :
========

database.collection._id.document.nested.attribute.array.N.value


Usage :
========

    mons{get|put} jsonpath > doc.json

    monsget mongo_db.mongo_collection.json_doc_id.this.that.thother.array.N.property > doc.json

    monsget database                                // list collections in that database

    monsget database.collection.docid.array.23      // show 23'rd item in that array


Path Examples :
========

    monsput geo.country.usa.state.california.BeverleyHills.PostCode < "90210"

    monsget geo.country.usa.state.california > calidata.json

    monsget contacts.melissa.DOB


Todo
========

    monsput :)
   
    jsonpath-like searches  / regexen


Author
========

    gord@lokenote.com


Licence 
========

    copyright (c) gordon anderson

    released under BSD Licence
