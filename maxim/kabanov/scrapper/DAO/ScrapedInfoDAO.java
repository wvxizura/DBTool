package maxim.kabanov.scrapper.DAO;

import java.io.IOException;
import java.net.URL;
import java.sql.CallableStatement;
import java.sql.Connection;

import java.sql.SQLException;

import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

import maxim.kabanov.scrapper.cfg.ConfigMananger;
import maxim.kabanov.scrapper.parser.Parser;

import org.apache.log4j.Logger;
import org.htmlcleaner.XPatherException;

public class ScrapedInfoDAO implements IScrapedInfoDAO{
	public static final Logger log =Logger.getLogger(ScrapedInfoDAO.class);
	private String product_name = "product_name";
	private String price = "price";
//	private String features ="features";
	private String image ="image";
	//private String shipping="shipping";
	private Connection con;
	private ArrayList<ParseDefenition> parseTemplate = new ArrayList<ParseDefenition>();
    public 	ScrapedInfoDAO(Connection con){
	this.con=con;
	CompetitorDomainDAO domainDAO = new CompetitorDomainDAO(con);
	List<CompetitorDomain> list =domainDAO.selectAll();
	parseTemplate.add(0, null);
	for(CompetitorDomain dom:list){
		ConfigMananger cfg = new ConfigMananger(dom.getAddress());
		if(cfg!=null){
		ParseDefenition template =new ParseDefenition(cfg.get(product_name).toString(),
				cfg.get(price).toString(),
				null,
				cfg.get(image).toString(),null,null);
		
		parseTemplate.add(dom.getId().intValue(), template);
		}
	}
	//shipping = cfg.get(shipping).toString();
	
	}
public void parseAndInsert(Parser parser, Url url) throws XPatherException, SQLException, IOException
{
	ParseDefenition temp = parseTemplate.get(url.getCompetitorDomainId());
	String pImage=null;
	String pName = parser.parseContent(temp.getName())[0].toString();
	
	Double pPrice =Double.parseDouble(parser.parseContent(temp.getPrice())[0].toString().replaceAll("\\$", ""));
	Double pShipping=null;//Double.parseDouble(parser.parseContent(shipping)[0].toString().replaceAll("\\$", ""));;
	String pDescription="test2";
	
	Object tmp=parser.parseContent(temp.getImage())[0];
	if(tmp !=null ){
		pImage =tmp.toString();
	}
	//Object[] pFeatures =null;// parser.parseContent(parseTemplate.get(url.getCompetitorDomainId()).getFeatures());
	//PreparedStatement ps = null;
	//String q=null;
	URL image = null;
	if(pImage != null){
	image =new URL(pImage);
	}
	Integer vScrapedInfoStatus = 3;//default 3 -scraped
	if(pImage == null || pPrice == null || pName == null){
		vScrapedInfoStatus=5;//faild not match template
	}
	ScrapedInfo pr = new ScrapedInfo(null,pPrice,pShipping,url.getId(),vScrapedInfoStatus,pName,pDescription,image,url.getProductId());
	insert(pr);
/*	q="INSERT INTO scrapedattributes (ScrapedInfoId, Value) VALUES (?,?)";
	if(pFeatures != null){
	try {
		ps = con.prepareStatement(q);
		
		for(Object pF:pFeatures){
		ps.setString(1, Integer.toString(pr.getId()));
		ps.setString(2,pF.toString());
		ps.execute();
		}
	} catch (SQLException e) {
		// TODO Auto-generated catch block
		log.error(e.getMessage(),e);
		e.printStackTrace();
	}
	}*/
}
public void insert(ScrapedInfo product) throws SQLException{
	log.info("insert scraped info");
	CallableStatement cs=null;
	cs=con.prepareCall("{call updateOrInsertScrapedInfo(?,?,?,?,?,?,?,?,?)}");
	
			
	
		if(product.getPrice() != null){
			cs.setDouble(1, product.getPrice());
		}else{
			cs.setNull(1, Types.DOUBLE);
		}
		if(product.getShipping() != null){
			cs.setDouble(2, product.getShipping());
		}else{
			cs.setInt(2, 99999);
		}
		cs.setInt(3, product.getUrlId());
		cs.setString(4, product.getName());
		try {
			if(product.getImage()!=null){
				cs.setBlob(5, product.getImage().openStream());
			}else{
				cs.setNull(5,Types.BLOB);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			log.error(e.getMessage(),e);
			e.printStackTrace();
		}
		cs.setInt(6,product.getStatus());
		cs.setString(7, product.getDescription());
		cs.setInt(8,1);
		if(product.getProductId()!=0){
			cs.setInt(9,product.getProductId());
		}else{
			cs.setNull(9,Types.INTEGER);
		}
		cs.executeUpdate();
	
	
}

}
