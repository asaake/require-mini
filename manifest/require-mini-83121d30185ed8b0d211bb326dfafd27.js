(function() {
  var require;

  this.Require = (function() {
    function Require() {
      this.defines = {};
      this.loaded = {};
      this.dependences = {};
    }

    Require.prototype.define = function() {
      var name;
      name = arguments[0];
      if (this.defines[name] != null) {
        throw new Error("define " + name + " is duplicate. override define is $define function.");
      }
      this.$define.apply(this, arguments);
    };

    Require.prototype.$define = function() {
      var dep, deps, func, name, _base, _i, _len;
      if (arguments.length < 2 || arguments.length > 3) {
        throw new Error("args is [name, func] or [name, deps, func]");
      }
      switch (arguments.length) {
        case 2:
          name = arguments[0];
          func = arguments[1];
          deps = [];
          break;
        case 3:
          name = arguments[0];
          deps = arguments[1];
          func = arguments[2];
      }
      if (this.defines[name] != null) {
        this.undefine(name);
      }
      this.defines[name] = {
        name: name,
        deps: deps,
        func: func
      };
      for (_i = 0, _len = deps.length; _i < _len; _i++) {
        dep = deps[_i];
        if ((_base = this.dependences)[dep] == null) {
          _base[dep] = {};
        }
        this.dependences[dep][name] = true;
      }
    };

    Require.prototype.undefine = function(name) {
      var define, dep, _i, _len, _ref;
      this.unload(name);
      define = this.defines[name];
      delete this.defines[name];
      _ref = define.deps;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dep = _ref[_i];
        delete this.dependences[dep][name];
      }
    };

    Require.prototype.unload = function(name) {
      var dep, deps;
      delete this.loaded[name];
      deps = this.dependences[name];
      if (deps != null) {
        for (dep in deps) {
          delete this.loaded[dep];
        }
      }
    };

    Require.prototype.run = function() {
      var args, dep, deps, func, parent, _i, _len;
      if (arguments.length < 1 || arguments.length > 2) {
        throw new Error("args is [func] or [deps, func]");
      }
      switch (arguments.length) {
        case 1:
          func = arguments[0];
          deps = [];
          break;
        case 2:
          deps = arguments[0];
          func = arguments[1];
      }
      parent = {
        name: "require-run",
        deps: deps,
        func: func
      };
      args = [];
      for (_i = 0, _len = deps.length; _i < _len; _i++) {
        dep = deps[_i];
        args.push(this.load(dep, parent));
      }
      return func.apply(null, args);
    };

    Require.prototype.load = function(name, parent) {
      var args, define, dep, msg, _i, _len, _ref;
      if (parent == null) {
        parent = null;
      }
      if (name === "require") {
        return this;
      }
      if (this.loaded[name]) {
        return this.loaded[name];
      }
      define = this.defines[name];
      if (!(define != null)) {
        msg = "" + name + " is not defined.";
        if ((parent != null)) {
          msg += "\n  deps to [" + (parent.deps.toString()) + "]";
          msg += "\n  source to " + (parent.func.toString());
        }
        throw new Error(msg);
      }
      args = [];
      _ref = define.deps;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dep = _ref[_i];
        args.push(this.load(dep, define));
      }
      this.loaded[name] = define.func.apply(null, args);
      return this.loaded[name];
    };

    Require.prototype.clone = function() {
      var require;
      require = new Require();
      require.defines = Object.clone(this.defines);
      require.loaded = Object.clone(this.loaded);
      require.dependences = Object.clone(this.dependences);
      return require;
    };

    return Require;

  })();

  require = new this.Require();

  this.require = function() {
    return require.run.apply(require, arguments);
  };

  this.require._ = require;

  this.define = function() {
    require.define.apply(require, arguments);
  };

  this.$define = function() {
    require.$define.apply(require, arguments);
  };

}).call(this);(function() {
  define("mocker", ["require"], function(require) {
    var Mocker;
    return Mocker = (function() {
      function Mocker() {
        this.require = require.clone();
        this.unload();
      }

      Mocker.prototype.unload = function() {
        var name, _results;
        _results = [];
        for (name in this.require.loaded) {
          _results.push(this.require.unload(name));
        }
        return _results;
      };

      Mocker.prototype.mock = function() {
        return this.require.$define.apply(this.require, arguments);
      };

      Mocker.prototype.run = function() {
        this.require.run.apply(this.require, arguments);
        return this.unload();
      };

      return Mocker;

    })();
  });

}).call(this);(function() {


}).call(this);