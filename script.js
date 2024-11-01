const fs = require('fs');
const path = require('path');

async function getBeautyProducts() {
    const brand = document.getElementById('brand').value.toLowerCase();
    const priceRange = document.getElementById('priceRange').value;
    const apiUrl = `http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Brand not found');
        }
        const data = await response.json();

        const filteredProducts = data.filter(product => product.price <= priceRange);
        if (filteredProducts.length === 0) {
            document.getElementById('productResult').innerHTML = `<p>No products found in the specified price range.</p>`;
            return;
        }

        let suggestions = '';
        filteredProducts.forEach(product => {
            suggestions += `
                <div class="product-card">
                    <h3>${product.name}</h3>
                    <img src="${product.image_link}" alt="${product.name}">
                    <p>Brand: ${product.brand}</p>
                    <p>Price: $${product.price}</p>
                    <p>Type: ${product.product_type}</p>
                    <p>Rating: ${product.rating || 'N/A'}</p>
                    <p>Description: ${product.description || 'No description available'}</p>
                    <a href="${product.product_link}" target="_blank">View Product</a>
                </div>
            `;
        });

        document.getElementById('productResult').innerHTML = suggestions;
        document.getElementById('saveBox').style.display = 'block';
    } catch (error) {
        document.getElementById('productResult').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        document.getElementById('saveBox').style.display = 'none';
    }
}

function saveProductData() {
    const brand = document.getElementById('brand').value;
    const priceRange = document.getElementById('priceRange').value;
    const productData = document.getElementById('productResult').innerText;

    const pathName = path.join(__dirname, 'files');
    if (!fs.existsSync(pathName)) {
        fs.mkdirSync(pathName);
    }

    const filePath = path.join(pathName, `${brand}-${priceRange}.txt`);
    fs.writeFile(filePath, productData, function (err) {
        if (err) {
            alert('Error: ' + err.message);
            return;
        }
        alert('Product information saved successfully');
    });
}

function readProductData() {
    const fileName = document.getElementById('fileName').value;
    if (!fileName) {
        alert('Please enter a file name');
        return;
    }

    const pathName = path.join(__dirname, 'files');
    const filePath = path.join(pathName, `${fileName}.txt`);

    fs.readFile(filePath, 'utf-8', function (err, data) {
        if (err) {
            alert('Error: ' + err.message);
            return;
        }
        document.getElementById('readResult').innerHTML = `
            <textarea id="fileContent">${data}</textarea>
            <button onclick="saveEditedData('${fileName}')">Save</button>
            <button onclick="deleteProductData('${fileName}')">Delete</button>
        `;
    });
}

function saveEditedData(fileName) {
    const newData = document.getElementById('fileContent').value;
    const pathName = path.join(__dirname, 'files');
    const filePath = path.join(pathName, `${fileName}.txt`);

    fs.writeFile(filePath, newData, function (err) {
        if (err) {
            alert('Error: ' + err.message);
            return;
        }
        alert('File saved successfully');
    });
}

function deleteProductData(fileName) {
    const pathName = path.join(__dirname, 'files');
    const filePath = path.join(pathName, `${fileName}.txt`);

    fs.unlink(filePath, function (err) {
        if (err) {
            alert('Error: ' + err.message);
            return;
        }
        alert('File deleted successfully');
        document.getElementById('readResult').innerHTML = '';
    });
}
