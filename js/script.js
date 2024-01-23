
//Скролл Про Нас
const aboutUs = document.querySelector('.info')
const aboutUsLink = document.querySelector('#about-us')

aboutUsLink.addEventListener('click', function(event){
  event.preventDefault()

  window.scroll({
    left: 0,
    top: aboutUs.offsetTop,
    behavior: 'smooth'
  })
})




//////////////////////////////////////Корзина


const cards = document.querySelectorAll('.card')

const modalCart = document.querySelector('.modal__cart')
const cartCount = document.querySelector('.cart__count')
const cartBtn = document.querySelector('.cart')
const cartStorage = JSON.parse(localStorage.getItem('cart')) || [] //массив з локалсторейдж

//Проверка на наявність данних в локалсторейдж
if(cartStorage.length){
    showQuantity()
    cartStorage.forEach(el => {
      renderCartItem(el.imgSrc, el.name, el.quantity, (el.price * el.quantity), el.id)
    })
}

// Вішаєм собитіє на карточки продукту
cards.forEach(card => {

  card.addEventListener('click', function(e){
      
      // Дістаєм значення з карточки продукту
      const name = card.querySelector('.card__title').innerText
      const price = card.querySelector('.card__price').innerText
      const imgSrc = card.querySelector('.card__img').getAttribute('src')
      const quantity = 1
      const id = card.dataset.id
      const product = {imgSrc, name, price, quantity, id}


    if(e.target.closest('.card__btn')){
      //Шукаєм в массиві індекс елемент в який співпадає з іменем продукту
      let cartIndex = cartStorage.findIndex(el => el.name === name)
      
      //Перевірка на те чи є в массиві елемент зі схожим іменем продукту
      if(cartIndex !== -1){
        cartStorage[cartIndex].quantity += 1 // якщо є, то додаємо кількість продукту
      } else {
        cartStorage.push(product) // якщо немає, пушимо обєкт продукт в массив
      }
      localStorage.setItem('cart', JSON.stringify(cartStorage)) // додаємо в локалстор
      showQuantity()
      renderCartItem(imgSrc, name, quantity, price, id)
    }
  })
})




//Відображення карток в корзині
function renderCartItem(imgSrc, name, quantity, price, id){
  const itemId = modalCart.querySelector(`[data-id="${id}"]`)
  
      if(itemId){
          let itemQuantity = itemId.querySelector('.count_quantity')
          let itemPrice = itemId.querySelector('.cart__product-price')
          
          itemQuantity.value = +itemQuantity.value + 1;
          itemPrice.innerText = +itemPrice.innerText + +price
      } else {
        const cartItemHTML = ` 
          <ul class="cart__product" data-id="${id}">
            <li class="cart__product-img"><img src="${imgSrc}" alt=""></li>
            <li class="cart__product-name">${name}</li>
            <li class="cart__product-count">
              <button class="count__btn" data-btn="plus">+</button>
              <input class="count_quantity" value="${quantity}">
              <button class="count__btn" data-btn="minus">-</button>
            </li>
            <li class="cart__product-price">${price}</li>
            <li class="cart__product-del">
              <button class="product-del" data-btn="removeItem">x</button>
            </li>
          </ul>
        `
        document.querySelector('hr').insertAdjacentHTML('afterEnd', cartItemHTML)
  }
      
}

