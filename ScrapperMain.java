import maxim.kabanov.scrapper.DAO.*;
import maxim.kabanov.scrapper.db.DB;
import maxim.kabanov.scrapper.loader.Loader;

import maxim.kabanov.scrapper.task.Task;

import java.sql.*;
import java.util.List;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;
import org.htmlcleaner.XPatherException;


public class ScrapperMain implements Runnable {

	/**
	 * @param args
	 */
	public static final Logger log =Logger.getLogger(ScrapperMain.class);
	public static Connection con;
	private String path=null;
	
	public static void initDB(){
		con =new DB().getConnection();
		log.info("test connection");
	}
	
	//load data from file 
	public static void loadData(String path) throws SQLException{
		//load urls from file first link is domain
		String url,domain;
		Integer domain_id=null;
		UrlDAO urlDAO = new UrlDAO(con);
		CompetitorDomainDAO domainDAO = new CompetitorDomainDAO(con);
		Loader file =new Loader(path);
		if((domain = file.getNextRow())!=null)
		{
			CompetitorDomain dom=new CompetitorDomain(null,domain);
			
			if(domainDAO.isExist(dom)==true)
			{
				domain_id = domainDAO.getId(dom);
				
			}
			else{
				domainDAO.insert(dom);
				domain_id = domainDAO.getId(dom);
			}
		}
		
		while((url=file.getNextRow())!=null){
			urlDAO.insertUrl(new Url(null,url,1,1,domain_id,null));
		}
	}
	public static void parseData() throws SQLException, XPatherException{
		
		UrlDAO urlDAO = new UrlDAO(con);
		ScrapedInfoDAO productDAO = new ScrapedInfoDAO(con);
		List<Url> list = urlDAO.getAllNotProcessedUrls();
		ThreadPoolExecutor executor = new ThreadPoolExecutor(30, 30, 1, TimeUnit.SECONDS,new LinkedBlockingQueue());
		for(Url url:list){
			System.out.println(list.size());
			 executor.submit(new Task(url,productDAO, urlDAO));
		}
		
		executor.shutdown();
	}
	public ScrapperMain(String path){
		this.path=path;
	}
	public void run(){
		initDB();
		try {
			System.out.println(path);
			if(!path.contains("reload")){
				loadData(path);
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			log.error(e.getMessage(),e);
			e.printStackTrace();
		}
		//parse and load data
		try {
			parseData();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			log.error(e.getMessage(),e);
			e.printStackTrace();
		} catch (XPatherException e) {
			// TODO Auto-generated catch block
			log.error(e.getMessage(),e);
			e.printStackTrace();
		}
		
		System.out.println("done");
	}
public static void main(String[] args) throws SQLException, XPatherException {
		
		//init data
		initDB();
//		loadData("spoke\\test1.txt");
		//parse data
		parseData();
		//load data
		System.out.println("done");
	}

}
