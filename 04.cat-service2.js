const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {

	const { Products, products } = this.entities;
	const service = await cds.connect.to('NorthWind');

    this.on('READ', Products, request => {
        return service.tx(request).run(request.query);
    });
        
	// Orders?$expand=products
	this.on("READ", 'Orders', async (req, next) => {
		console.log(req.query)
		if (!req.query.SELECT.columns) return next();

		const expandIndex = req.query.SELECT.columns.findIndex(
			({ expand, ref }) => expand && ref[0] === "products"
		);
		

		if (expandIndex < 0) return next();
		console.log(expandIndex)

		// Remove expand from query
		req.query.SELECT.columns.splice(expandIndex, 1);
		console.log(!req.query.SELECT.columns.indexOf('*'))
		if(!0 >= 0) console.log("what the syntax")	
		// Make sure prodcuts_ID will be returned
		if (!req.query.SELECT.columns.indexOf('*') >= 0 &&
			!req.query.SELECT.columns.find(
				column => column.ref && column.ref.find((ref) => ref == "products_ID"))
		) {
			req.query.SELECT.columns.push({ ref: ["products_ID"] });
		}
		console.log(req.query.SELECT.columns)

		const orders = await next();
		console.log(orders)
		const asArray = x => Array.isArray(x) ? x : [x];
		console.log(asArray)

		// Request all associated suppliers
		const productIds = asArray(orders).map(order => order.products_ID);
		console.log(productIds)

		const products = await service.run(SELECT.from('CatalogService.Products').where({ ID: productIds }));
		console.log(products)

		// Convert in a map for easier lookup
		const productsMap = {};
		for (const product of products)
			productsMap[product.ID] = product;
		
		console.log(productsMap)

		// Add suppliers to result
		for (const note of asArray(orders)) {
			note.products = productsMap[note.products_ID];
		}
		console.log(orders)

		return orders;
	});
});

