{
	"product_name":"data(//div[@class=\"product-name\"])",
	"price":"data(//li[@class=\"srp-price\"]//span[@class=\"dollar-amount-pgrid3\"])",
	"features":"",
	"image":"data(//div[@class=\"product-img-box\"]//img/@src)"
}
