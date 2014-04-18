#= require require

describe "Require", () ->

  beforeEach () ->
    @require = new Require()

  afterEach () ->
    delete @require

  it "requireの関数が存在する", () ->
    expect(require).to.ok()

  it "defineの関数が存在する", () ->
    expect(define).to.ok()

  it "$defineの関数が存在する", () ->
    expect($define).to.ok()

  it "define: 関数の定義ができる", () ->
    @require.define("define", {})
    define = @require.defines["define"]
    expect(define.name).to.eql("define")
    expect(define.func).to.eql({})
    expect(define.deps).to.eql([])

  it "define: 既に関数定義があるものに対して、もう一度関数定義を行うと例外を発生させる", () ->
    @require.define("define", () -> {})
    try
      @require.define("define", () -> {})
      fail("not error")
    catch e
      expect(e.message).to.eql("define define is duplicate. override define is $define function.")

  it "load: 定義から関数の結果を取り出せる", () ->
    @require.define("define", () -> "define")
    loaded = @require.load("define")
    expect(loaded).to.eql("define")

  it "load: 定義がない場合は例外を発生させる", () ->
    try
      @require.load("define")
      fail("not error")
    catch e
      expect(e.message).to.eql("define is not defined.")

  it "load: 定義がない場合で、親定義を引き渡した場合は詳細なメッセージを作成する", () ->
    try
      parent = {
        name: "test"
        deps: ["define"]
        func: (define) -> define
      }
      @require.load("define", parent)
      fail("not error")
    catch e
      expect(e.message).to.eql("""
        define is not defined.
          deps to [#{parent.deps.toString()}]
          source to #{parent.func.toString()}
      """)

  it "run: 関数を実行できる", (done) ->
    @require.run () ->
      expect(true).to.ok()
      done()

  it "run: 定義した関数を実行できる", () ->
    @require.define("define", () -> "define")
    @require.run ["define"], (define) ->
      expect(define).to.eql("define")

  it "run: 依存する関数の定義を実行できる", () ->
    @require.define("item1", () -> "item1")
    @require.define("item2", () -> "item2")
    @require.define("box", ["item1", "item2"], (item1, item2) -> {items: [item1, item2]})
    expect(@require.dependences["item1"]["box"]).to.ok()
    expect(@require.dependences["item2"]["box"]).to.ok()

    @require.run ["box"], (box) ->
      expect(box.items[0]).to.eql("item1")
      expect(box.items[1]).to.eql("item2")

  it "unload: 依存している定義が削除された場合に、依存先のロード済みが削除され、再ロード対象となる", () ->
    @require.define("item1", () -> "item1")
    @require.define("item2", () -> "item2")
    @require.define("box", ["item1", "item2"], (item1, item2) -> {items: [item1, item2]})
    @require.load("box")
    expect(@require.loaded["box"]).to.ok()

    @require.unload("item1")
    expect(@require.loaded["box"]).to.not.ok()

  it "unload: 依存している定義が削除された場合に、依存とは関係ない定義はそのままとなる", () ->
    @require.define("item1", () -> "item1")
    @require.define("item2", () -> "item2")
    @require.define("box", ["item1", "item2"], (item1, item2) -> {items: [item1, item2]})
    @require.load("box")
    expect(@require.loaded["box"]).to.ok()

    @require.unload("box")
    expect(@require.loaded["item1"]).to.ok()
    expect(@require.loaded["item2"]).to.ok()

  it "undefine: 定義した関数を削除できる", () ->
    @require.define("define", () -> {})
    @require.load("define")
    expect(@require.defines["define"]).to.ok()
    expect(@require.loaded["define"]).to.ok()

    @require.undefine("define")
    expect(@require.defines["define"]).to.not.ok()
    expect(@require.loaded["define"]).to.not.ok()

  it "clone: definesとloadedを引き継いだ新しいRequireオブジェクトを作成する", () ->
    @require.define("item1", () -> "item1")
    @require.define("item2", () -> "item2")
    @require.define("box", ["item1", "item2"], (item1, item2) -> {items: [item1, item2]})
    @require.load("box")

    clone = @require.clone()
    expect(clone.defines).to.eql(@require.defines)
    expect(clone.loaded).to.eql(@require.loaded)

  it "$define: 既に関数定義があるものに対して、もう一度関数定義を行うことができる", () ->
    @require.define("item1", () -> "item1")
    @require.define("item2", () -> "item2")
    @require.define("box", ["item1", "item2"], (item1, item2) -> {items: [item1, item2]})
    @require.load("box")

    @require.$define("item1", () -> "reitem1")
    expect(@require.load("item1")).to.eql("reitem1")
    expect(@require.loaded["box"]).to.not.ok()

