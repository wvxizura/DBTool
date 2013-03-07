package maxim.kabanov.scrapper.DAO;

public class CompetitorDomain {
private Integer id;
private String address;
public CompetitorDomain(Integer id,String address){
	this.setAddress(address);
	this.setId(id);
}
public Integer getId() {
	return id;
}
public void setId(Integer id) {
	this.id = id;
}
public String getAddress() {
	return address;
}
public void setAddress(String address) {
	this.address = address;
}
}
