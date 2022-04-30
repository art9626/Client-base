(() => {

  // Получаем данные с сервера 
  async function getData(id = null) {
    if (id) {
      let url = new URL(id, 'http://localhost:3000/api/clients/');

      const response = await fetch(url.href)
      const data = await response.json();

      return data;
    }

    const response = await fetch('http://localhost:3000/api/clients');
    const data = await response.json();
  
    return data;
  }


  // Фильтр клиентов
  async function filterData(param) {
    let url = new URL('http://localhost:3000/api/clients');

    url.searchParams.set('search', param);

    const response = await fetch(url.href);
    let data = await response.json();

    if (response.status < 400) {
      data = editClientsData(data);

      console.log(data);

      return data;
    }
  }

  // Сортировка по имени
  async function onSortName(thName, thHint) {
    const thElements = document.querySelectorAll('.section-clients__th');

    if (!(thName.classList.contains('ascending') || thName.classList.contains('decreasing'))) {
      thName.classList.add('decreasing');
    }

    if (thName.classList.contains('ascending')) {
      thElements.forEach(el => {
        el.classList.remove('ascending', 'decreasing');
      })
      thName.classList.add('decreasing');
      thHint.textContent = 'Я-А';

      let clientsData = await getData();
  
      clientsData = editClientsData(clientsData).sort((a, b) => {
        if (b.surname[0] > a.surname[0]) return 1; 
        if (b.surname[0] == a.surname[0]) {
          if (b.name[0] > a.name[0]) return 1; 
          if (b.name[0] == a.name[0]) {
            if (b.lastName[0] > a.lastName[0]) return 1; 
            if (b.lastName[0] == a.lastName[0]) return 0; 
            if (b.lastName[0] < a.lastName[0]) return -1;
          }; 
          if (b.name[0] < a.name[0]) return -1;
        } 
        if (b.surname[0] < a.surname[0]) return -1;
      });

      return clientsData;
    } else {
      thElements.forEach(el => {
        el.classList.remove('ascending', 'decreasing');
      })
      thName.classList.add('ascending');
      thHint.textContent = 'А-Я';

      let clientsData = await getData();
  
      clientsData = editClientsData(clientsData).sort((a, b) => {
        if (a.surname[0] > b.surname[0]) return 1; 
        if (a.surname[0] == b.surname[0]) {
          if (a.name[0] > b.name[0]) return 1; 
          if (a.name[0] == b.name[0]) {
            if (a.lastName[0] > b.lastName[0]) return 1; 
            if (a.lastName[0] == b.lastName[0]) return 0; 
            if (a.lastName[0] < b.lastName[0]) return -1;
          }; 
          if (a.name[0] < b.name[0]) return -1;
        } 
        if (a.surname[0] < b.surname[0]) return -1;
        
      });

      return clientsData;
    }
  }

  // Сортировка по дате
  async function onSortDate(thDate, typeTh) {
    const thElements = document.querySelectorAll('.section-clients__th');

    if (!(thDate.classList.contains('ascending') || thDate.classList.contains('decreasing'))) {
      thDate.classList.add('decreasing');
    }

    if (thDate.classList.contains('ascending')) {
      thElements.forEach(el => {
        el.classList.remove('ascending', 'decreasing');
      })
      thDate.classList.add('decreasing');

      let clientsData = await getData();
  
      clientsData = editClientsData(clientsData).sort((a, b) => {

        if (typeTh === 'create') {
          a.time = new Date(a.createdAt).getTime();
          b.time = new Date(b.createdAt).getTime();
        }

        if (typeTh === 'update') {
          a.time = new Date(a.updatedAt).getTime();
          b.time = new Date(b.updatedAt).getTime();
        }

        return b.time - a.time;
      });

      return clientsData;
    } else {
      thElements.forEach(el => {
        el.classList.remove('ascending', 'decreasing');
      })
      thDate.classList.add('ascending');

      let clientsData = await getData();
  
      clientsData = editClientsData(clientsData).sort((a, b) => {
        
        if (typeTh === 'create') {
          a.time = new Date(a.createdAt).getTime();
          b.time = new Date(b.createdAt).getTime();
        }

        if (typeTh === 'update') {
          a.time = new Date(a.updatedAt).getTime();
          b.time = new Date(b.updatedAt).getTime();
        }
  
        return a.time - b.time;
      });

      return clientsData;
    }
  }

  // Сортировка по id
  async function onSortId(thId) {
    const thElements = document.querySelectorAll('.section-clients__th');

    if (thId.classList.contains('ascending')) {
      thElements.forEach(el => {
        el.classList.remove('ascending', 'decreasing');
      })
      thId.classList.add('decreasing');

      let clientsData = await getData();
  
      clientsData = editClientsData(clientsData).sort((a, b) => b.id - a.id);

      return clientsData;
    } else {
      thElements.forEach(el => {
        el.classList.remove('ascending', 'decreasing');
      })
      thId.classList.add('ascending');

      let clientsData = await getData();
  
      clientsData = editClientsData(clientsData);

      return clientsData;
    }
  }



  // Получаем введенные контактные данные из формы
  function getClientsContacts() {
    const contacts = [];

    const items = document.querySelectorAll('.modal__contacts-item');

    items.forEach((item) => {
      const choice = item.querySelector('.modal__contacts-dropdown-choice');
      const input = item.querySelector('.modal__contacts-input');

      if (input.name === 'Телефон') {
        contacts.push({type: choice.textContent, value: editModalFormInputTel(input.value)});
      } else if (input.name === 'Email' || input.name === 'Другое') {
        contacts.push({type: choice.textContent, value: input.value.trim().toLowerCase()});
      } else if (input.name === 'VK' || input.name === 'Facebook') {
        contacts.push({type: choice.textContent, value: editModalFormInputLink(input.value)});
      } else {
        contacts.push({type: choice.textContent, value: input.value});
      }


    })

    return contacts;
  }




  // Закрытие модального окна
  function onClose(modal, callback) {
    document.body.classList.remove('active');
    modal.classList.remove('open');

    setTimeout(() => {
      modal.parentElement.classList.remove('open');
      modal.remove();

      if (callback) {
        callback();
      }
    }, 100);

    window.location.hash = '';
  }

  // Пересоздаем таблицу после получния ответа от сервера
  async function reCreatingTbody(response, modal) {
    const tbody = document.querySelector('.section-clients__tbody');
    const errorField = document.querySelector('.modal__error-field');

    if (response.status === 200 || response.status === 201) {
      let clientsData = await getData();
    
      clientsData = editClientsData(clientsData);

      tbody.innerHTML = '';

      clientsData.forEach(item => {
       tbody.append(createTrElement(item));
      })

      onClose(modal);
    } else if (response.status === 404) {
      const errorData = await response.json();
      
      errorField.textContent = `Ошибка: ${errorData.message}`;
    } else if (response.status === 422) {
      const errorData = await response.json();

      const errorMessage = errorData.errors.reduce((message, item) => message + `${item.message}. `, '')

      errorField.textContent = `Ошибка: ${errorMessage}`;
    }
  }



  // Событие добавления клиента
  async function addNewClient({name, surname, lastName, contacts}) {
    const response = await fetch ('http://localhost:3000/api/clients', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name,
        surname,
        lastName,
        contacts,
      }),
    })

    return response;
  }

  // Событие изменения клиента
  async function saveChangeForClient({id, name, surname, lastName, contacts}) {
    let url = new URL(id, 'http://localhost:3000/api/clients/');

    const response = await fetch (url.href, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name,
        surname,
        lastName,
        contacts,
      }),
    })

    return response;
  }

  // Событие удаления клиента
  async function deleteClient(id) {
    let url = new URL(id, 'http://localhost:3000/api/clients/');

    const response = await fetch (url.href, {
      method: 'DELETE',
    });

    return response;
  }




  // Событие добавления контакта в форме
  function onAddContact(btn, list) {
    const maxCountOfItems = 10;

    if (document.querySelectorAll('.modal__contacts-item').length >= maxCountOfItems - 1) {
      btn.classList.add('visually-hidden');
    }

    document.querySelector('.modal__contacts-block').classList.add('active');
    list.append(createContactItem());
  }




  // Событие фокусировки на инпуте в форме
  function onFocusFormInput(input) {
    input.nextSibling.classList.add('on-input');
  }

  // Событие расфокусировки инпута в форме
  function onBlurFormInput(input) {
    if (input.value.length === 0) {
      input.nextSibling.classList.remove('on-input');
    }
  }

  // Событие закрытя модалки
  function closeModal(event, modalWrapper) {
    if (event._isWithinModal) return;

    onClose(modalWrapper.firstElementChild);
  }





  // Создаем шапку
  function createHeaderElement() {
    const header = document.createElement('header');
    const container = document.createElement('div');
    const logo = document.createElement('a');
    const logoImg = document.createElement('img');
    const input = document.createElement('input');
    const inputWrapper = document.createElement('div');
    const dropdownList = document.createElement('ul');
    const closeBtn = document.createElement('button');


    header.classList.add('header');
    container.classList.add('header-container', 'container');
    logo.classList.add('header__logo');
    logoImg.classList.add('header__logo-img');
    input.classList.add('header__input');
    inputWrapper.classList.add('header__input-wrapper');
    dropdownList.classList.add('header__dropdown-list');
    closeBtn.classList.add('header__input-btn');

    input.placeholder = 'Введите запрос';
    input.type = 'text';
    logo.href = '#';
    logoImg.src = './img/header/header_logo.svg'

    logo.append(logoImg);
    inputWrapper.append(input);
    inputWrapper.append(dropdownList);
    inputWrapper.append(closeBtn);
    inputWrapper.append(createSpinner());
    container.append(logo);
    container.append(inputWrapper);
    header.append(container);

    let timerId;

    input.addEventListener('input', () => { 
      clearInterval(timerId);

      timerId = setTimeout(async () => {
        inputWrapper.classList.add('load');

        const data = await filterData(input.value);

        // document.querySelector('tbody').innerHTML = '';

        // data.forEach(item => {
        //   document.querySelector('tbody').append(createTrElement(item));
        // })

        closeBtn.style.opacity = '1';
        if (input.value.length === 0) {
          closeBtn.style.opacity = '0';
        }

        dropdownList.innerHTML = '';
        
        if (input.value.length > 0) {
          data.forEach(item => {
            dropdownList.append(createHeaderDropdownItem(item));
          })
        }

        inputWrapper.classList.remove('load');
      }, 300);
    })

    closeBtn.addEventListener('click', function() {
      dropdownList.innerHTML = '';
      input.value = '';
      this.style.opacity = '0';
    })

    return {
      header,
      input,
    }
  }

  function createHeaderDropdownItem({surname, name, id}) {
    const item = document.createElement('li');
    const link = document.createElement('a');

    item.classList.add('header__dropdown-item');
    link.classList.add('header__dropdown-link');

    link.textContent = `${surname} ${name}`;
    link.href = '#';


    link.addEventListener('click', e => {
      e.preventDefault();

      const clientsTd = Array.from(document.querySelectorAll('.section-clients__td--id'));
      const foundTd = clientsTd.find(item => +item.dataset.id === +id);

      foundTd.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      clientsTd.forEach(item => {
        item.parentNode.style.backgroundColor = '';
      })
      foundTd.parentNode.style.backgroundColor = 'rgba(152, 115, 255, .3)';
    })

    item.append(link);

    return item;
  }





  // Создаем main
  function createMainElement() {
    const main = document.createElement('main');

    return main;
  }

  

  // Создаем обертку, куда будем помещать модалки
  function createModalWrapperElement() {
    const modalWrapper = document.createElement('div');

    modalWrapper.classList.add('modal__modal-wrapper')

    modalWrapper.addEventListener('click', e => {
      closeModal(e, modalWrapper);
    })

    return modalWrapper;
  }

  // Создаем основную секцию с таблицей
  function createSectionElement() {
    const section = document.createElement('section');
    const container = document.createElement('div');
    const heading = document.createElement('h1');
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    const button = document.createElement('button');

    const tableScroll = document.createElement('div');
    tableScroll.classList.add('section-clients__table-scroll');
    
    section.classList.add('section-clients');
    container.classList.add('container', 'section-clients__container');
    heading.classList.add('section-clients__heading');
    table.classList.add('section-clients__table')
    tbody.classList.add('section-clients__tbody');
    button.classList.add('section-clients__button', 'section-clients__button--add');

    heading.textContent = 'Клиенты';
    button.innerHTML = `<svg width="23" height="16" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 8C16.71 8 18.5 6.21 18.5 4C18.5 1.79 16.71 0 14.5 0C12.29 0 10.5 1.79 10.5 4C10.5 6.21 12.29 8 14.5 8ZM5.5 6V3H3.5V6H0.5V8H3.5V11H5.5V8H8.5V6H5.5ZM14.5 10C11.83 10 6.5 11.34 6.5 14V16H22.5V14C22.5 11.34 17.17 10 14.5 10Z" fill="#9873FF"/></svg>
      Добавить клиента`;

    container.append(heading);
    table.append(tbody);
    tbody.append(createSpinner());


    tableScroll.append(table);
    container.append(tableScroll);
    // container.append(table);
    container.append(button);
    section.append(container);

    button.addEventListener('click', () => {
      addModal();
    })

    return {
      section,
      table,
      tbody,
    };
  }

  // Создаем шапку таблицы
  function createTheadElement() {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    const thId = document.createElement('th');
    const thName = document.createElement('th');
    const thDateOfCreation = document.createElement('th');
    const thDateOfChange = document.createElement('th');
    const thContacts = document.createElement('th');
    const thActions = document.createElement('th');
    const thNameHint = document.createElement('span');

    thead.classList.add('section-clients__thead');
    thId.classList.add('section-clients__th', 'ascending')
    thName.classList.add('section-clients__th')
    thDateOfCreation.classList.add('section-clients__th')
    thDateOfChange.classList.add('section-clients__th')
    thContacts.classList.add('section-clients__th')
    thActions.classList.add('section-clients__th')
    thNameHint.classList.add('section-clients__th-hint');


    thId.innerHTML = `ID <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7"><path d="M8 4L7.295 3.295L4.5 6.085L4.5 0L3.5 0L3.5 6.085L0.71 3.29L0 4L4 8L8 4Z" fill="#9873FF"/><g/></svg>`;
    thName.innerHTML = `Фамилия Имя Отчество <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7"><path d="M8 4L7.295 3.295L4.5 6.085L4.5 0L3.5 0L3.5 6.085L0.71 3.29L0 4L4 8L8 4Z" fill="#9873FF"/><g/></svg>`;
    thDateOfCreation.innerHTML = `Дата и время создания <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7"><path d="M8 4L7.295 3.295L4.5 6.085L4.5 0L3.5 0L3.5 6.085L0.71 3.29L0 4L4 8L8 4Z" fill="#9873FF"/><g/></svg>`;
    thDateOfChange.innerHTML = `Последние изменения <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7"><path d="M8 4L7.295 3.295L4.5 6.085L4.5 0L3.5 0L3.5 6.085L0.71 3.29L0 4L4 8L8 4Z" fill="#9873FF"/><g/></svg>`;
    thContacts.textContent = 'Контакты';
    thActions.textContent = 'Действия';
    thNameHint.textContent = 'А-Я';

    thId.scope = 'col';
    thName.scope = 'col';
    thDateOfCreation.scope = 'col';
    thDateOfChange.scope = 'col';
    thContacts.scope = 'col';
    thActions.scope = 'col';

    thName.append(thNameHint);
    tr.append(thId);
    tr.append(thName);
    tr.append(thDateOfCreation);
    tr.append(thDateOfChange);
    tr.append(thContacts);
    tr.append(thActions);
    thead.append(tr);

    tr.childNodes.forEach(el => {
      el.addEventListener('click', async e => {
        let clientsData;
        const tbody = document.querySelector('tbody');

        tr.childNodes.forEach(el => {
          el.style.pointerEvents = 'none';
        })
        tbody.classList.add('load');

        if (e.target === thId) {
          clientsData = await onSortId(thId);
        } 

        if (e.target === thName) {
          clientsData = await onSortName(thName, thNameHint);
        }

        if (e.target === thDateOfCreation) {
          clientsData = await onSortDate(thDateOfCreation, 'create');
        }

        if (e.target === thDateOfChange) {
          clientsData = await onSortDate(thDateOfChange, 'update');
        }

        tbody.innerHTML = '';

        tbody.append(createSpinner());
        clientsData.forEach(item => {
          tbody.append(createTrElement(item));
        });

        tbody.classList.remove('load');
        tr.childNodes.forEach(el => {
          el.style.pointerEvents = 'auto';
        })
      })
    })



    return {
      thead,
      thId,
      thName,
      thDateOfCreation,
      thDateOfChange,
    }
  }

  // Создаем строку с клиентом в таблице
  function createTrElement(client) {
    const tr = document.createElement('tr');
    const tdId = document.createElement('td');
    const tdName = document.createElement('td');
    const tdDateOfCreation = document.createElement('td');
    const tdDateOfChange = document.createElement('td');
    const tdContacts = document.createElement('td');
    const tdActions = document.createElement('td');
    const changeButton = document.createElement('button');
    const deleteButton = document.createElement('button');


    tr.classList.add('section-clients__tbody-tr');
    tdId.classList.add('section-clients__td', 'section-clients__td--id');
    tdName.classList.add('section-clients__td');
    tdDateOfCreation.classList.add('section-clients__td');
    tdContacts.classList.add('section-clients__td');
    tdDateOfChange.classList.add('section-clients__td');
    tdActions.classList.add('section-clients__td');
    changeButton.classList.add('section-clients__td-button', 'section-clients__td-button--change');
    deleteButton.classList.add('section-clients__td-button', 'section-clients__td-button--del');

    const {createDate, createTime} = client.getCreatedAt();
    const {updateDate, updateTime} = client.getUpdatedAt();
    
    tdId.textContent = client.id.slice(0,6);
    tdId.dataset.id = `${client.id}`;
    tdName.textContent = `${client.surname} ${client.name} ${client.lastName}`;
    tdDateOfCreation.innerHTML = `${createDate} <span class="section-clients__cell-time">${createTime}</span>`;
    tdDateOfChange.innerHTML = `${updateDate} <span class="section-clients__cell-time">${updateTime}</span>`;
    changeButton.textContent = 'Изменить';
    deleteButton.textContent = 'Удалить';

    changeButton.append(createSpinner());

    tdActions.append(changeButton);
    tdActions.append(deleteButton);

    tr.append(tdId);
    tr.append(tdName);
    tr.append(tdDateOfCreation);
    tr.append(tdDateOfChange);
    tr.append(tdContacts);
    tr.append(tdActions);



    tdContacts.append(createTooltipsList(client.contacts));

    deleteButton.addEventListener('click', () => {
      addModal(null, client.id);
    })

    changeButton.addEventListener('click', async () => {
      changeButton.classList.add('load');

      const data = await getData(client.id);

      addModal(data);

      changeButton.classList.remove('load');

      window.location.hash = client.id;
    })

    tr.addEventListener('click', function() {
      this.style.backgroundColor = '';
    })

    return tr;
  }

  // Создаем кнопку показа всех контактов в таблице в графе "Контакты"
  function createMoreContactsBtn(value) {
    const button = document.createElement('button');

    button.classList.add('section-clients__more-btn');

    button.textContent = `+${value}`

    return button;
  }

  // Создаем список подсказок с контактами для каждого клиента
  function createTooltipsList(contacts) {
    const maxVisibleContacts = 5;

    const tooltipsList = document.createElement('ul');
    tooltipsList.classList.add('section-clients__tooltips-list')

    if (contacts.length > maxVisibleContacts) {
      const contactsVisible = contacts.slice(0, maxVisibleContacts - 1);
      const contactsHide = contacts.slice(maxVisibleContacts - 1);

      contactsVisible.forEach(item => {
        tooltipsList.append(createTooltip(item));
      })

      const moreBtn = createMoreContactsBtn(contactsHide.length);

      tooltipsList.append(moreBtn);
   
      moreBtn.addEventListener('click', () => {
        moreBtn.remove();

        contactsHide.forEach(item => {
          tooltipsList.append(createTooltip(item));
        })
      })

      return tooltipsList;
    }

    contacts.forEach(item => {
      tooltipsList.append(createTooltip(item));
    })

    return tooltipsList;
  }

  // Создаем подсказку с контактом
  function createTooltip(contact) {
    const tooltip = document.createElement('li');
    const marker = document.createElement('a');
    const popup = document.createElement('div');

    tooltip.classList.add('section-clients__tooltip');
    marker.classList.add('section-clients__marker');
    popup.classList.add('section-clients__popup', 'popup');

    if (contact.type === 'Телефон') {
      marker.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7"><circle cx="8" cy="8" r="8" fill="#9873FF"/><path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/></g></svg>`;
      marker.href = `tel:${contact.value}`;
    }
    if (contact.type === 'VK') {
      marker.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7"><path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/></g></svg>`;
      marker.href = `http://${contact.value}`;
      marker.target = '_blank';
    }
    if (contact.type === 'Email') {
      marker.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/></svg>`;
      marker.href = `mailto:${contact.value}`;
    }
    if (contact.type === 'Facebook') {
      marker.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.7"><path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/></g></svg>`;
      marker.href = `http://${contact.value}`;
      marker.target = '_blank';
    }
    if (contact.type === 'Другое') {
      marker.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/></svg>`;
      marker.href = `http://${contact.value}`;
      marker.target = '_blank';
    }
    
    popup.textContent = `${contact.type}: ${contact.value}`;

    tooltip.append(marker);
    tooltip.append(popup);

    return tooltip;
  }

  // Добавляем на экран модалку
  function addModal(data, id) {
    const modalWrapper = document.querySelector('.modal__modal-wrapper');
    let modal;

    if (data) {
      modal = createModalClient(data);
    } else if (id) {
      modal = createModalDelete(id);
    } else {
      modal = createModalClient({});
    }

    modalWrapper.append(modal);

    document.body.classList.add('active');
    modalWrapper.classList.add('open');

    setTimeout(() => {
      modal.classList.add('open');
    }, 100);
  }








  // Модалка на добавление или изменение клиента
  function createModalClient({id = null, name = '', surname = '', lastName = '', contacts = []}) {
    const modal = document.createElement('div');
    const heading = document.createElement('h3');
    const closeBtn = document.createElement('button');
    const contactsBlock = document.createElement('div');
    const contactsList = document.createElement('ul');
    const addContactBtn = document.createElement('button');
    const saveBtn = document.createElement('button');
    const form = document.createElement('form');
    const inputName = document.createElement('input');
    const inputSurname = document.createElement('input');
    const inputLastName = document.createElement('input');
    const inputGroup = document.createElement('div');
    const inputNameWrapper = document.createElement('div');
    const inputSurnameWrapper = document.createElement('div');
    const inputLastNameWrapper = document.createElement('div');
    const placeholderName = document.createElement('span');
    const placeholderSurname = document.createElement('span');
    const placeholderLastName = document.createElement('span');
    const errorField = document.createElement('div');


    modal.classList.add('modal');
    closeBtn.classList.add('modal__close-btn');
    form.classList.add('modal__form');
    inputName.classList.add('modal__input');
    inputSurname.classList.add('modal__input');
    inputLastName.classList.add('modal__input');
    inputGroup.classList.add('modal__input-group');
    contactsBlock.classList.add('modal__contacts-block');
    if (contacts.length > 0) {
      contactsBlock.classList.add('active');
    }
    contactsList.classList.add('modal__contacts-list');
    addContactBtn.classList.add('modal__add-btn');
    saveBtn.classList.add('modal__save-btn', 'submit-btn');
    inputNameWrapper.classList.add('modal__input-wrapper');
    inputSurnameWrapper.classList.add('modal__input-wrapper');
    inputLastNameWrapper.classList.add('modal__input-wrapper');
    placeholderName.classList.add('modal__input-placeholder');
    placeholderSurname.classList.add('modal__input-placeholder');
    placeholderLastName.classList.add('modal__input-placeholder');
    errorField.classList.add('modal__error-field');


    inputName.name = 'name';
    inputSurname.name = 'surname';
    inputLastName.name = 'lastname';
    placeholderName.innerHTML = `Имя<span>*</span>`;
    placeholderSurname.innerHTML = `Фамилия<span>*</span>`;
    placeholderLastName.innerHTML = `Отчество`;

    saveBtn.type = 'submit';
    saveBtn.textContent = 'Сохранить';
    addContactBtn.textContent = 'Добавить контакт';


    saveBtn.append(createSpinner());
    inputNameWrapper.append(inputName);
    inputNameWrapper.append(placeholderName);
    inputSurnameWrapper.append(inputSurname);
    inputSurnameWrapper.append(placeholderSurname);
    inputLastNameWrapper.append(inputLastName);
    inputLastNameWrapper.append(placeholderLastName);
    inputGroup.append(inputSurnameWrapper);
    inputGroup.append(inputNameWrapper);
    inputGroup.append(inputLastNameWrapper);
    form.append(inputGroup);
    contactsBlock.append(contactsList);
    contactsBlock.append(addContactBtn);
    form.append(contactsBlock);
    form.append(errorField);
    form.append(saveBtn);




    if (id) {
      const spanId = document.createElement('span')
      const headingBlock = document.createElement('div');
      const deleteBtn = document.createElement('button');

      spanId.classList.add('modal__id-description');
      headingBlock.classList.add('modal__heading-block');
      deleteBtn.classList.add('modal__cancel-btn');
      heading.classList.add('modal-heading', 'modal__heading--change');

      heading.textContent = 'Изменить данные';
      deleteBtn.textContent = 'Удалить клиента';
      spanId.textContent = `ID: ${id.slice(0, 6)}`;

      inputName.value = `${name}`;
      inputSurname.value = `${surname}`;
      inputLastName.value = `${lastName}`;

      headingBlock.append(heading);
      headingBlock.append(spanId);
      modal.append(headingBlock);
      modal.append(closeBtn);
      modal.append(form);
      modal.append(deleteBtn);

      contacts.forEach(item => {
        contactsList.append(createContactItem(item.type, item.value));
      })
  

      deleteBtn.addEventListener('click', function() {
        function callback() {
          addModal(null, id);
        }
  
        onClose(modal, callback);
      })

    } else {
      const cancelBtn = document.createElement('button');

      cancelBtn.classList.add('modal__cancel-btn'); 
      heading.classList.add('modal-heading', 'modal__heading--new');

      heading.textContent = 'Новый клиент';
      cancelBtn.textContent = 'Отмена';

      modal.append(heading);
      modal.append(closeBtn);
      modal.append(form);
      modal.append(cancelBtn);


      cancelBtn.addEventListener('click', () => {
        onClose(modal);
      })
    }


    [inputName, inputSurname, inputLastName].forEach(item => {  
      item.addEventListener('input', () => {
        item.classList.remove('error');
      })

      if (item.value.length > 0) {
        item.nextSibling.classList.add('on-input');
      }

      item.addEventListener('focus', () => {
        onFocusFormInput(item);
      })

      item.addEventListener('blur', () => {
        onBlurFormInput(item);
      })
    })



    form.addEventListener('submit', async e => {
      e.preventDefault();

      const inputs = Array.from(document.querySelectorAll('input'));

      errorField.textContent = '';
      const errors = inputs.reduce((sumErrors, el) => {
        el.classList.remove('error');

        if (validateInput(el, errorField)) {
          el.classList.add('error');

          sumErrors++;
        }

        return sumErrors;
      }, 0)

      if (errors > 0) {
        return;
      }


      saveBtn.classList.add('load');
      inputs.forEach(el => {
        el.disabled = 'true';
      })

      const contacts = getClientsContacts();

      const formData = {
        id,
        name: editModalFormInputNames(inputName.value),
        surname: editModalFormInputNames(inputSurname.value),
        lastName: editModalFormInputNames(inputLastName.value),
        contacts,
      }

      if (id) {
        const response = await saveChangeForClient(formData);

        await reCreatingTbody(response, modal);
      } else {
        const response = await addNewClient(formData);

        await reCreatingTbody(response, modal);
      }

      inputs.forEach(el => {
        el.removeAttribute('disabled');
      })
      saveBtn.classList.remove('load');
    })

    closeBtn.addEventListener('click', () => {
      onClose(modal);
    })

    addContactBtn.addEventListener('click', e => {
      e.preventDefault();

      onAddContact(e.target, contactsList)
    })

    modal.addEventListener('click', e => {
      e._isWithinModal = true;

      closeDropDown(e);
    })

    return modal;
  }
  
  // Модалка с удалением клиента
  function createModalDelete(clientId) {
    const modal = document.createElement('div');
    const heading = document.createElement('h3');
    const closeBtn = document.createElement('button');
    const confirmBtn = document.createElement('button');
    const cancelBtn = document.createElement('button');
    const description = document.createElement('p');
    const errorField = document.createElement('div');

    modal.classList.add('modal');
    heading.classList.add('modal-heading', 'modal__heading--del');
    closeBtn.classList.add('modal__close-btn');
    confirmBtn.classList.add('modal__save-btn', 'submit-btn');
    cancelBtn.classList.add('modal__cancel-btn');
    description.classList.add('modal__description');
    errorField.classList.add('modal__error-field');

    heading.textContent = 'Удалить клиента';
    description.textContent = 'Вы действительно хотите удалить данного клиента?';

    cancelBtn.textContent = 'Отмена';
    confirmBtn.textContent = 'Удалить';


    confirmBtn.append(createSpinner());
    modal.append(heading);
    modal.append(closeBtn);
    modal.append(description);
    modal.append(errorField);
    modal.append(confirmBtn);
    modal.append(cancelBtn);

    closeBtn.addEventListener('click', () => {
      onClose(modal);
    })

    cancelBtn.addEventListener('click', () => {
      onClose(modal);
    })

    confirmBtn.addEventListener('click', async () => {
      confirmBtn.classList.add('load');

      const response = await deleteClient(clientId);

      await reCreatingTbody(response, modal);

      confirmBtn.classList.remove('load');
    })

    return modal; 
  }





  // Создаем поле добавление нового контакта в форме
  function createContactItem(type, value) {
    const item = document.createElement('li');
    const dropDownBtn = document.createElement('button');
    const dropDownChoice = document.createElement('span');
    const dropDownIcon = document.createElement('span');
    const input = document.createElement('input');
    const closeBtn = document.createElement('button');
    const popup = document.createElement('span');

    const dropDownList = document.createElement('ul');
    const itemTel = document.createElement('li');
    const itemVk = document.createElement('li');
    const itemMail = document.createElement('li');
    const itemFacebook = document.createElement('li');
    const itemOther = document.createElement('li');

    item.classList.add('modal__contacts-item');
    dropDownBtn.classList.add('modal__contacts-dropdown-btn');
    dropDownChoice.classList.add('modal__contacts-dropdown-choice');
    dropDownIcon.classList.add('modal__contacts-dropdown-icon');
    input.classList.add('modal__contacts-input');
    closeBtn.classList.add('modal__contacts-close-btn');
    popup.classList.add('modal__contacts-popup', 'popup')

    dropDownList.classList.add('modal__dropdown-list');
    itemTel.classList.add('modal__dropdown-item');
    itemVk.classList.add('modal__dropdown-item');
    itemMail.classList.add('modal__dropdown-item');
    itemFacebook.classList.add('modal__dropdown-item');
    itemOther.classList.add('modal__dropdown-item');

    if (type) {
      dropDownChoice.textContent = type;
      input.name = type;
    } else {
      dropDownChoice.textContent = 'Телефон';
      input.name = 'Телефон';
    }
    
    dropDownIcon.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path d="M1.495 3.69003C1.25 3.93503 1.25 4.33003 1.495 4.57503L5.65 8.73003C5.845 8.92503 6.16 8.92503 6.355 8.73003L10.51 4.57503C10.755 4.33003 10.755 3.93503 10.51 3.69003C10.265 3.44503 9.87 3.44503 9.625 3.69003L6 7.31003L2.375 3.68503C2.135 3.44503 1.735 3.44503 1.495 3.69003Z" fill="#9873FF"/></g><defs><clipPath id="clip0"><rect width="12" height="12" fill="white" transform="translate(0 12) rotate(-90)"/></clipPath></defs></svg>`;
    itemTel.textContent = 'Телефон';
    itemVk.textContent = 'VK';
    itemMail.textContent = 'Email';
    itemFacebook.textContent = 'Facebook';
    itemOther.textContent = 'Другое';
    input.placeholder = 'Введите данные контакта';
    if (window.innerWidth <= 500) {
      input.placeholder = 'Введите данные';
    }
    closeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#B0B0B0"/></svg>`;
    popup.textContent = 'Удалить контакт';

    closeBtn.append(popup);

    dropDownBtn.addEventListener('click', e => {
      e.preventDefault();

      e._isWithinDropDown = true;

      dropDownBtn.classList.toggle('open');
      document.querySelectorAll('.modal__contacts-dropdown-btn').forEach(item => {
        if (item !== dropDownBtn) {
          item.classList.remove('open');
        }
      })

      dropDownList.innerHTML = '';

      [itemTel, itemVk, itemMail, itemFacebook, itemOther].forEach(el => {
        if (!(el.textContent === dropDownChoice.textContent)) {
          dropDownList.append(el);
        }

        el.addEventListener('click', () => {
          dropDownChoice.textContent = el.textContent;
          input.name = el.textContent;
  
          dropDownBtn.classList.remove('open');
        })
      })
    })

    dropDownList.addEventListener('click', e => {
      e._isWithinDropDown = true;
    })

    closeBtn.addEventListener('click', () => {
      item.remove();

      const maxCountOfItems = 10;

      if (document.querySelectorAll('.modal__contacts-item').length === maxCountOfItems - 1) {
        document.querySelector('.modal__add-btn').classList.remove('visually-hidden');
      }

      if (document.querySelectorAll('.modal__contacts-item').length === 0) {
        document.querySelector('.modal__contacts-block').classList.remove('active');
      }
    })

    input.addEventListener('input', () => {
      input.classList.remove('error');

      if (!(input.nextSibling === closeBtn)) {
        item.append(closeBtn);
      }
    })

    dropDownBtn.append(dropDownChoice);
    dropDownBtn.append(dropDownIcon);
    item.append(dropDownBtn);
    item.append(dropDownList)
    item.append(input);

    if (value) {
      input.value = value;    
      item.append(closeBtn);
    }

    return item;
  }


  // Закрываем выпадающий список в полях добавления нового контакта при клики мимо него
  function closeDropDown(event) {
    const dropDownBtns = event.currentTarget.querySelectorAll('.modal__contacts-dropdown-btn');

    dropDownBtns.forEach(item => {
      if (event._isWithinDropDown) return;
      item.classList.remove('open');
    })
  }







  // Корректируем данные в форме клиента
  function editModalFormInputNames(value) {
    return value.trim().slice(0, 1).toUpperCase() + value.trim().slice(1).toLowerCase();
  }

  function editModalFormInputTel(value) {
    return value.trim().split('-').join('').split('(').join('').split(')').join('').split(' ').join('');
  }

  function editModalFormInputLink(value) {
    return value.replace('http://', '').replace('https://', '').replace('www.', '').toLowerCase();
  }


  // Корректируем массив перед созданием элементов таблицы (делаем даты нужного формата и сортируем по умолчанию)
  function editClientsData(data) {
    return data.map(item => {
      item.getUpdatedAt = function() {
        let updateYear = String(new Date(this.updatedAt).getFullYear());
        let updateMonth = String(new Date(this.updatedAt).getMonth() + 1);
        let updateDay = String(new Date(this.updatedAt).getDate());
        let updateHours = String(new Date(this.updatedAt).getHours());
        let updateMinutes = String(new Date(this.updatedAt).getMinutes());


        const arrayDates = [updateYear, updateMonth, updateDay, updateHours, updateMinutes].map(item => {
          if (item.length === 1 ) {
            item = '0' + item;
          }

          return item;
        })

        return {
          updateDate: `${arrayDates[2]}.${arrayDates[1]}.${arrayDates[0]}`,
          updateTime: `${arrayDates[3]}:${arrayDates[4]}`,
        }
      }

      item.getCreatedAt = function() {
        let createYear = String(new Date(this.createdAt).getFullYear());
        let createMonth = String(new Date(this.createdAt).getMonth() + 1);
        let createDay = String(new Date(this.createdAt).getDate());
        let createHours = String(new Date(this.createdAt).getHours());
        let createMinutes = String(new Date(this.createdAt).getMinutes());


        const arrayDates = [createYear, createMonth, createDay, createHours, createMinutes].map(item => {
          if (item.length === 1 ) {
            item = '0' + item;
          }

          return item;
        })

        return {
          createDate: `${arrayDates[2]}.${arrayDates[1]}.${arrayDates[0]}`,
          createTime: `${arrayDates[3]}:${arrayDates[4]}`,
        }
      }

      return item;
    }).sort((a, b) => a.id - b.id);
  }







  // Запускаем приложение
  async function createApp() {
    const headerElement = createHeaderElement();
    const mainElement = createMainElement();
    const sectionElement = createSectionElement();
    const theadElement = createTheadElement();
    const modalWrapperElement = createModalWrapperElement();
    
    document.body.append(headerElement.header);
    mainElement.append(sectionElement.section);
    mainElement.append(modalWrapperElement);
    sectionElement.table.prepend(theadElement.thead);
    document.body.append(mainElement);

    sectionElement.tbody.classList.add('load');

    let clientsData = await getData();
    
    clientsData = editClientsData(clientsData);

    clientsData.forEach(item => {
      sectionElement.tbody.append(createTrElement(item))
    })

    if (window.location.hash.substring(1)) {
      const data = await getData(window.location.hash.substring(1));

      addModal(data);
    }

    sectionElement.tbody.classList.remove('load');
  }





  function createSpinner() {
    const spinnerWrapper = document.createElement('div');
    const spinner = document.createElement('div');

    spinnerWrapper.classList.add('spinner-wrapper');
    spinner.classList.add('spinner');

    spinnerWrapper.append(spinner);

    return spinnerWrapper;
  }





  function validateInput(input, errorField) {

    switch(input.name) {
      case 'name':
        if (input.value.length === 0) {
          errorField.textContent = errorField.textContent + 'Укажите имя. ';

          return true;
        }
        break;

      case 'surname':
        if (input.value.length === 0) {
          errorField.textContent = errorField.textContent + 'Укажите фамилию. ';

          return true;
        }
        break;

      case 'Другое':
        if (input.value.length === 0) {
          errorField.textContent = errorField.textContent + 'Заполните контакт "Другое". ';

          return true;
        } 
        break;

      case 'Телефон':
        const regularTel = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;   
        const validTel = regularTel.test(input.value);

        if (!validTel) {
          errorField.textContent = errorField.textContent + 'Укажите корректный телефон. ';

          return true;
        }  
        break;

      case 'Email':
        const regularMail = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;   
        const validMail = regularMail.test(input.value);

        if (!validMail) {
          errorField.textContent = errorField.textContent + 'Укажите корректную почту. ';

          return true;
        }
        break;

      case 'VK':
        const regularVk = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;   
        const validVk = regularVk.test(input.value);

        if (!validVk) {
          errorField.textContent = errorField.textContent + 'Укажите корректную ссылку Vk. ';

          return true;
        }
        break;

      case 'Facebook':
        const regularFacebook = /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;   
        const validFaceebook = regularFacebook.test(input.value);

        if (!validFaceebook) {
          errorField.textContent = errorField.textContent + 'Укажите корректную ссылку Facebook. ';

          return true;
        }
        break;






      default: 
        return false;
    }

  }






  document.addEventListener('DOMContentLoaded', () => {
    createApp();
  })


})()