//Активація кнопок в корзині
modalCart.addEventListener('click', function(event){
  let item = event.target.closest('[data-id]')
 

  //Додаєм кількість елементу в корзині
  if(event.target.dataset.btn === 'plus'){
    let counterQuantity = item.querySelector('.count_quantity')
    let itemPrice = item.querySelector('.cart__product-price')

    counterQuantity.value = parseInt(counterQuantity.value) + 1

    cartStorage.forEach(el => {
      if(el.id === item.dataset.id){
        el.quantity++
        itemPrice.innerText = +itemPrice.innerText + +el.price
        localStorage.setItem('cart', JSON.stringify(cartStorage)) // додаємо в локалстор
      }
    })
  }
  //Віднімаємо кількість елементу в корзині або повністью видаляємо елемент з корзини
  if(event.target.dataset.btn === 'minus' || event.target.dataset.btn === 'removeItem'){
    let counterQuantity = item.querySelector('.count_quantity')
    let itemPrice = item.querySelector('.cart__product-price')
      counterQuantity.value--;
      cartStorage.forEach(el => {
      if(el.id === item.dataset.id){
        el.quantity--
        itemPrice.innerText -= el.price
        localStorage.setItem('cart', JSON.stringify(cartStorage)) // додаємо в локалстор
      }
    })
      //Видаляємо елементи з корзини
      if(+itemPrice.innerText === 0 || event.target.dataset.btn === 'removeItem' ){
          item.remove()
          let itemIndexStorage = cartStorage.findIndex(el => el.quantity === 0)
          cartStorage.splice(itemIndexStorage, 1)
          localStorage.setItem('cart', JSON.stringify(cartStorage)) // додаємо в локалстор
          showQuantity()
      }

  }
    //Закриваємо корзину
  if(event.target.dataset.btn === 'closeCart' || cartStorage.length === 0){
      document.querySelector('.modal__cart-wrapper').classList.add('hidden')
      document.body.style.overflow = 'visible'
  }
  //Модальне вікно підтвердження замовлення
  if(event.target.dataset.btn === 'order-submit'){
    document.querySelector('.modal__cart-wrapper').classList.add('hidden')
    document.querySelector('.modal__order-confirm').classList.remove('hidden')
  }

})

//Смс про підтвердження замовлення
const submitForm = document.querySelector('[data-btn="submit"]')
submitForm.addEventListener('click', function showMessage(e){
  let promiseValueLenght = true;

  Array.from(document.querySelector('fieldset').children).forEach(el => {
    if(el.tagName.toLowerCase() === 'input'){
      if(el.value.length === 0){
        promiseValueLenght = false;
      }
    }
  })
  if(promiseValueLenght){
    const message = `<p class="order-confirm__message">Дякуємо за замовлення</p>`
    setTimeout(function(){
        submitForm.insertAdjacentHTML('afterEnd', message)
        setTimeout(() => {
          document.querySelector('.modal__order-confirm').classList.add('hidden')
          document.body.style.overflow = 'visible'
          Array.from(document.querySelector('fieldset').children).forEach(el => {
            if(el.tagName.toLowerCase() === 'input'){
              el.value = ''
            }
          })
          document.querySelector('.order-confirm__message').remove()
          this.addEventListener('click', showMessage)
          document.querySelector('.cart__product').remove()
        }, 2000)
    }, 2000)
    cartStorage.splice(0)
    localStorage.clear()
    cartCount.classList.add('hidden')
    this.removeEventListener('click', showMessage)

  } else if(e.target === submitForm) {
    const error = `<p class="order-confirm__message">Введіть всі данні</p>`
    submitForm.insertAdjacentHTML('afterEnd', error)
    this.removeEventListener('click', showMessage)

    setTimeout(() =>{
      document.querySelector('.order-confirm__message').remove()
      this.addEventListener('click', showMessage)
    }, 2000)
    promiseValueLenght = true
  }
})

//Показ корзини
cartBtn.addEventListener('click', function(){
  if(cartStorage.length){
    document.querySelector('.header').style.zIndex = '0'
    document.querySelector('.swiper').style.zIndex = '0'
    document.querySelector('.modal__cart-wrapper').classList.remove('hidden')
    document.body.style.overflow = 'hidden'
  }
})







//Відображає кількість елементі в корзині
function showQuantity(){
  if(cartStorage.length){
    cartCount.innerText = cartStorage.length
    cartCount.classList.remove('hidden')
  } else {
    cartCount.classList.add('hidden')
  }
    
}



































//Slide
const swiper = new Swiper('.swiper', {
  
  slidesPerView: 1,
  spaceBetween: 42,

      breakpoints: {
        600: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        920: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1440: {
          slidesPerView: 4,
          spaceBetween: 42,
        },
    },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
});