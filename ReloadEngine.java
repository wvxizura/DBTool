import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import maxim.kabanov.scrapper.DAO.ScrapedInfoDAO;
import maxim.kabanov.scrapper.DAO.Url;
import maxim.kabanov.scrapper.DAO.UrlDAO;
import maxim.kabanov.scrapper.db.DB;
import maxim.kabanov.scrapper.task.Task;

import org.apache.log4j.Logger;
import org.htmlcleaner.XPatherException;


public class ReloadEngine {

	/**
	 * @param args
	 */
	public static final Logger log =Logger.getLogger(ReloadEngine.class);
	public static Connection con;
	public static UrlDAO urlDAO;
	public static ScrapedInfoDAO productDAO;
	public static void init(){
		con =new DB().getConnection();
		urlDAO = new UrlDAO(con);
		productDAO = new ScrapedInfoDAO(con);
	}
	public static void parseData() throws SQLException, XPatherException{
		List<Url> list = urlDAO.getAllNotProcessedUrls();
		ThreadPoolExecutor executor = new ThreadPoolExecutor(60, 60, 1, TimeUnit.SECONDS,new LinkedBlockingQueue());
		if(!list.isEmpty()){
		for(Url url:list){
			executor.submit(new Task(url,productDAO,urlDAO));
		}
		executor.shutdown();
		}
		
		
	}

	public static void main(String[] args) throws SQLException, XPatherException, InterruptedException {
				// TODO Auto-generated method stub
		System.out.println("start");
		init();
		while(true){
			parseData();
			//System.out.println("after parse");
			Thread.sleep(120000);// wait 1 min
			
		}
		
	}

}
