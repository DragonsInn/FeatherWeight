var hprose = require("hprose");
var events = require("events");
var fs = require("fs");

function FeatherWeight(opt) {
    if(!(this instanceof FeatherWeight)) {
        return new FeatherWeight(opt);
    }

    // enable eventing
    events.EventEmitter.call(this);

    // Setting up properties
    this._store = {};
    this._instance = {};
    this.stats = {
        hits: 0,
        misses: 0
    };
    // The time that a value stays in the object.
    this._defaultTtl = opt.ttl || 60;
    // The interval, in seconds, in which "dead entries" are checked.
    this._interval = opt.interval || 10;

    if(opt.storeFile) this.storeFile = opt.storeFile;
    else throw new TypeError("You must set storeFile.");

    // It might be better to use an externalized cleaner. I.e. child_process.fork()
    this._interval_t = setInterval(function(){
        for(var prop in this._store) {
            var obj = this._store[prop];
            var expiresAt = new Date(Date.now()+obj.ttl);
            var now = new Date();
            if(now < expiresAt) {
                // This key is due.
                delete this._store[prop];
                this.emit("expired", prop, obj.value);
            }
        }
    }.bind(this), this._interval);
}

FeatherWeight.prototype.createServer = function(type, on, cb) {
    var server, kind;
    switch(type.toLowerCase()) {
        case "http":
            server = hprose.HttpServer;
            kind = "http";
        break;

        case "ws":
        case "websocket":
        case "websockets":
            server = hprose.WebSocketServer;
            kind = "ws";
        break;

        case "tcp":
        case "socket":
            server = hprose.TcpServer;
            kind = "tcp";
        break;

        case "unix":
            server = hprose.UnixServer;
            kind = "unix";
        break;

        default: throw new Error("Unknown type: "+type);
    }

    this._instance[kind] = new server();

    this._instance[kind].listen.call(this._instance[kind], on, cb);
}

FeatherWeight.prototype.set = function(key, data, ttl) {
    this._store[key] = {
        value: data,
        ttl: (typeof ttl != "undefined" ? Number(ttl) : this._defaultTtl),
        createdAt: new Date()
    }
}

FeatherWeight.prototype.get = function(keys) {
    var rt = {};
    var getter = function(key){
        if(typeof this.store[key] == "undefined") {
            this.stats.misses++;
            rt[key] = undefined;
        } else {
            this.stats.hits++;
            rt[key] = this.store[key].value;
        }
    }.bind(this);
    if(keys instanceof Array) {
        keys.forEach(getter);
        return rt;
    } else if(typeof keys == "string") {
        getter(keys);
        return rt[keys];
    }
};

FeatherWeight.prototype.purge = function(keys) {
    var deleter = function(key){
        if(typeof this.store[key] != "undefined") {
            delete this.store[key];
        }
    }.bind(this);
    if(keys instanceof Array) {
        keys.forEach(deleter);
        return rt;
    } else if(typeof keys == "string") {
        deleter(keys);
    }
};

FeatherWeight.prototype.run = function(cb) {
    // Initialize our methods on all servers, if any.
    if(Object.keys(this._instance).length == 0) {
        throw new Error("You have not created any server that this cache can bind to! use .createServer()");
    }

    for(var kind in this._instance) {
        var srv = this._instance[kind];
        // srv.addAsyncMethods(...);
    }
}
