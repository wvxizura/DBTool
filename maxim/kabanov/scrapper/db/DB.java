package maxim.kabanov.scrapper.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import maxim.kabanov.scrapper.cfg.*;
import org.apache.log4j.Logger;
public class DB {
	
public String user="user";
public String password="password";
public String driverName="driverName";
public String url = "url";
public static final Logger log =Logger.getLogger(DB.class);
public DB(){
	log.info("Create data base connection");
}
public Connection getConnection(){
	try {
		ConfigMananger cfg =new ConfigMananger("db_cfg.txt");
	    Class.forName(cfg.get(driverName).toString());
	  	return DriverManager.getConnection(cfg.get(url).toString(), cfg.get(user).toString(),cfg.get(password).toString());
	
	}
	catch (SQLException e) {
		log.error(e.getMessage(), e);
	    e.printStackTrace();
	}
	catch (Exception e) {
		log.error(e.getMessage(),e);
	    e.printStackTrace();
	}
	return null;
}


}
