package maxim.kabanov.scrapper.DAO;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;


import org.apache.log4j.Logger;

public class UrlDAO {
	public static final Logger log =Logger.getLogger(UrlDAO.class);
	private Connection con;
	
	public UrlDAO(Connection con){
		this.con = con;
	}
	public void insertUrl(Url url) throws SQLException{
		PreparedStatement ps = null;
		String q=null;
		
		q="INSERT INTO urls (UrlText ,LastScrapedDate, Enabled, CompetitorDomainId, StatusId, ProductId) VALUES (?,NOW(),?,?,?,?)";
		
		
			ps = con.prepareStatement(q);
			ps.setString(1, url.getUrlText());
			ps.setInt(2, url.getEnabled());
			ps.setInt(3, url.getCompetitorDomainId());
			ps.setInt(4, url.getStatusId());
			//ps.setInt(5, url.getProductId());
			ps.setNull(5,Types.INTEGER);
			ps.executeUpdate();
			
		
		
	}
	public List<Url> getAllNotProcessedUrls() throws SQLException
	{
		List<Url> list = new ArrayList<Url>();
		ResultSet rs=null;
		CallableStatement cs=null;
		cs=con.prepareCall("{call selectUrlByStatus(?)}");
		cs.setInt(1, 1);
		rs=cs.executeQuery();
		while(rs.next()){
			Url url= new Url(rs.getInt("Id"),
							 rs.getString("UrlText"),
							 rs.getInt("StatusId"),
							 rs.getInt("Enabled"),
							 rs.getInt("CompetitorDomainId"),
							 rs.getInt("ProductId"));
			
			list.add(url);
							
		}
		return list;
	}
	public void updateUrl(Url url) throws SQLException{
		CallableStatement cs=null;
		cs=con.prepareCall("{call updateUrlStatus(?,?)}");
		cs.setInt(1, url.getStatusId());
		cs.setInt(2, url.getId());
		cs.executeUpdate();
	}
}
