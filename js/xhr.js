(function (console) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); };
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
Math.__name__ = true;
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
var haxe_ds_StringMap = function() { };
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	getReserved: function(key) {
		if(this.rh == null) return null; else return this.rh["$" + key];
	}
	,keys: function() {
		var _this = this.arrayKeys();
		return HxOverrides.iter(_this);
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) out.push(key);
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) out.push(key.substr(1));
			}
		}
		return out;
	}
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
var lib_Response = { __ename__ : true, __constructs__ : ["ResponseError","TypeError","Succeeded"] };
lib_Response.ResponseError = function(xhr) { var $x = ["ResponseError",0,xhr]; $x.__enum__ = lib_Response; $x.toString = $estr; return $x; };
lib_Response.TypeError = function(xhr) { var $x = ["TypeError",1,xhr]; $x.__enum__ = lib_Response; $x.toString = $estr; return $x; };
lib_Response.Succeeded = function(data) { var $x = ["Succeeded",2,data]; $x.__enum__ = lib_Response; $x.toString = $estr; return $x; };
var lib_ResponseType = { __ename__ : true, __constructs__ : ["PlaneText","Json","HttpRequest"] };
lib_ResponseType.PlaneText = ["PlaneText",0];
lib_ResponseType.PlaneText.toString = $estr;
lib_ResponseType.PlaneText.__enum__ = lib_ResponseType;
lib_ResponseType.Json = ["Json",1];
lib_ResponseType.Json.toString = $estr;
lib_ResponseType.Json.__enum__ = lib_ResponseType;
lib_ResponseType.HttpRequest = ["HttpRequest",2];
lib_ResponseType.HttpRequest.toString = $estr;
lib_ResponseType.HttpRequest.__enum__ = lib_ResponseType;
var lib_RequestBody = { __ename__ : true, __constructs__ : ["Text","Json","MultipartForm"] };
lib_RequestBody.Text = function(data) { var $x = ["Text",0,data]; $x.__enum__ = lib_RequestBody; $x.toString = $estr; return $x; };
lib_RequestBody.Json = function(data) { var $x = ["Json",1,data]; $x.__enum__ = lib_RequestBody; $x.toString = $estr; return $x; };
lib_RequestBody.MultipartForm = function(data) { var $x = ["MultipartForm",2,data]; $x.__enum__ = lib_RequestBody; $x.toString = $estr; return $x; };
var lib_Http = function() { };
lib_Http.__name__ = true;
lib_Http.request = function(option) {
	var xhr = new XMLHttpRequest();
	xhr.open(option.method,option.url);
	xhr.onreadystatechange = function() {
		if(xhr.readyState != 4) return;
		if(xhr.status != 200) {
			option.responded(lib_Response.ResponseError(xhr));
			return;
		}
		var responseType;
		if(option.responseType == null) responseType = lib_ResponseType.Json; else responseType = option.responseType;
		var res;
		switch(responseType[1]) {
		case 0:
			res = lib_Response.Succeeded(xhr.responseText);
			break;
		case 1:
			try {
				res = lib_Response.Succeeded(JSON.parse(xhr.responseText));
			} catch( _ ) {
				res = lib_Response.TypeError(xhr);
			}
			break;
		case 2:
			res = lib_Response.Succeeded(xhr);
			break;
		}
		option.responded(res);
	};
	{
		var _g = option.data;
		if(_g == null) xhr.send(); else switch(_g[1]) {
		case 0:
			var data = _g[2];
			xhr.setRequestHeader("Content-Type","text/plain");
			xhr.send(data);
			break;
		case 1:
			var data1 = _g[2];
			xhr.setRequestHeader("Content-Type","application/json");
			xhr.send(JSON.stringify(data1));
			break;
		case 2:
			var data2 = _g[2];
			xhr.setRequestHeader("Content-Type","multipart/form-data");
			var fd = new FormData();
			var $it0 = data2.keys();
			while( $it0.hasNext() ) {
				var key = $it0.next();
				fd.append(key,__map_reserved[key] != null?data2.getReserved(key):data2.h[key]);
			}
			xhr.send(fd);
			break;
		}
	}
};
var src_Main = function() { };
src_Main.__name__ = true;
src_Main.main = function() {
	lib_Http.request({ method : "PUT", url : "http://localhost/api/events/5fdc3257-dcb7-4340-a765-ac1664527d68", data : lib_RequestBody.Json({ name : "BBBB", description : "Desc2", startDate : null, scope : "private"}), responded : function(r) {
		console.log(r);
	}});
};
String.__name__ = true;
Array.__name__ = true;
var __map_reserved = {}
src_Main.main();
})(typeof console != "undefined" ? console : {log:function(){}});
