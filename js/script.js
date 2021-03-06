ready(function() {

  let booksByUri = {};

  books.forEach(function(item) {
    booksByUri[item.uri] = item;
  });

  function burgerMenu() {
    const burgerBtn = document.querySelector(".burger");
    const burgerMenu = document.getElementById("nav");

    burgerMenu.addEventListener("click", function() {
      this.classList.toggle("main-nav--open");
      burgerBtn.classList.toggle("burger--close");
    });
  }

  burgerMenu();

  // filter switcher

  const filterSwitcher = document.getElementById("filters");
  const fitltetsTrigger = document.getElementById("filters-trigger");

  function callFilter() {
    filterSwitcher.classList.toggle("filters--open");
  }

  fitltetsTrigger.addEventListener("click", callFilter);

  // getting 10 books from array
  let newArr = books.slice(0, 11);

  // card rendering

  const fragment = document.createDocumentFragment();
  const bookCard = document.querySelector(".card");

  newArr.forEach(function(item) {
    const newCard = bookCard.cloneNode(true);

    newCard.dataset.uri = item.uri;
    newCard.querySelector(".card__title").textContent = item.name;
    newCard.querySelector(".card__price").textContent = item.price;
    newCard.querySelector(".card__img").src = `img/${item.uri}.jpg`;

    // if ( item.new === true ) {
    //   newCard.classList.add('card__new');
    // }

    fragment.appendChild(newCard);
  });

  document.querySelector(".catalog__books-list").appendChild(fragment);

  // delete first card

  

  // popup

  const cardLink = document.querySelectorAll(".card");
  const page = document.querySelector(".page");
  const modal = document.getElementById("modal-book-view");
  const closeBtnPopup = document.querySelector(".modal__close");
  const closePopupAround = document.querySelector(".modal");

  for (let i = 0; i < cardLink.length; i++) {
    cardLink[i].addEventListener("click", openModal);
  }

  closePopupAround.addEventListener("click", function(e) {
    // проверить был ли клик вне зоны контента
    // как понять где был клик : e.target

    if (e.target === closePopupAround) {
      closeModal();
    }
  });
  closeBtnPopup.addEventListener("click", closeModal);

  function openModal(event) {
    let uri = event.currentTarget.dataset.uri;
    let book = booksByUri[uri];
    page.classList.toggle("js-modal-open");
    modal.classList.toggle("modal--open");
    fillModal(book);
  }

  function closeModal() {
    page.classList.remove("js-modal-open");
    modal.classList.remove("modal--open");
  }

  function fillModal(book) {
    let popup = document.querySelector(".modal__content");

    popup.querySelector(".product__title").innerHTML = book.name;
    popup.querySelector(".product__descr p").innerHTML = book.desc;
    popup.querySelector(".btn--price").firstChild.nodeValue = `${book.price}₽`;

    popup.querySelector(".product__img-wrap img").src = `img/${book.uri}.jpg`;
  }

  // amount of cards

  const showBooksAmount = document.getElementById("books-num");
  showBooksAmount.innerHTML = cardLink.length;

  // filter search

  const nameInput = document.getElementById("book-name");
  const booksCatalogue = document.querySelector(".catalog__books-list");

  nameInput.addEventListener("input", () => {
    console.log(nameInput.value);
  });

  // -> .name
  // -> .value

  // for ()
  //   isMatch(book.name, input.value)

  // @param {string} - needle, what we looking for
  // @param {string} - haystack, where we looking for
  function isMatch(needle, haystack) {
    for (let j = 0; j < nameInput.length; j++) {
      for (let i = 0; i < booksCatalogue.length; i++) {
        if (booksCatalogue[i] === nameInput[j]) {
          break;
        }
      }
      if (i === booksCatalogue.length) {
        return false;
      }
    }

    return true;
  }

  // ВНИМАНИЕ!
  // Нижеследующий код (кастомный селект и выбор диапазона цены) работает
  // корректно и не вызывает ошибок в консоли браузера только на главной.
  // Одна из ваших задач: сделать так, чтобы на странице корзины в консоли
  // браузера не было ошибок.

  // Кастомные селекты (кроме выбора языка)
  new Choices(".field-select:not(#lang) select.field-select__select", {
    searchEnabled: false,
    shouldSort: false
  });
  // Кастомный селект выбора языка отдельно
  new Choices("#lang select.field-select__select", {
    searchEnabled: false,
    shouldSort: false,
    callbackOnCreateTemplates: function(template) {
      return {
        item: (classNames, data) => {
          return template(`
			<div class="${classNames.item} ${
            data.highlighted
              ? classNames.highlightedState
              : classNames.itemSelectable
          }" data-item data-id="${data.id}" data-value="${data.value}" ${
            data.active ? 'aria-selected="true"' : ""
          } ${data.disabled ? 'aria-disabled="true"' : ""}>
				${getLangInSelectIcon(data.value)} ${data.label.substr(0, 3)}
			</div>
			`);
        },
        choice: (classNames, data) => {
          return template(`
			<div class="${classNames.item} ${classNames.itemChoice} ${
            data.disabled ? classNames.itemDisabled : classNames.itemSelectable
          }" data-select-text="${this.config.itemSelectText}" data-choice ${
            data.disabled
              ? 'data-choice-disabled aria-disabled="true"'
              : "data-choice-selectable"
          } data-id="${data.id}" data-value="${data.value}" ${
            data.groupId > 0 ? 'role="treeitem"' : 'role="option"'
          }>
				${getLangInSelectIcon(data.value)} ${data.label}
			</div>
			`);
        }
      };
    }
  });
  function getLangInSelectIcon(value) {
    if (value == "ru") return '<span class="field-select__lang-ru"></span>';
    else if (value == "en")
      return '<span class="field-select__lang-en"></span>';
    return '<span class="field-select__lang-null"></span>';
  }

  // Выбор диапазона цен
  var slider = document.getElementById("price-range");
  noUiSlider.create(slider, {
    start: [400, 1000],
    connect: true,
    step: 100,
    range: {
      min: 200,
      max: 2000
    }
  });
});

function ready(fn) {
  if (
    document.attachEvent
      ? document.readyState === "complete"
      : document.readyState !== "loading"
  ) {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}
