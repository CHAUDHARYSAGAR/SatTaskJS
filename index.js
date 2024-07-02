let offsetlimit = document.getElementById("offset").value;
let limit = offsetlimit;
let pageCount = 1;
let products = [];
let skip = 0;
let totalItem = 0;


async function fetchData(limit, skip) {
  if(totalItem>=194) {
    console.log('All the items fetched already!'); 
  }
  else{
    try {
      const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
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
}

async function displayCategories() {
  try {
    const res = await fetch('https://dummyjson.com/products/category-list');
    const res1 = await res.json();
    console.log(res1);
    renderCategories(res1);
  } catch(error) {
    console.log("Error: ", error);
  }
}

displayCategories();

function renderCategories(products) {
  let categoriesContainer = document.getElementById("categories");
  const newCategoriesHtml = products.map(
    (product) => {
        return `<option class="category-button" id="category-button"  value="${product}">${product}</option>`;
      }
  ).join('');
  categoriesContainer.innerHTML = newCategoriesHtml;
}

document.getElementById("categories").addEventListener("change", function(event) {
  const selectedProduct = event.target.value;
  handleCategory(selectedProduct);
});


async function handleCategory(product) {
  const res = await fetch(`https://dummyjson.com/products/category/${product}`)
  const res1 = await res.json();
  const data = res1.products;
  console.log(data);
  const productContainer = document.getElementById("products");
  productContainer.innerHTML = '';
  renderProducts(data);
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
  const filteredProducts = products.filter((item) => {
    return item.title.toLowerCase().includes(element.value.toLowerCase());
  });
  document.getElementById("products").innerHTML = '';
  renderProducts(filteredProducts);
}

function handleOffsetChange() {
  limit = parseInt(document.getElementById("offset").value);
  pageCount = 1;
  products = [];
  document.getElementById("products").innerHTML = '';
  fetchData(limit, skip);
}

function handlePageChange(direction) {
  if(totalItem>194){
    document.getElementById("currentPage").disabled = true;
  }else{
    document.getElementById("currentPage").disabled = false;
  }
  pageCount += direction;
  if (pageCount <= 1) {
    pageCount = 1;
    document.getElementById("prevPage").disabled = true;
  } else {
    document.getElementById("prevPage").disabled = false;
  }
  document.getElementById("currentPage").innerText = pageCount;
  products = [];
  skip = (pageCount -1 ) * limit;
  document.getElementById("products").innerHTML = '';
  fetchData(limit, skip);
}

fetchData(limit, skip);

const scrollValue = document.querySelector('.parent-container');
scrollValue.addEventListener('scroll', () => {
  const {scrollHeight, scrollTop, clientHeight} = scrollValue;
  if (scrollTop + clientHeight >= scrollHeight) {
    console.log('I am at the bottom');
    if(totalItem<=194){
      pageCount++;
      document.getElementById("currentPage").innerText = pageCount;
      if(pageCount>1){
        document.getElementById("prevPage").disabled = false;
      }
      skip = (pageCount-1) * limit;
      fetchData(limit, skip);
    }
    
  }
});
