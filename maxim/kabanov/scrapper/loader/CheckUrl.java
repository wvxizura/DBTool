package maxim.kabanov.scrapper.loader;

import java.io.IOException;

import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

public class CheckUrl {
private URL url;
public CheckUrl(String url) throws MalformedURLException{
	this.setUrl(new URL(url));
}
public URL getUrl() {
	return url;
}
public void setUrl(URL url) {
	this.url = url;
}
public Boolean getStatus() throws IOException {
	HttpURLConnection conn = (HttpURLConnection)url.openConnection();
	int code =conn.getResponseCode();
	switch(code){
	case 200:{
	    //getting site content
		return true;
	}
	case 404:{
		//add to logs add cant connect
	    return false;
	}
	default:{
		//add to logs undifined error
	   return false;
	}
	}
}
}
