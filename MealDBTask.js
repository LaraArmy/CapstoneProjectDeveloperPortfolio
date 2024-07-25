document.getElementById('order-button').addEventListener('click', function() {
  let mainIngredient = prompt("Please enter the main ingredient for your meal");
  fetchChefFavourites(mainIngredient);
});

function fetchChefFavourites(ingredient) {
  let apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient.toLowerCase().replace(/\s+/g, "_")}`;
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.meals) {
        let randomIndex = Math.floor(Math.random() * data.meals.length);
        let randomMeal = data.meals[randomIndex];
        let order = {
          description: randomMeal.strMeal,
          orderNumber: generateOrderNumber(),
          status: "incomplete"
        };
        storeOrder(order);
      } else {
        alert("No meals found for the provided ingredient. Please try again.");
        fetchChefFavourites(prompt("Please enter a different main ingredient for your meal"));
      }
    })
    .catch(error => console.error("Error fetching chef favourites:", error));
}

function generateOrderNumber() {
  return Math.floor(Math.random() * 1000);
}

function storeOrder(order) {
  let orders = JSON.parse(sessionStorage.getItem("orders")) || [];
  orders.push(order);
  sessionStorage.setItem("orders", JSON.stringify(orders));
}

function displayOrders() {
  let orders = JSON.parse(sessionStorage.getItem("orders")) || [];
  let incompleteOrders = orders.filter(order => order.status === "incomplete");
  if (incompleteOrders.length === 0) {
    alert("No incomplete orders to display");
    return;
  }

  let orderList = "Incomplete Orders:\n";
  incompleteOrders.forEach(order => {
    orderList += `Order Number: ${order.orderNumber} - Description: ${order.description}\n`;
  });

  let completionInput = prompt(orderList + "\nEnter the order number to mark as complete (or enter 0 to cancel)");
  if (completionInput !== null && !isNaN(completionInput)) {
    let orderNumber = parseInt(completionInput);
    completeOrder(orderNumber);
  }
}

function completeOrder(orderNumber) {
  let orders = JSON.parse(sessionStorage.getItem("orders")) || [];
  let orderIndex = orders.findIndex(order => order.orderNumber === orderNumber);
  if (orderIndex !== -1) {
    orders[orderIndex].status = "completed";
    sessionStorage.setItem("orders", JSON.stringify(orders));
    alert(`Order number ${orderNumber} marked as completed.`);
  } else {
    alert(`Order number ${orderNumber} does not exist.`);
  }
}
