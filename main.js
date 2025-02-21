function formatDate(dateString) {
    const date = new Date(dateString);

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];

    const day = date.getDate();
    const year = date.getFullYear();

    return `${monthName} ${day}, ${year}`;
}

let data;

function loadData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'items.json', true);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            data = JSON.parse(xhr.responseText);
            showItems(data.items);
            document.getElementById("main").textContent = data.description;

        } else {
            console.error('Error loading JSON:', xhr.status, xhr.statusText);
            document.getElementById("data-container").innerHTML = "Error loading data.";
        }
    };

    xhr.onerror = function () {
        console.error('Network Error occurred');
        document.getElementById("data-container").innerHTML = "A network error occurred.";
    };

    xhr.send();
}

function showItems(items) {
    const cont = document.getElementById("cardCont");
    cont.innerHTML = "";

    items.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");



        const creationDate = formatDate(data?.metadata?.creationDate ?? item?.creationDate); card.innerHTML = `
            <div class="title">${item.name}</div>
            <div class="desc">${item.description}</div>
            <div class="price">$${item.price}</div>
            <div class="meta">Author: ${data.metadata?.author || "Author not available"} | Created: ${creationDate}</div> 
        `;
        cont.appendChild(card);
    });
}

function filterByPrice(minPrice) {
    if (data?.items) {
        const filtered = data.items.filter(item => item.price > minPrice);
        showItems(filtered);
    }
}

function sortItems(by, order) {
    if (data?.items) {
        const sorted = [...data.items].sort((a, b) => {
            const aVal = a[by];
            const bVal = b[by];

            let comparisonResult;
            if (order === 'asc') {
                comparisonResult = aVal > bVal ? 1 : -1;
            } else {
                comparisonResult = aVal < bVal ? 1 : -1;
            }
            return comparisonResult;
        });
        showItems(sorted);
    }
}

document.getElementById('addForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const descInput = document.getElementById('desc');
    const priceInput = document.getElementById('price');


    document.getElementById('nameErr').textContent = "";
    document.getElementById('descErr').textContent = "";
    document.getElementById('priceErr').textContent = "";

    let isValid = true;

    if (nameInput.value.trim() === "") {
        document.getElementById('nameErr').textContent = "Required";
        isValid = false;
    }

    if (descInput.value.trim() === "") {
        document.getElementById('descErr').textContent = "Required";
        isValid = false;
    }

    const price = Number(priceInput.value);
    if (isNaN(price) || price <= 0) {
        document.getElementById('priceErr').textContent = "Must be > 0";
        isValid = false;
    }

    if (isValid && data?.items) {
        const newItem = {
            name: nameInput.value,
            description: descInput.value,
            price: price
        };

        data.items.push(newItem);
        showItems(data.items);


        nameInput.value = "";
        descInput.value = "";
        priceInput.value = "";
    }
});

loadData();
filterByPrice(200);
sortItems('price', 'desc'); 
