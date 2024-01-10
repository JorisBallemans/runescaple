const input = document.getElementById("guess");
const guessSuggestions = document.getElementById("guess_suggestions");
const guessForm = document.getElementById("guessForm");

const randomHash = dateToRandomHash();
const itemOfTheDay = data[items[randomHash]];
const itemOfTheDayAttr = [itemOfTheDay.first_char, itemOfTheDay.release_date, itemOfTheDay.price, itemOfTheDay.weight, itemOfTheDay.equipable]

input.addEventListener("keyup", function () {
    if (input.value != "") {
        guessSuggestions.innerHTML = "";
        const guessValue = input.value.toLowerCase();

        const filteredData = items.filter(item => item.toLowerCase().includes(guessValue));

        filteredData.forEach(item => {
            const listed_item = document.createElement("li");
            listed_item.className = "list-group-item";
            listed_item.textContent = item;

            listed_item.addEventListener("click", function () {
                input.value = item;
                guessSuggestions.innerHTML = "";
            });

            guessSuggestions.appendChild(listed_item);
        });
    }
    else {
        guessSuggestions.innerHTML = "";
    }
});

guessForm.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log(data[input.value]);
    values = checkGuess(input.value);
    displayGuess(input.value, values);
    input.value = "";
});

function dateToRandomHash() {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    const dateString = `${year}-${month}-${day}`;

    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        const char = dateString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash &= hash;
    }

    const positiveHash = Math.abs(hash);

    const scaledResult = positiveHash % 3738;

    return scaledResult;
}

function checkGuess(userGuess) {
    item = data[userGuess];
    if (item == undefined) {
        console.log("Item does not exist");
        return [];
    }
    if (item == itemOfTheDay) {
        console.log("Correct");
        return [item.first_char, item.release_date, item.price, item.weight, item.equipable];
    }
    return [item.first_char, item.release_date, item.price, item.weight, item.equipable];
}

function getCharColor(c1, c2) {
    const charCode1 = c1.charCodeAt(0);
    const charCode2 = c2.charCodeAt(0);

    if (Math.abs(charCode1 - charCode2) === 1) {
        return "#e6cd17d9";
    }
    if (charCode1 === charCode2) {
        return "#3cda44d9";
    }
    return "#505050d9";
}

function getDateColor(d1, d2) {
    if (d1.getTime() === d2.getTime()) {
        return "#3cda44d9";
    }
    if (d1.getFullYear() === d2.getFullYear()) {
        return "#e6cd17d9";
    }
    return "#505050d9";

}

function getPriceColor(p1, p2) {
    if (Math.abs(p1 - p2) <= 25) {
        return "#3cda44d9";
    }
    if (p1 == p2) {
        return "#e6cd17d9";
    }
    return "#505050d9";
}

function getWeightColor(w1, w2) {
    if (Math.abs(w1 - w2) <= 0.1) {
        return "#3cda44d9";
    }
    if (w1 == w2) {
        return "#e6cd17d9";
    }
    return "#505050d9";
}

function getReleaseOrder(d1, d2) {
    if (d2 > d1) {
        return " 🔺";
    }
    if (d2 < d1) {
        return " 🔻";
    }
    return "";
}

function getNumberOrder(n1, n2) {
    if (n2 > n1) {
        return " 🔺";
    }
    if (n2 < n1) {
        return " 🔻";
    }
    return "";
}

function displayGuess(name, values) {
    if(values.length == 0){
        return;
    }
    first_char = values[0];
    first_char_color = getCharColor(values[0], itemOfTheDayAttr[0]);
    // console.log(first_char)

    release_date = values[1].toISOString().split('T')[0] + getReleaseOrder(values[1], itemOfTheDayAttr[1]);
    release_date_color = getDateColor(values[1], itemOfTheDayAttr[1]);
    // console.log(release_date)

    price = values[2] + getNumberOrder(values[2], itemOfTheDayAttr[2]);
    price_color = getPriceColor(values[2], itemOfTheDayAttr[2]);
    // console.log(price)

    weight = values[3] + getNumberOrder(values[3], itemOfTheDayAttr[3]);
    weight_color = getWeightColor(values[3], itemOfTheDayAttr[3]);
    // console.log(weight)

    equipable = values[4] ? "Equipable" : "Not Equipable";
    equipable_color = (values[4] === itemOfTheDayAttr[4]) ? "#3cda44d9" : "#505050d9";
    // console.log(equipable)

    insert = `
    <div class="row mx-5 mt-4">
        <h1 class="text-center">${name}</h1>
        <div class="col">
            <div style="background-color: ${first_char_color}" class="border border-dark border-5 mb-4 square">
                <h2 class="text-center">${first_char}</h2>
            </div>
        </div>
        <div class="col">
            <div style="background-color: ${release_date_color}" class="border border-dark border-5 mb-4 square">
                <h2 class="text-center">${release_date}</h2>
            </div>
        </div>
        <div class="col">
            <div style="background-color: ${price_color}" class="border border-dark border-5 mb-4 square">
                <h2 class="text-center">${price}</h2>
            </div>
        </div>
        <div class="col">
            <div style="background-color: ${weight_color}" class="border border-dark border-5 mb-4 square">
                <h2 class="text-center">${weight}</h2>
            </div>
        </div>
        <div class="col">
            <div style="background-color: ${equipable_color}" class="border border-dark border-5 mb-4 square">
                <h2 class="text-center">${equipable}</h2>
            </div>
        </div>
    </div>`

    document.getElementById("guesses").innerHTML = insert + document.getElementById("guesses").innerHTML;
}
