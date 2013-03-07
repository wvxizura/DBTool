package maxim.kabanov.scrapper.DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

public class CompetitorDomainDAO implements ICompetitorDomainDAO {
	public static final Logger log =Logger.getLogger(CompetitorDomainDAO.class);
	private Connection con;
	public CompetitorDomainDAO(Connection con){
		this.con=con;
	}
	public List<CompetitorDomain> selectAll(){
		List<CompetitorDomain> list = new ArrayList<CompetitorDomain>();
		ResultSet rs=null;
		PreparedStatement ps = null;
		String q=null;
		
		q="SELECT * FROM scraper.competitordomains";
		try {
			ps=con.prepareStatement(q);
			rs = ps.executeQuery();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			log.warn(e.getMessage(), e);
			e.printStackTrace();
		}
		try {
			while(rs.next()){
				CompetitorDomain domain = new CompetitorDomain(rs.getInt("Id"),rs.getString("Address"));
				list.add(domain);
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			log.warn(e.getMessage(), e);
			e.printStackTrace();
		}
		return list;
	}
	public void insert(CompetitorDomain domain){
		PreparedStatement ps = null;
		String q=null;
		q="INSERT INTO scraper.competitordomains (ADDRESS) VALUES (?)";
		try {
			ps=con.prepareStatement(q);
			ps.setString(1, domain.getAddress());
			ps.executeUpdate();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			log.warn(e.getMessage(),e);
			e.printStackTrace();
		}
		
	}
	public Boolean isExist(CompetitorDomain domain) throws SQLException{
		ResultSet rs=null;
		PreparedStatement ps = null;
		String q=null;
		
		q="SELECT Id FROM competitordomains WHERE Address=?";
		
		try {
			ps = con.prepareStatement(q);
			ps.setString(1, domain.getAddress());
			rs= ps.executeQuery();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			log.error(e.getMessage(),e);
			e.printStackTrace();
		}
		return rs.first();
		
	}
	public Integer getId(CompetitorDomain domain) throws SQLException
	{
		ResultSet rs=null;
		PreparedStatement ps = null;
		String q=null;
		
		q="SELECT Id FROM scraper.competitordomains WHERE Address=?";
		
		try {
			ps = con.prepareStatement(q);
			ps.setString(1,  domain.getAddress());
			rs= ps.executeQuery();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			log.error(e.getMessage(),e);
			e.printStackTrace();
		}
		if(rs.next()){
		return rs.getInt("Id");
		}
		return null;
	}
}
