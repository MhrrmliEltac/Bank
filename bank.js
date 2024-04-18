const sendButton = document.querySelector(".sendButton");
const From = document.querySelector(".From");
const To = document.querySelector(".To");
const Amount = document.querySelector(".Amount");
const ulList = document.querySelector(".ul");
const deleteButton = document.querySelector(".delete");
const addButton = document.querySelector(".addButton");

//? --> Data əldə edilməsi

const listData = (data) => {
  ulList.innerHTML = "";
  for (let element in data) {
    const fromValue = data[element].from;
    const toValue = data[element].to;
    const amountValue = data[element].amount;
    console.log(fromValue, toValue, amountValue);
    const newList = document.createElement("li");
    const paragraph = document.createElement("p");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");
    editButton.classList.add("editButton");
    paragraph.classList.add("paragraph");
    editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    deleteButton.classList.add("delete");
    deleteButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';

    //? --> Data silinməsi
    deleteButton.addEventListener("click", (event) => {
      const id = data[element].id;
      fetch(`https://acb-api.algoritmika.org/api/transaction/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(() => {
          console.log("Kayıt başarıyla silindi.");
          if (ulList.children.length === 1) {
            ulList.style.display = "none"; // Eğer liste boşsa gizle
          } else {
            ulList.style.display = "flex"; // Değilse görünür yap
          }
          fetchDataAndList();
        })
        .catch((error) => {
          console.error("Fetch hatası:", error);
        });
    });

    //? --> Data düzəldilməsi
    editButton.addEventListener("click", (event) => {
      const id = data[element].id;
      From.value = data[element].from;
      To.value = data[element].to;
      Amount.value = data[element].amount;
      addButton.addEventListener("click", (e) => {
        const FromValue = From.value;
        const ToValue = To.value;
        const AmountValue = Amount.value;
        fetch(`https://acb-api.algoritmika.org/api/transaction/${id}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            from: FromValue,
            to: ToValue,
            amount: AmountValue,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            console.log("Kayıt başarıyla güncellendi.");
            fetchDataAndList();
            location.reload();
          })
          .catch((error) => {
            console.error("Fetch hatası:", error);
          });
      });
    });

    paragraph.textContent = `From: ${data[element].from}
      To: ${data[element].to}
      Amount: ${data[element].amount}`;
    newList.appendChild(editButton);
    newList.appendChild(deleteButton);
    newList.appendChild(paragraph);
    ulList.appendChild(newList);

    ulList.style.display = "flex";
  }
};

const fetchDataAndList = () => {
  fetch("https://acb-api.algoritmika.org/api/transaction")
    .then((response) => response.json())
    .then((data) => {
      listData(data);
    })
    .catch((error) => console.log(`Fetch error: ${error}`));
};

// Sayfa yüklendiğinde verileri listele
fetchDataAndList();

//? --> Data əlavə etmək

sendButton.addEventListener("click", () => {
  if (From.value === "" || To.value === "" || Amount.value === "") {
    alert("Zehmet olmasa formu doldurun");
  } else {
    fetch("https://acb-api.algoritmika.org/api/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: From.value,
        to: To.value,
        amount: Amount.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchDataAndList();
        From.value = '';
        To.value = '';
        Amount.value = '';
      });
  }
});
