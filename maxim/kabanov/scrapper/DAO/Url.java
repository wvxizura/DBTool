package maxim.kabanov.scrapper.DAO;

public class Url {
private Integer id;
private String urlText;
private Integer  statusId;
private Integer enabled;
private Integer  competitorDomainId;
private Integer productId;
public Url(Integer id, String urlText, Integer  statusId, Integer enabled, Integer  competitorDomainId, Integer productId){
	this.setCompetitorDomainId(competitorDomainId);
	this.setEnabled(enabled);
	this.setId(id);
	this.setStatusId(statusId);
	this.setUrlText(urlText);
	this.setProductId(productId);
	}

public Integer getId() {
	return id;
}

public void setId(Integer id) {
	this.id = id;
}

public String getUrlText() {
	return urlText;
}

public void setUrlText(String urlText) {
	this.urlText = urlText;
}

public Integer getStatusId() {
	return statusId;
}

public void setStatusId(Integer statusId) {
	this.statusId = statusId;
}

public Integer getEnabled() {
	return enabled;
}

public void setEnabled(Integer enabled) {
	this.enabled = enabled;
}

public Integer getCompetitorDomainId() {
	return competitorDomainId;
}

public void setCompetitorDomainId(Integer competitorDomainId) {
	this.competitorDomainId = competitorDomainId;
}

public Integer getProductId() {
	return productId;
}

public void setProductId(Integer productId) {
	this.productId = productId;
}

}
