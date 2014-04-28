class @Require

  constructor: () ->
    @defined = {}
    @loaded = {}
    @dependences = {}

  createDef: (args) ->
    def = {
      name: null
      deps: []
      func: null
    }
    if Object.isString(args[0])
      def.name = args[0]
      if args.length == 2
        def.func = args[1]
      if args.length == 3
        def.deps = args[1]
        def.func = args[2]
    else if Object.isArray(args[0])
      def.deps = args[0]
      def.func = args[1]
    else if Object.isFunction(args[0])
      def.func = args[0]

    # validate
    valid = true
    valid = valid && (!(def.name?) || Object.isString(def.name))
    valid = valid && (Object.isArray(def.deps))
    valid = valid && (Object.isFunction(def.func))

    if !valid
      new Error("args is [name, func] or [name, deps, func], or [deps, func], or [func]")

    return def

  define: () ->
    def = @createDef(arguments)
    if def.name? && @defined[def.name]?
      throw new Error("define #{def.name} is duplicate. override define is $define function.")
    @$define.apply(@, arguments)
    return

  $define: () ->
    def = @createDef(arguments)
    @undefine(def.name) if @defined[def.name]?
    @defined[def.name] = def

    for dep in def.deps
      @dependences[dep] ?= {}
      @dependences[dep][def.name] = true

    return

  undefine: (name) ->
    @unload(name)
    define = @defined[name]
    delete @defined[name]
    for dep in define.deps
      delete @dependences[dep][name]
    return

  unload: (name) ->
    delete @loaded[name]
    deps = @dependences[name]
    if deps?
      for dep of deps
        delete @loaded[dep]
    return

  run: () ->
    if arguments.length < 1 || arguments.length > 2
      throw new Error("args is [func] or [deps, func]")

    def = @createDef(arguments)
    args = []
    for dep in def.deps
      args.push(@load(dep, def))

    return def.func.apply(null, args)

  load: (name, parent=null) ->

    return @ if name == "require"
    return @loaded[name] if (@loaded[name])

    define = @defined[name]
    if not(define?)
      msg = "#{name} is not defined."
      if (parent?)
        msg += "\n  name to [" + (parent.name) + "]"
        msg += "\n  deps to [#{parent.deps.toString()}]"
        msg += "\n  source to #{parent.func.toString()}"
      throw new Error(msg)

    args = []
    for dep in define.deps
      args.push(@load(dep, define))

    @loaded[name] = define.func.apply(null, args)
    return @loaded[name]

  clone: () ->
    require = new Require()
    require.defined = Object.clone(@defined)
    require.loaded = Object.clone(@loaded)
    require.dependences = Object.clone(@dependences)
    return require

require = new @Require()

@require = () ->
  return require.run.apply(require, arguments)

@require._ = require

@define = () ->
  require.define.apply(require, arguments)
  return

@$define = () ->
  require.$define.apply(require, arguments)
  return









