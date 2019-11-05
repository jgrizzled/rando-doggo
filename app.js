'use strict';
//download breed list
function fetchBreeds() {
  fetch('https://dog.ceo/api/breeds/list/all')
    .then(response => response.json())
    .then((json) => {
      populateBreedOptions(json.message);
    })
    .catch((e) => {console.log('Error fetching breeds: ' + e)});
}

//populate select box with breed JSON
function populateBreedOptions(breeds) {
  const formattedBreeds = [];
  //build formatted array from JSON
  for(let breed in breeds) {
    if(breeds[breed].length > 0) {
      breeds[breed].forEach((type) => {
        formattedBreeds.push(
          {
            name: capitalize(type)+' '+capitalize(breed),
            url: breed+'/'+type
          }
        );
      });
    } else {
        formattedBreeds.push(
          {
            name: capitalize(breed),
            url: breed
          });
    }
  }
  //sort array alphabetically
  formattedBreeds.sort((a, b) => {
    if(a.name < b.name) 
      return -1;
    else if(a.name > b.name)
      return 1;
    return 0;
  });
  //write to DOM
  const select = $('select');
  formattedBreeds.forEach((breed) => {
    select.append(`<option value="${breed.url}">${breed.name}</option>`);
  });
}

//download dog image URL list
function fetchDogImages(amount, breed) {
  if(isNaN(amount))
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

  url += parseInt(amount);

  fetch(url)
    .then(response => response.json())
    .then(responseJSON => {
      renderImages(responseJSON.message);
    })
    .catch((e) => {console.log('Error fetching images: ' + e)});
}

//write image URL list to DOM
function renderImages(images) {
  const main = $('main');
  main.html('');
  images.forEach((image) => {
    main.append('<img src="' + image + '" class="dog" alt="dog">');
  });
}

//submit button handler
function handleSubmit(e) {
  e.preventDefault();
  const amount = $('form').find('#amount').val();
  const breed = $('form').find('#breed').val();
  if(!isNaN(amount))
    fetchDogImages(amount, breed);
}

//img click handler to toggle modal
function handleImgClick(e) {
  $('main').off('click', '.dog');
  $('.dialog-container').show();
  $('#img-modal').attr('src', $(e.target).attr('src'));
  $('.close').on('click', handleModalClick);
  $('.overlay').on('click', handleModalClick);
}

//modal click handler to close modal
function handleModalClick(e) {
  $('.close').off('click');
  $('.overlay').off('click');
  $('.dialog-container').hide();
  $('main').on('click', '.dog', handleImgClick);
}

//capitalize first letter of string
function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s[0].toUpperCase() + s.slice(1);
}

$(() => {
  $('.dialog-container').hide();
  $('form').on('submit', handleSubmit);
  $('main').on('click', '.dog', handleImgClick);
  fetchBreeds();
});