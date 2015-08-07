package src;

import lib.Http;

class Main {
	public static function main() {
		lib.Http.request({
			method: "GET",
			url: "http://localhost/api/events/5fdc3257-dcb7-4340-a765-ac1664527d68",
			responded: function(r) {
				trace(r);
			}
		});
		lib.Http.request({
			method: "PUT",
			url: "http://localhost/api/events/5fdc3257-dcb7-4340-a765-ac1664527d68",
			data: RequestBody.Json({name:"BBBB",description:"Desc2",startDate:null,scope:"private"}),
			responded: function(r) {
				trace(r);
			}
		});
	}
}
