let data;

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

function loadData() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'items.json', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var jsonData = JSON.parse(xhr.responseText);
            data = jsonData;
            showItems(data.items);
            document.getElementById("genDesc").textContent = data.description;
        }
    };
    xhr.send();
}

function showItems(items) {
    const cont = document.getElementById("cardCont");
    cont.innerHTML = "";

    items.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
                 <div class="title">${item.name}</div>
                 <div class="desc">${item.description}</div>
                 <div class="price">$${item.price}</div>
                 <div class="meta">Author: ${data.metadata.author} | Created: ${formatDate(data.metadata.creationDate)}</div>
                `;
        cont.appendChild(card);
    });
}

function filterByPrice(minPrice) {
    const filtered = data.items.filter(item => item.price > minPrice);
    showItems(filtered);
}

function sortItems(by, order) {
    const sorted = [...data.items].sort((a, b) => {
        const aVal = a[by];
        const bVal = b[by];
        return order === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
    showItems(sorted);
}

document.getElementById('addForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name');
    const desc = document.getElementById('desc');
    const price = document.getElementById('price');

    let valid = true;
    if (name.value.trim() === "") {
        document.getElementById('nameErr').textContent = "Required";
        valid = false;
    } else { document.getElementById('nameErr').textContent = ""; }
    if (desc.value.trim() === "") {
        document.getElementById('descErr').textContent = "Required";
        valid = false;
    } else { document.getElementById('descErr').textContent = ""; }
    if (price.value <= 0) {
        document.getElementById('priceErr').textContent = "Must be > 0";
        valid = false;
    } else { document.getElementById('priceErr').textContent = ""; }

    if (valid) {
        const newItem = {
            name: name.value,
            description: desc.value,
            price: parseInt(price.value)
        };

        data.items.push(newItem);
        showItems(data.items);

        name.value = "";
        desc.value = "";
        price.value = "";
    }
});

loadData();