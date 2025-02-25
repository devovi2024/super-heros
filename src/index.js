const allTabsBody = document.querySelectorAll('.tab-body-single');
const allTabsHead = document.querySelectorAll('.tab-head-single');
const searchForm = document.querySelector('.app-header-search');
const searchList = document.getElementById('search-list');

let activeTab = 1, allData;

const init = () => {
    showActiveTabBody();
    showActiveTabHead();
}

const showActiveTabHead = () => {
    hideAllTabHead();
    allTabsHead[activeTab - 1].classList.add('active-tab');
}

const showActiveTabBody = () => {
    hideAllTabBody();
    allTabsBody[activeTab - 1].classList.add('show-tab');
}

const hideAllTabBody = () => allTabsBody.forEach(tabBody => tabBody.classList.remove('show-tab'));
const hideAllTabHead = () => allTabsHead.forEach(tabHead => tabHead.classList.remove('active-tab'));

// Event listeners
window.addEventListener('DOMContentLoaded', init);

allTabsHead.forEach(tabHead => {
    tabHead.addEventListener('click', () => {
        activeTab = tabHead.dataset.id;
        showActiveTabHead();
        showActiveTabBody();
    });
});

const getInputValue = (event) => {
    event.preventDefault();
    const searchText = searchForm.search.value;
    fetchAllSuperHero(searchText);
}

// Search form submission
searchForm.addEventListener('submit', getInputValue);

const fetchAllSuperHero = async (searchText) => {
    const url = `https://www.superheroapi.com/api.php/727054372039115/search/${searchText}`;
    try {
        const response = await fetch(url);
        allData = await response.json();
        if (allData.response === 'success') {
            showSearchList(allData.results);
        }
    } catch (error) {
        console.error(error);
    }
}

const showSearchList = (data) => {
    searchList.innerHTML = "";
    data.forEach(({ id, name, image }) => {
        const divElem = document.createElement('div');
        divElem.classList.add('search-list-item');
        divElem.innerHTML = `
            <img src="${image.url || ''}" alt="">
            <p data-id="${id}">${name}</p>
        `;
        searchList.appendChild(divElem);
    });
}

searchForm.search.addEventListener('keyup', () => {
    const searchValue = searchForm.search.value;
    if (searchValue.length > 1) {
        fetchAllSuperHero(searchValue);
    } else {
        searchList.innerHTML = "";
    }
});

searchList.addEventListener('click', (event) => {
    const searchId = event.target.dataset.id;
    const singleData = allData.results.find(dataItem => searchId === dataItem.id);
    if (singleData) {
        showSuperheroDetails(singleData);
        searchList.innerHTML = "";
    }
});

const showSuperheroDetails = (data) => {
    const { image, name, powerstats, biography, appearance, connections } = data;

    document.querySelector('.app-body-content-thumbnail').innerHTML = `<img src="${image.url}">`;
    document.querySelector('.name').textContent = name;

    const createStatsList = (stats) => {
        return Object.entries(stats).map(([key, value]) => `
            <li>
                <div>
                    <i class="fa-solid fa-shield-halved"></i>
                    <span>${key}</span>
                </div>
                <span>${value}</span>
            </li>
        `).join('');
    };

    document.querySelector('.powerstats').innerHTML = createStatsList(powerstats);
    document.querySelector('.biography').innerHTML = createStatsList(biography);
    document.querySelector('.appearance').innerHTML = createStatsList(appearance);
    document.querySelector('.connections').innerHTML = createStatsList(connections);
}