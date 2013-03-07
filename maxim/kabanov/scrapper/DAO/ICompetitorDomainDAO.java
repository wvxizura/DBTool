package maxim.kabanov.scrapper.DAO;

import java.util.List;

public interface ICompetitorDomainDAO {
public void insert(CompetitorDomain domain);
public List<CompetitorDomain> selectAll();
 }
