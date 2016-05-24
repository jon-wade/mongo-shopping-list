var Item = require('../models/item');

exports.save = function(name, callback, errback) {
    Item.create({ name: name }, function(err, item) {
        //console.log(item);
        if (err) {
            errback(err);
            return;
        }
        callback(item);
    });
};

exports.list = function(callback, errback) {
    Item.find(function(err, items) {
        if (err) {
            errback(err);
            return;
        }
        callback(items);
    });
};

exports.del = function(itemId, callback, errback) {
    //console.log(itemId);
    Item.findOneAndRemove({'_id': itemId}, function(err, item){
        if (err) {
            errback(err);
            return;
        }
        callback(item);
    })
};

exports.update = function(itemId, name, callback, errback) {
    //console.log('Update itemId =', itemId);
    Item.findOneAndUpdate({'_id': itemId}, {'name': name}, function(err, item){
        if (err) {
            errback(err);
            return;
        }
        callback(item);
    })
};