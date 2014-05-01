(function(){var e;this.Require=function(){function e(){this.defined={},this.loaded={},this.dependences={}}return e.prototype.createDef=function(e){var n,t;return n={name:null,deps:[],func:null},Object.isString(e[0])?(n.name=e[0],2===e.length&&(n.func=e[1]),3===e.length&&(n.deps=e[1],n.func=e[2])):Object.isArray(e[0])?(n.deps=e[0],n.func=e[1]):Object.isFunction(e[0])&&(n.func=e[0]),t=!0,t=t&&(!(null!=n.name)||Object.isString(n.name)),t=t&&Object.isArray(n.deps),t=t&&Object.isFunction(n.func),t||new Error("args is [name, func] or [name, deps, func], or [deps, func], or [func]"),n},e.prototype.define=function(){var e;if(e=this.createDef(arguments),null!=e.name&&null!=this.defined[e.name])throw new Error("define "+e.name+" is duplicate. override define is $define function.");this.$define.apply(this,arguments)},e.prototype.$define=function(){var e,n,t,i,r,u;for(e=this.createDef(arguments),null!=this.defined[e.name]&&this.undefine(e.name),this.defined[e.name]=e,u=e.deps,i=0,r=u.length;r>i;i++)n=u[i],null==(t=this.dependences)[n]&&(t[n]={}),this.dependences[n][e.name]=!0},e.prototype.undefine=function(e){var n,t,i,r,u;for(this.unload(e),n=this.defined[e],delete this.defined[e],u=n.deps,i=0,r=u.length;r>i;i++)t=u[i],delete this.dependences[t][e]},e.prototype.unload=function(e){var n,t;if(delete this.loaded[e],t=this.dependences[e],null!=t)for(n in t)delete this.loaded[n]},e.prototype.run=function(){var e,n,t,i,r,u;if(arguments.length<1||arguments.length>2)throw new Error("args is [func] or [deps, func]");for(n=this.createDef(arguments),e=[],u=n.deps,i=0,r=u.length;r>i;i++)t=u[i],e.push(this.load(t,n));return n.func.apply(null,e)},e.prototype.load=function(e,n){var t,i,r,u,o,s,d;if(null==n&&(n=null),"require"===e)return this;if(this.loaded[e])return this.loaded[e];if(i=this.defined[e],null==i)throw u=""+e+" is not defined.",null!=n&&(u+="\n  name to ["+n.name+"]",u+="\n  deps to ["+n.deps.toString()+"]",u+="\n  source to "+n.func.toString()),new Error(u);for(t=[],d=i.deps,o=0,s=d.length;s>o;o++)r=d[o],t.push(this.load(r,i));return this.loaded[e]=i.func.apply(null,t),this.loaded[e]},e.prototype.clone=function(){var n;return n=new e,n.defined=Object.clone(this.defined),n.loaded=Object.clone(this.loaded),n.dependences=Object.clone(this.dependences),n},e}(),e=new this.Require,this.require=function(){return e.run.apply(e,arguments)},this.require._=e,this.define=function(){e.define.apply(e,arguments)},this.$define=function(){e.$define.apply(e,arguments)}}).call(this),function(){define("mocker",["require"],function(e){var n;return n=function(){function n(){this.require=e.clone(),this.unload()}return n.prototype.unload=function(){var e,n;n=[];for(e in this.require.loaded)n.push(this.require.unload(e));return n},n.prototype.mock=function(){return this.require.$define.apply(this.require,arguments)},n.prototype.run=function(){return this.require.run.apply(this.require,arguments),this.unload()},n}()})}.call(this),function(){}.call(this);
/*# sourceMappingURL=require-mini.js.map */