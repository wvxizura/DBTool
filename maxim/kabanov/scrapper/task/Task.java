package maxim.kabanov.scrapper.task;
import java.io.IOException;

import java.sql.SQLException;

import org.apache.log4j.Logger;
import org.htmlcleaner.XPatherException;

import maxim.kabanov.scrapper.DAO.ScrapedInfoDAO;
import maxim.kabanov.scrapper.DAO.Url;
import maxim.kabanov.scrapper.DAO.UrlDAO;
import maxim.kabanov.scrapper.loader.CheckUrl;
import maxim.kabanov.scrapper.parser.Parser;

public class Task implements Runnable{
	public static final Logger log =Logger.getLogger(Task.class);
	private Url url;
	private ScrapedInfoDAO pr;
	private UrlDAO urlDAO;
	public Task(Url url,ScrapedInfoDAO pr,UrlDAO urlDAO){
		this.url=url;
		this.pr=pr;
		this.urlDAO=urlDAO;
	}
	public void run(){
	
		Parser parser = null;
		
		
			try {
				url.setStatusId(2);
				urlDAO.updateUrl(url);
				if(new CheckUrl(url.getUrlText()).getStatus())
				{
				parser = new Parser(url.getUrlText());
				pr.parseAndInsert(parser,url);
				url.setStatusId(3);
				urlDAO.updateUrl(url);
				}else{
					url.setStatusId(4);
					urlDAO.updateUrl(url);
				}
			} catch (SQLException | IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (XPatherException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		
			
		
		
	}
}
