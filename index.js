let offsetlimit = document.getElementById("offset").value;
let limit = parseInt(offsetlimit);
let pageCount = 1;
let products = [];
let skip = 0;
let totalItem = 0;
const totalProducts = 194;
let currentTotalProducts = totalProducts;
const maxVisiblePages = 5;

async function fetchData(limit, skip, category = null) {
    if (totalItem >= currentTotalProducts) {
        console.log('All the items fetched already!');
        return;
    }
    try {
        const url = category ? `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}` : `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
        const response = await fetch(url);
        const data = await response.json();
        const newProducts = data.products;
        console.log(newProducts);
        totalItem += newProducts.length;
        console.log(totalItem);
        renderProducts(newProducts);
        products = products.concat(newProducts);
        console.log(products);
    } catch (error) {
        console.error("Error:", error);
    }
}

async function displayCategories() {
    try {
        const res = await fetch('https://dummyjson.com/products/category-list');
        const categories = await res.json();
        console.log(categories);
        renderCategories(categories);
    } catch (error) {
        console.log("Error: ", error);
    }
}

displayCategories();

function renderCategories(categories) {
    const categoriesContainer = document.getElementById("categories");
    const newCategoriesHtml = categories.map(
        (category) => `<option class="category-button" id="category-button" value="${category}">${category}</option>`
    ).join('');
    categoriesContainer.innerHTML = newCategoriesHtml;
}

document.getElementById("categories").addEventListener("change", (event) => {
    const selectedCategory = event.target.value;
    handleCategory(selectedCategory);
});

async function handleCategory(category) {
    const res = await fetch(`https://dummyjson.com/products/category/${category}`);
    const data = await res.json();
    currentTotalProducts = data.total;
    console.log(data);
    products = data.products;
    totalItem = products.length;
    pageCount = 1;
    skip = 0;
    document.getElementById("products").innerHTML = '';
    renderProducts(products);
    renderPagination();
}

function renderProducts(productsToRender) {
    const productContainer = document.getElementById("products");

    productsToRender.forEach(product => {
        const productList = document.createElement("div");
        productList.className = "product-list";

        const productCard1 = document.createElement("div");
        productCard1.className = "product-card";

        const priceParagraph = document.createElement("p");
        priceParagraph.textContent = `${product.price} $`;
        productCard1.appendChild(priceParagraph);

        const titleParagraph = document.createElement("p");
        titleParagraph.textContent = product.title;
        productCard1.appendChild(titleParagraph);

        const ratingContainer = document.createElement("div");
        ratingContainer.className = "rating-container";
        ratingContainer.innerHTML = renderStars(product.rating);
        productCard1.appendChild(ratingContainer);

        productList.appendChild(productCard1);

        const productCard2 = document.createElement("div");
        productCard2.className = "product-card";

        const productImage = document.createElement("img");
        productImage.src = product.thumbnail;
        productImage.height = 100;
        productImage.width = 100;
        productCard2.appendChild(productImage);
        productList.appendChild(productCard2);

        productContainer.appendChild(productList);
    });
}

function renderStars(rating) {
    let starsHtml = "";
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            starsHtml += '<span class="star">★</span>';
        } else {
            starsHtml += '<span class="star empty">★</span>';
        }
    }
    return starsHtml;
}

function handleSearch() {
    const element = document.getElementById("searchInput");
    const filteredProducts = products.filter((item) => item.title.toLowerCase().includes(element.value.toLowerCase()));
    document.getElementById("products").innerHTML = '';
    renderProducts(filteredProducts);
}

function handleOffsetChange() {
    limit = parseInt(document.getElementById("offset").value);
    pageCount = 1;
    products = [];
    totalItem = 0;
    document.getElementById("products").innerHTML = '';
    fetchData(limit, skip);
    renderPagination();
}

function handlePageChange(direction) {
    pageCount += direction;
    if (pageCount < 1) {
        pageCount = 1;
    } else if (pageCount > Math.ceil(currentTotalProducts / limit)) {
        pageCount = Math.ceil(currentTotalProducts / limit);
    }
    skip = (pageCount - 1) * limit;
    document.getElementById("products").innerHTML = '';
    fetchData(limit, skip);
    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(currentTotalProducts / limit);
    const paginationContainer = document.getElementById("pageNumbers");
    paginationContainer.innerHTML = '';

    let startPage = Math.max(1, pageCount - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // if (endPage - startPage < maxVisiblePages - 1) {
    //     startPage = Math.max(1, endPage - maxVisiblePages + 1);
    // }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("button");
        pageButton.className = "page-button";
        pageButton.textContent = i;
        pageButton.onclick = () => {
            pageCount = i;
            skip = (pageCount - 1) * limit;
            document.getElementById("products").innerHTML = '';
            fetchData(limit, skip);
            renderPagination();
        };
        if (i === pageCount) {
            pageButton.classList.add("active");
        }
        paginationContainer.appendChild(pageButton);
    }
    if(pageCount == 1){
        document.getElementById("prevPage").disabled = true;
    } else {
        document.getElementById("prevPage").disabled = false;
    }
    if(pageCount === totalPages){
        document.getElementById("nextPage").disabled = true;
    } else {
        document.getElementById("nextPage").disabled = false;
    }
}

fetchData(limit, skip);
renderPagination();

const scrollValue = document.querySelector('.parent-container');
scrollValue.addEventListener('scroll', () => {
    const { scrollHeight, scrollTop, clientHeight } = scrollValue;
    if (scrollTop + clientHeight >= scrollHeight) {
        console.log('I am at the bottom');

        if (totalItem <= currentTotalProducts) {
            pageCount++;
            if (pageCount > 1) {
                document.getElementById("prevPage").disabled = false;
            }
            skip = (pageCount - 1) * limit;
            fetchData(limit, skip);
            renderPagination();
        }
    }
});
