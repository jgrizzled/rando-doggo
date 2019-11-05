'use strict';
function fetchBreeds() {
  fetch('https://dog.ceo/api/breeds/list/all')
    .then(response => response.json())
    .then((json) => {
      populateBreedOptions(json.message);
    })
    .catch((e) => {console.log('Error fetching breeds: ' + e)});
}

function populateBreedOptions(breeds) {
  const select = $('select');
  for(let breed in breeds) {
    if(breeds[breed].length > 0)
      breeds[breed].forEach((type) => {
        select.append(`<option value="${breed}/${type}">${capitalize(type)} ${capitalize(breed)}</option>`);
      });
    else
      select.append(`<option value="${breed}">${capitalize(breed)}</option>`);
  }
}

function fetchDogImages(amount, breed) {
  if(amount === undefined)
    amount = 3;
  else if(amount < 1)
    amount = 1;
  else if(amount > 50)
    amount = 50;

  let url = '';
  if(breed === 'any' || breed === undefined)
    url = 'https://dog.ceo/api/breeds/image/random/';
  else
    url = 'https://dog.ceo/api/breed/' + breed + '/images/random/';

  url += amount;

  fetch(url)
    .then(response => response.json())
    .then(responseJSON => {
      renderImages(responseJSON.message);
    })
    .catch((e) => {console.log('Error fetching images: ' + e)});
}

function renderImages(images) {
  const main = $('main');
  main.html('');
  images.forEach((image) => {
    main.append('<img src="' + image + '" alt="dog">');
  });
}

function handleSubmit(e) {
  e.preventDefault();
  const amount = $('form').find('#amount').val();
  const breed = $('form').find('#breed').val();
  if(!isNaN(amount))
    fetchDogImages(amount, breed);
}

function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s[0].toUpperCase() + s.slice(1);
}


$(() => {
  $('form').on('submit', handleSubmit);
  fetchBreeds();
});