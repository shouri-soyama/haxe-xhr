package lib;

import haxe.Json;
import haxe.ds.StringMap;
import js.html.FormData;
import js.html.XMLHttpRequest;

enum Response {
	ResponseError(xhr: XMLHttpRequest);
	TypeError(xhr: XMLHttpRequest);
	Succeeded(data: Dynamic);
}

enum ResponseType {
	PlaneText;
	Json;
	HttpRequest;
}

enum RequestBody {
	Text(data: String);
	Json(data: Dynamic);
	MultipartForm(data: StringMap<Dynamic>);
}

typedef RequestOption = {
	var method: String;
	var url: String;
	@:optional var responseType: ResponseType;
	@:optional var responded: Response -> Void;
	@:optional var data: RequestBody;
}

class Http {
	public static function request(option: RequestOption) {
		var xhr = new XMLHttpRequest();
		xhr.open(option.method, option.url);
		xhr.onreadystatechange = function() {
			if (xhr.readyState != 4) {
				return;
			}
			if (xhr.status != 200) {
				option.responded(ResponseError(xhr));
				return;
			}
			var responseType = if (option.responseType == null) ResponseType.Json else option.responseType;
			var res = switch (responseType) {
				case PlaneText:
					Succeeded(xhr.responseText);
				case Json:
					try {
						Succeeded(haxe.Json.parse(xhr.responseText));
					} catch(_: Dynamic) {
						TypeError(xhr);
					}
				case HttpRequest:
					Succeeded(xhr);
			};
			option.responded(res);
		};
		switch (option.data) {
			case Text(data):
				xhr.setRequestHeader("Content-Type", "text/plain");
				xhr.send(data);
			case Json(data):
				xhr.setRequestHeader("Content-Type", "application/json");
				xhr.send(haxe.Json.stringify(data));
			case MultipartForm(data):
				xhr.setRequestHeader("Content-Type", "multipart/form-data");
				var fd = new FormData();
				for (key in data.keys()) {
					fd.append(key, data.get(key));
				}
				xhr.send(fd);
			case null:
				xhr.send();
		}
	}
}
