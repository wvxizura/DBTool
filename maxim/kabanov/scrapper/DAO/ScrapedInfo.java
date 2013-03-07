package maxim.kabanov.scrapper.DAO;

import java.net.URL;
import java.sql.*;
public class ScrapedInfo {
private Integer id;
private Double price;
private Double shipping;
private Integer urlId;
private Integer status;
private String description;
private String name;
private URL image;
private Integer productId;
private Integer backInStock;
private Timestamp date;
public ScrapedInfo(Integer id, Double price, Double shipping, Integer urlId, Integer status,String name, String description,URL image,Integer productId){
	this.setId(id);
	this.setDescription(description);
	this.setImage(image);
	this.setName(name);
	this.setPrice(price);
	this.setShipping(shipping);
	this.setStatus(status);
	this.setUrlId(urlId);
	this.setProductId(productId);
}
public Double getPrice() {
	return price;
}
public void setPrice(Double price) {
	this.price = price;
}
public Double getShipping() {
	return shipping;
}
public void setShipping(Double shipping) {
	this.shipping = shipping;
}
public Integer getStatus() {
	return status;
}
public void setStatus(Integer status) {
	this.status = status;
}
public String getDescription() {
	return description;
}
public void setDescription(String description) {
	this.description = description;
}
public Integer getUrlId() {
	return urlId;
}
public void setUrlId(Integer urlId) {
	this.urlId = urlId;
}
public String getName() {
	return name;
}
public void setName(String name) {
	this.name = name;
}
public URL getImage() {
	return image;
}
public void setImage(URL image) {
	this.image = image;
}
public Integer getId() {
	return id;
}
public void setId(Integer id) {
	this.id = id;
}
public Integer getProductId() {
	return productId;
}
public void setProductId(Integer productId) {
	this.productId = productId;
}
public Timestamp getDate() {
	return date;
}
public void setDate(Timestamp date) {
	this.date = date;
}
public Integer getBackInStock() {
	return backInStock;
}
public void setBackInStock(Integer backInStock) {
	this.backInStock = backInStock;
}
}
