To create data for mongodb (online - localhost)

Online db:
<code>
    yarn createdb
</code>

Local db:
<code>
    yarn createdb_local
</code>

<h3>API</h3>

<h4> Get categories list: </h4>
<code>
    http://localhost:9000/v1/api/categories
</code>


<h4> Get product lists: </h4>
<code>
    http://localhost:9000/v1/api/products?page=2&maxResults=2
</code>
default: page = 1 | maxResult = 16

<h4> Get products lists match specific categories name (exact name on db): </h4>
<code>
    http://localhost:9000/v1/api/products?categories=Sofa&categories=Giường
</code>

<h4> Get products lists match specific colors name (exact name on db): </h4>
<code>
    http://localhost:9000/v1/api/products?colors=black&colors=maroon
</code>

<h4> Get products lists with price filter: </h4>
<code>
    http://localhost:9000/v1/api/products?minPrice=2000000&maxPrice=5000000
</code>

<h4> Get products lists (Sort by price: 1=ASCE || -1=DESC): </h4>
<code>
    http://localhost:9000/v1/api/products?priceSort=1
</code>

<h4> Get products lists (Sort by name: 1=ASCE || -1=DESC): </h4>
<code>
    http://localhost:9000/v1/api/products?nameSort=1
</code>

<h4> Get products lists (Sort by views: 1=ASCE || -1=DESC): </h4>
<code>
http://localhost:9000/v1/api/products?viewsSort=-1
</code>

<h4> Get products lists (Sort by date: 1=ASCE || -1=DESC): </h4>
<code>
http://localhost:9000/v1/api/products?dateSort=-1
</code>

<h4> Search products: </h4>
<code>
    http://localhost:9000/v1/api/products?searchKey=Ghế
</code>

<h4> Get detail of a product: </h4>
<code>
    http://localhost:9000/v1/api/products/*ProductID*
</code>

<h4> Get list of colors: </h4>
<code>
    http://localhost:9000/v1/api/colors
</code>
result:
<code>
 {
    "_id": "5af4139b5d3b283e782bb3f6",
    "name": "white",
    "hex": "#FFFFFF",
    "__v": 0
},
</code>

<h4> Add a product: </h4>
<code>
    POST=> http://localhost:9000/v1/api/product
</code>
<img src="mdResources/addProduct.PNG" width="500"></img>


<h4> Edit a product(need to login first): </h4>
<code>
    deletedImages array NEED to be a string (use JSON.stringify) due to formdata cannot parse array</br>
    PUT => http://localhost:9000/v1/api/product
</code>
<img src="mdResources/editProduct.PNG" width="500"></img>

<h4> Delete a product: </h4>
<code>
    need productID in body
    DELETE => http://localhost:9000/v1/api/products
</code>

<h4>Update user role: </h4>
<code>
    need userID and role in body
    PUT => http://localhost:9000/v1/api/user/role
</code>

<h4>Update a category: </h4>
<code>
    need _id and name(as new name) in body
    PUT => http://localhost:9000/v1/api/categories
</code>

<h4>Delete a category: </h4>
<code>
    need _id in body
    DELETE => http://localhost:9000/v1/api/categories
</code>

<h4>Verify an account: </h4>
<code>
    GET => http://localhost:9000/v1/api/user/verify/:email/:verifyToken
</code>
