package maxim.kabanov.scrapper.DAO;

import java.sql.SQLException;

public interface IScrapedInfoDAO {
public void insert(ScrapedInfo product) throws SQLException;
}
