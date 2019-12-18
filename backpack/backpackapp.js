const gearList = document.querySelector('#gear-list');
const backpackForm = document.querySelector('#add-gear-form');

function displayGear(doc) {
  let li = document.createElement('li');
  let brand = document.createElement('li');
  let item_name = document.createElement('li');
  let brand_item_name = document.createElement('span');
  let description = document.createElement('span');
  let category = document.createElement('span');
  let weight = document.createElement('span');
  let weight_units = document.createElement('span');
  let weight_and_units = document.createElement('span');
  let del_cross = document.createElement('span');

  li.setAttribute('data-id', doc.id);

  brand.textContent = displayData(doc.data().brand);
  item_name.textContent = displayData(doc.data().item_name);
  brand_item_name.textContent = displayData(doc.data().brand) + ' ' + displayData(doc.data().item_name);
  category.textContent = displayData(doc.data().category);
  weight.textContent = displayData(doc.data().weight);
  weight_units.textContent = displayData(doc.data().weight_units);
  weight_and_units.textContent = displayData(doc.data().weight) + ' ' + displayData(doc.data().weight_units);
  description.textContent = displayData(doc.data().description);
  del_cross.textContent = 'X';

  li.appendChild(brand_item_name);
  li.appendChild(category);
  li.appendChild(weight_and_units);
  li.appendChild(del_cross);
  li.appendChild(description);

  gearList.appendChild(li);

  // update the database
  brand_item_name.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('gear').doc(id).get().then(function(doc) {
      backpackForm.brand.value = doc.data().brand;
      backpackForm.category.value = doc.data().category;
      backpackForm.description.value = doc.data().description;
      backpackForm.item_name.value = doc.data().item_name;
      backpackForm.weight.value = doc.data().weight;
      backpackForm.weight_units.value = doc.data().weight_units;
    });
  })

  // remove from the database
  del_cross.addEventListener('click', (clickAction) =>{
    clickAction.stopPropagation();
    let id = clickAction.target.parentElement.getAttribute('data-id');
    db.collection('gear').doc(id).delete();
  })
}

// display a blank if data is not defined
function displayData(data) {
  if (data === undefined) {
    return ''
  }
  else return data;
}

// retrieve all values from the database
db.collection('gear').orderBy('category').get().then((dbSnapshot) => {
  dbSnapshot.docs.forEach(doc => {
    displayGear(doc);
  })
})

// add an entry into the form
backpackForm.addEventListener('submit', (err) => {
  err.preventDefault();
  db.collection('gear').add({
    brand: backpackForm.brand.value,
    category: backpackForm.category.value,
    description: backpackForm.description.value,
    item_name: backpackForm.item_name.value,
    weight: backpackForm.weight.value,
    weight_units: backpackForm.weight_units.value,
  });
  backpackForm.brand.value = '';
  backpackForm.category.value = '';
  backpackForm.description.value = '';
  backpackForm.item_name.value = '';
  backpackForm.weight.value = '';
  backpackForm.weight_units.value = '';
});
