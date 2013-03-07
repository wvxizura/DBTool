package maxim.kabanov.scrapper.DAO;

public class ParseDefenition {
private String name;
private String price;
private String shipping;
private String description;
private String image;
private String features;

public ParseDefenition(String name, String price, String features, String image, String shipping,
		String description) {
	super();
	this.name = name;
	this.price = price;
	this.shipping = shipping;
	this.description = description;
	this.image = image;
	this.features = features;
}
public String getName() {
	return name;
}
public void setName(String name) {
	this.name = name;
}
public String getPrice() {
	return price;
}
public void setPrice(String price) {
	this.price = price;
}
public String getShipping() {
	return shipping;
}
public void setShipping(String shipping) {
	this.shipping = shipping;
}
public String getDescription() {
	return description;
}
public void setDescription(String description) {
	this.description = description;
}
public String getImage() {
	return image;
}
public void setImage(String image) {
	this.image = image;
}
public String getFeatures() {
	return features;
}
public void setFeatures(String features) {
	this.features = features;
}
}
