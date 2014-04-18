define "mocker", [
  "require"
], (
  require
) ->

  class Mocker

    constructor: () ->
      @require = require.clone()
      @unload()

    unload: () ->
      for name of @require.loaded
        @require.unload(name)

    mock: () ->
      @require.$define.apply(@require, arguments)

    run: () ->
      @require.run.apply(@require, arguments)
      @unload()

