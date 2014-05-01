(function() {
  var require;

  this.Require = (function() {
    function Require() {
      this.defined = {};
      this.loaded = {};
      this.dependences = {};
    }

    Require.prototype.createDef = function(args) {
      var def, valid;
      def = {
        name: null,
        deps: [],
        func: null
      };
      if (Object.isString(args[0])) {
        def.name = args[0];
        if (args.length === 2) {
          def.func = args[1];
        }
        if (args.length === 3) {
          def.deps = args[1];
          def.func = args[2];
        }
      } else if (Object.isArray(args[0])) {
        def.deps = args[0];
        def.func = args[1];
      } else if (Object.isFunction(args[0])) {
        def.func = args[0];
      }
      valid = true;
      valid = valid && (!(def.name != null) || Object.isString(def.name));
      valid = valid && (Object.isArray(def.deps));
      valid = valid && (Object.isFunction(def.func));
      if (!valid) {
        new Error("args is [name, func] or [name, deps, func], or [deps, func], or [func]");
      }
      return def;
    };

    Require.prototype.define = function() {
      var def;
      def = this.createDef(arguments);
      if ((def.name != null) && (this.defined[def.name] != null)) {
        throw new Error("define " + def.name + " is duplicate. override define is $define function.");
      }
      this.$define.apply(this, arguments);
    };

    Require.prototype.$define = function() {
      var def, dep, _base, _i, _len, _ref;
      def = this.createDef(arguments);
      if (this.defined[def.name] != null) {
        this.undefine(def.name);
      }
      this.defined[def.name] = def;
      _ref = def.deps;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dep = _ref[_i];
        if ((_base = this.dependences)[dep] == null) {
          _base[dep] = {};
        }
        this.dependences[dep][def.name] = true;
      }
    };

    Require.prototype.undefine = function(name) {
      var define, dep, _i, _len, _ref;
      this.unload(name);
      define = this.defined[name];
      delete this.defined[name];
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
      var args, def, dep, _i, _len, _ref;
      if (arguments.length < 1 || arguments.length > 2) {
        throw new Error("args is [func] or [deps, func]");
      }
      def = this.createDef(arguments);
      args = [];
      _ref = def.deps;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dep = _ref[_i];
        args.push(this.load(dep, def));
      }
      return def.func.apply(null, args);
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
      define = this.defined[name];
      if (!(define != null)) {
        msg = "" + name + " is not defined.";
        if ((parent != null)) {
          msg += "\n  name to [" + parent.name + "]";
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
      require.defined = Object.clone(this.defined);
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
/*# sourceMappingURL=require-mini.js.map */