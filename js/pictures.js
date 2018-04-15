'use strict';

var PICTURES_NUMBER = 25;

var SENTENCES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var DESCRIPTIONS = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var Keycode = {
  ESC: 27,
  ENTER: 13
};

var template = document.querySelector('#picture');
var pictureTemplate = template.content.querySelector('.picture__link');
var picturesList = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var bigPictureImage = bigPicture.querySelector('.big-picture__img');
var bigPictureImg = bigPictureImage.querySelector('img');
var likesCount = bigPicture.querySelector('.likes-count');
var commentsCount = bigPicture.querySelector('.comments-count');
var socialCommentCount = bigPicture.querySelector('.social__comment-count');
var socialCommentLoad = bigPicture.querySelector('.social__comment-loadmore');
var bigPictureClose = document.querySelector('#picture-cancel');


// Получение случайного числа
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};


// Перестановка двух элементов в массиве
var swapElements = function (array, index1, index2) {
  var temporaryValue = array[index1];
  array[index1] = array[index2];
  array[index2] = temporaryValue;
};


// Копирование массива
var copyArray = function (array) {
  var newArray = [];

  for (var i = 0; i < array.length; i++) {
    newArray[i] = array[i];
  }

  return newArray;
};


// Создание массива нужной длины
var createArray = function (array, length) {
  var newArray = [];

  for (var i = 0; i < length; i++) {
    var randomIndex = getRandomNumber(0, array.length - 1);
    newArray[i] = array[randomIndex];
  }

  return newArray;
};


// Перемешивание массива
var shuffleArray = function (array) {
  for (var i = 0; i < array.length; i++) {
    var randomIndex = Math.floor(Math.random() * i);
    swapElements(array, i, randomIndex);
  }

  return array;
};


// Создание массива комментов. Не помню, что я пыталась тут получить
var createComments = function () {
  var comments = [];
  var sentences = createArray(copyArray(SENTENCES), PICTURES_NUMBER);
  var randomLength = getRandomNumber(1, PICTURES_NUMBER);

  for (var i = 0; i < randomLength; i++) {
    var length = getRandomNumber(1, 2);

    for (var j = 0; j < length; j++) {
      comments[i] += sentences[j];
    }
  }

  return comments;
};


// Потенциально универсальная функция
var createSomeText = function (array) {
  var newArray = [];
  var text = createArray(copyArray(array), PICTURES_NUMBER);

  for (var i = 0; i < PICTURES_NUMBER; i++) {
    newArray[i] = text[i];
  }

  return shuffleArray(newArray);
};


// Создание массива подписей. Вот эта функция работает как надо. Из неё, наверное,
// можно сделать универсальную, чтобы генерить и подписи, и комменты
var createDescriptions = function () {
  var descriptions = [];
  var sentences = createArray(copyArray(DESCRIPTIONS), PICTURES_NUMBER);

  for (var i = 0; i < PICTURES_NUMBER; i++) {
    descriptions[i] = sentences[i];
  }

  return shuffleArray(descriptions);
};


// Создание массива фоточек
var createPictures = function () {
  var pictures = [];

  for (var i = 0; i < PICTURES_NUMBER; i++) {
    var comments = createComments();
    var descriptions = createDescriptions();

    pictures[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomNumber(15, 200),
      comments: shuffleArray(comments),
      descriptions: shuffleArray(descriptions)
    };
  }

  return shuffleArray(pictures);
};


// Создание болванки для превьюшки
var getPicture = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__stat--likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__stat--comments').textContent = picture.comments.length;

  return pictureElement;
};


// Создание какого-нибудь элемента
var makeElement = function (tagName, className, text) {
  var element = document.createElement(tagName);
  element.classList.add(className);

  if (text) {
    element.textContent = text;
  }

  return element;
};


// Отрисовка комментариев к большой фотке
var renderComments = function (picture) {
  var commentsList = document.querySelector('.social__comments');
  var comments = picture.comments;

  for (var i = 0; i < comments.length; i++) {
    var commentItem = makeElement('li', 'social__comment--text');
    var avatar = makeElement('img', 'social__picture');

    avatar.src = 'img/avatar-' + getRandomNumber(1, 6) + '.svg';
    commentItem.appendChild(avatar);
    commentsList.appendChild(commentItem);
  }

  return commentsList;
};


// Заполнение и показ большой фоточки
var fillOverlay = function (picture) {
  bigPictureImg.src = picture.querySelector('.picture__img').getAttribute('src');
  likesCount.textContent = picture.querySelector('.picture__stat--likes').textContent;
  commentsCount.textContent = picture.querySelector('.picture__stat--comments').textContent;

  bigPicture.classList.remove('hidden');
  socialCommentCount.classList.add('visually-hidden');
  socialCommentLoad.classList.add('visually-hidden');
  document.addEventListener('keydown', onBigPictureCloseEscKeydown);
};


// Отрисовывание фоточек
var renderPictures = function (array) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < array.length; i++) {
    var currentPicture = getPicture(array[i]);

    fragment.appendChild(currentPicture);
    currentPicture.addEventListener('click', function (evt) {
      evt.preventDefault();
      fillOverlay(evt.currentTarget);
      renderComments(array[i]); // Вот это херня
    });
  }

  picturesList.appendChild(fragment);
};


// Закрытие большой фоточки
var closeBigPicture = function () {
  bigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onBigPictureCloseEscKeydown);
};


// Закрытие большой фоточки эскейпом
var onBigPictureCloseEscKeydown = function (evt) {
  if (evt.keyCode === Keycode.ESC) {
    closeBigPicture();
  }
};

var pictures = createPictures();
renderPictures(pictures);

bigPictureClose.addEventListener('click', function () {
  closeBigPicture();
});

bigPictureClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === Keycode.ENTER) {
    closeBigPicture();
  }
});

document.addEventListener('keydown', onBigPictureCloseEscKeydown);
