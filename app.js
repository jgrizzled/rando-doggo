'use strict';
const breedsList = [];
//download breed list
function fetchBreeds() {
  fetch('https://dog.ceo/api/breeds/list/all')
    .then(response => response.json())
    .then((json) => {
      populateBreedList(json.message);
    })
    .catch((e) => {
      $('main').html('<p><b>Error fetching breeds list:</b><br>' + e + '</p>');
    });
}

//populate select box with breed JSON
function populateBreedList(breeds) {
  //build formatted array from JSON
  for(let breed in breeds) {
    if(breeds[breed].length > 0) {
      breeds[breed].forEach((type) => {
        breedsList.push(
          {
            name: capitalize(type)+' '+capitalize(breed),
            url: breed+'/'+type
          }
        );
      });
    } else {
        breedsList.push(
          {
            name: capitalize(breed),
            url: breed
          });
    }
  }
  //sort array alphabetically
  breedsList.sort((a, b) => {
    if(a.name < b.name) 
      return -1;
    else if(a.name > b.name)
      return 1;
    return 0;
  });

  //write to DOM
  const datalist = $('datalist');
  breedsList.forEach((breed) => {
    datalist.append(`<option value="${breed.name}">`);
  });
}

//download dog image URL list
function randomDogImages(amount) {
  if(isNaN(amount))
    amount = 3;
  else if(amount < 1)
    amount = 1;
  else if(amount > 50)
    amount = 50;

  let url = 'https://dog.ceo/api/breeds/image/random/';

  url += parseInt(amount);

  fetchDogImages(url)
}

function fetchDogImages(url) {
  fetch(url)
    .then(response => {
      if(!response.ok)
        throw new Error(response.status)
      return response.json();
    })
    .then(responseJSON => {
      renderImages(responseJSON.message);
    })
    .catch((e) => {
      if(e.toString().includes('404'))
        $('main').html('<p><b>Error!</b><br>Breed not found</p>');
      else
        $('main').html('<p><b>Error!</b><br>'+e+'</p>');
    });
}

function breedDogImage(breed) {
  let breedURL = breed;
  for(const breedObj of breedsList) {
    if(breedObj.name.toLowerCase() == breed.toLowerCase()) {
      breedURL = breedObj.url;
      break;
    }
  }
  const url = 'https://dog.ceo/api/breed/' + breedURL + '/images/random/1';
  fetchDogImages(url)
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
  if($('input[name=query-type]:checked').val() == 'random')
    randomDogImages(amount);
  else if($('input[name=query-type]:checked').val() == 'breed')
    breedDogImage(breed);
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

function displayForm(e) {
  if($('input[name=query-type]:checked').val() == 'random') {
    $('#breed-form').hide()
    $('#random-form').show()
  }
else if($('input[name=query-type]:checked').val() == 'breed') {
  $('#random-form').hide()
  $('#breed-form').show()
}
}

$(() => {
  $('.dialog-container').hide();
  $('#breed-form').hide()
  $('#random-form').show()
  $('form').on('submit', handleSubmit);
  $('main').on('click', '.dog', handleImgClick);
  $('input[name=query-type]').on('click', displayForm);
  fetchBreeds();
});