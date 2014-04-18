#= require require
#= require mocker

require ["mocker"], (Mocker) ->

  describe "Mocker", () ->

    it "Requireの定義を引き継ぐがロード済みは空の状態である", () ->
      mocker = new Mocker()
      expect(mocker.require.loaded).to.eql({})

    describe "インスタンスが正常に作成できる", () ->

      beforeEach () ->
        @mocker = new Mocker()

      afterEach () ->
        delete @mocker

      it "Mockを作成できる", () ->
        @mocker.mock("mock", () -> "mock")
        expect(@mocker.require.defines["mock"]).to.ok()

      it "作成したMockを起動することができる", () ->
        @mocker.mock("mock", () -> "mock")
        @mocker.run ["mock"], (mock) ->
          expect(mock).to.eql("mock")