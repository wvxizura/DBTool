

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

import maxim.kabanov.scrapper.db.DB;


public class test_remote_db {

	/**
	 * @param args
	 * @throws SQLException 
	 */
	public static void main(String[] args) throws SQLException {
		// TODO Auto-generated method stub
		Connection con =new DB().getConnection();
		ResultSet rs=null;
		CallableStatement cs=null;
		cs=con.prepareCall("{call selectUrl(?)}");
		cs.setInt(1, 4);
		rs=cs.executeQuery();
		while(rs.next()){
			System.out.println(rs.getInt("Id"));
		}
	}

}
