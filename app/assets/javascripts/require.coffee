class @Require

  constructor: () ->
    @defines = {}
    @loaded = {}
    @dependences = {}

  define: () ->
    name = arguments[0]
    if @defines[name]?
      throw new Error("define #{name} is duplicate. override define is $define function.")
    @$define.apply(@, arguments)
    return

  $define: () ->
    if arguments.length < 2 || arguments.length > 3
      throw new Error("args is [name, func] or [name, deps, func]")

    switch arguments.length
      when 2
        name = arguments[0]
        func = arguments[1]
        deps = []
      when 3
        name = arguments[0]
        deps = arguments[1]
        func = arguments[2]

    @undefine(name) if @defines[name]?
    @defines[name] = {
      name: name
      deps: deps
      func: func
    }

    for dep in deps
      @dependences[dep] ?= {}
      @dependences[dep][name] = true

    return

  undefine: (name) ->
    @unload(name)
    define = @defines[name]
    delete @defines[name]
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

    switch arguments.length
      when 1
        func = arguments[0]
        deps = []
      when 2
        deps = arguments[0]
        func = arguments[1]

    parent = {
      name: "require-run"
      deps: deps
      func: func
    }
    args = []
    for dep in deps
      args.push(@load(dep, parent))

    return func.apply(null, args)

  load: (name, parent=null) ->

    return @ if name == "require"
    return @loaded[name] if (@loaded[name])

    define = @defines[name]
    if not(define?)
      msg = "#{name} is not defined."
      if (parent?)
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
    require.defines = Object.clone(@defines)
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









