package maxim.kabanov.scrapper.parser;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import org.apache.log4j.Logger;
import org.htmlcleaner.HtmlCleaner;
import org.htmlcleaner.TagNode;
import org.htmlcleaner.XPatherException;

public class Parser {
	public static final Logger log =Logger.getLogger(Parser.class);
	private TagNode html;
	public Parser(String url) throws MalformedURLException, IOException{
		HtmlCleaner clean = new HtmlCleaner();
		html =clean.clean(new URL(url), "utf-8");
	}
	public Object[] parseContent(String xpath) throws XPatherException
	{
		Object[] nodes = null;
		nodes = html.evaluateXPath(xpath);
		if(nodes.length>0){
			return nodes;
		}
		//add to log " content not found" 
		return null;
	}
}
