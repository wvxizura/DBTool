{
	"product_name":"data(//h2[@class=\"product_name\"])",
	"price":"data(//span[@id=\"optpricetext\"])",
	"features":"",
	"image":"data(//img[@class=\"product_img\"]/@src)"
}