const host = 'http://localhost:3000';

const getListsButton = document.getElementById('get-lists');
const getListsResult = document.getElementById('get-lists-result');

let selectedListId = null;

// Funzione Carica Liste
function loadLists() {
  apiRequest(host + "/lists", 'GET', {})
    .then(data => {
      getListsResult.innerHTML = "";
      const table = document.createElement("table");
      const headerRow = document.createElement("tr");
      headerRow.innerHTML = "<th>Titolo</th><th>Descrizione</th><th>Azioni</th>";
      table.appendChild(headerRow);

      for (const list of data) {
        const tr = document.createElement("tr");
        tr.className = "trlist";
        const td1 = document.createElement("td");
        td1.innerHTML = list.name;
        tr.appendChild(td1);
        const td2 = document.createElement("td");
        td2.innerHTML = list.description;
        tr.appendChild(td2);
        const tdActions = document.createElement("td");

        // Elimina Lista
        const deleteBtn = document.createElement("text");
        deleteBtn.innerHTML = "❌";
        deleteBtn.classList.add("delete-Btn", "icon");
        deleteBtn.addEventListener("click", () => {
          apiRequest(host + "/lists/" + list.id, "DELETE", {})
            .then(loadLists);
        });

        // Aggiorna Lista
        const updateBtn = document.createElement("text");
        updateBtn.innerHTML = "✏️";
        updateBtn.classList.add("update-Btn", "icon");
        updateBtn.addEventListener("click", () => {
          const nameInput = document.createElement("input");
          nameInput.value = list.name;
          const descInput = document.createElement("input");
          descInput.value = list.description;
          td1.innerHTML = "";
          td2.innerHTML = "";
          td1.appendChild(nameInput);
          td2.appendChild(descInput);
          const saveBtn = document.createElement("button");
          saveBtn.innerText = "Salva";
          saveBtn.className = "save-Btn"
          saveBtn.addEventListener("click", () => {
            apiRequest(host + "/lists/" + list.id, "PUT", {
              name: nameInput.value,
              description: descInput.value
            }).then(loadLists);
          });
          tdActions.innerHTML = "";
          tdActions.appendChild(saveBtn);
        });

        // VEDI TASKS
        const viewBtn = document.createElement("text");
        viewBtn.innerHTML = "📋";
        viewBtn.classList.add("view-Btn", "icon");
        viewBtn.addEventListener("click", () => {
          selectedListId = list.id;
          loadItems();
        });
        tdActions.appendChild(viewBtn);
        tdActions.appendChild(updateBtn);
        tdActions.appendChild(deleteBtn);
        tr.appendChild(tdActions);
        table.appendChild(tr);
      }
      getListsResult.appendChild(table);
    });
}

// LISTE 
getListsButton.addEventListener('click', () => {
  if (getListsResult.innerHTML !== "") {
    getListsResult.innerHTML = "";
    return;
  }
  loadLists();
});


// Crea una nuova lista
const addNewList = document.getElementById('create-list');
const listInput = document.getElementById('list-id');
const descriptionInput = document.getElementById("description-input");
addNewList.addEventListener('click', () => {
  apiRequest(host + "/lists", "POST", {
    name: listInput.value,
    description: descriptionInput.value
  })
    .then(() => {
      listInput.value = "";
      descriptionInput.value = "";
      loadLists();
    });
});

// Funzione Carica Tasks
function loadItems() {
  apiRequest(host + "/lists/" + selectedListId + "/items", "GET", {})
    .then(data => {
      const container = document.getElementById("tasks-container");
      container.innerHTML = "";
      const table = document.createElement("table");
      const header = document.createElement("tr");
      header.innerHTML = "<th>Testo</th><th>Stato</th><th>Azioni</th>";
      table.appendChild(header);

      for (const item of data) {
        const tr = document.createElement("tr");
        tr.classList.add("trlist");
        const td1 = document.createElement("td");
        td1.innerText = item.name;
        tr.appendChild(td1);
        const td2 = document.createElement("td");
        td2.innerText = item.stato;
        td2.className = item.stato;
        tr.appendChild(td2);
        const tdActions = document.createElement("td");

        // Cambia Stato
        const toggleBtn = document.createElement("text");
        toggleBtn.innerText = "✔";
        toggleBtn.classList.add("toggle-Btn", "icon");
        toggleBtn.addEventListener("click", () => {
          apiRequest(host + "/items/" + item.id, "PUT", {
            name: item.name,
            stato: item.stato === "Todo" ? "Done" : "Todo"
          }).then(loadItems);
        });

        // Modifica Tasks
        const editBtn = document.createElement("text");
        editBtn.innerText = "✏️";
        editBtn.classList.add("edit-Btn", "icon");
        editBtn.addEventListener("click", () => {
          const input = document.createElement("input");
          input.value = item.name;
          td1.innerHTML = "";
          td1.appendChild(input);
          const saveBtn = document.createElement("button");
          saveBtn.innerText = "Salva";
          saveBtn.className = "save-Btn"
          saveBtn.addEventListener("click", () => {
            apiRequest(host + "/items/" + item.id, "PUT", {
              name: input.value,
              stato: item.stato
            }).then(loadItems);
          });
          tdActions.innerHTML = "";
          tdActions.appendChild(saveBtn);
        });

        // Elimina Tasks
        const deleteBtn = document.createElement("text");
        deleteBtn.innerText = "❌";
        deleteBtn.classList.add("delete-Btn", "icon");
        deleteBtn.addEventListener("click", () => {
          apiRequest(host + "/items/" + item.id, "DELETE", {})
            .then(loadItems);
        });
        tdActions.appendChild(toggleBtn);
        tdActions.appendChild(editBtn);
        tdActions.appendChild(deleteBtn);
        tr.appendChild(tdActions);
        table.appendChild(tr);
      }
      container.appendChild(table);
    });

}

// Crea una nuova tasks
const addTaskButton = document.getElementById("add-task");
const taskInput = document.getElementById("task-input");
addTaskButton.addEventListener("click", () => {
  if (!selectedListId) {
    alert("Seleziona prima una lista");
    return;
  }
  apiRequest(host + "/items", "POST", {
    name: taskInput.value,
    id_list: selectedListId,
    stato: "Todo"
  })
    .then(() => {
      taskInput.value = "";
      loadItems();
    });
});