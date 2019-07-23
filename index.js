(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12


  const dataPanel = document.getElementById('data-panel')
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  const displayToggle = document.getElementById('display-toggle')
  let paginationData = []
  let displayMode = 'card'
  let focusPage = 1


  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    //displayDataList(data)
    getTotalPages(data)
    getPageData(1, data)
  }).catch((err) => console.log(err))



  displayToggle.addEventListener('click', event => {
    if (event.target.className.indexOf('fa') === 0) {
      modeFlag(event.target.parentNode)
      getTotalPages(data)
      getPageData(focusPage, data)
    } else {
      modeFlag(event.target)
      getTotalPages(data)
      getPageData(focusPage, data)
    }
  })


  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let results = []
    const regex = new RegExp(searchInput.value, 'i')
    results = data.filter(movie => movie.title.match(regex))
    console.log(results)
    //displayDataList(results)
    getTotalPages(results)
    getPageData(1, results)
  })


  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })

  // listen to pagination click event
  pagination.addEventListener('click', event => {
    console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      focusPage = event.target.dataset.page
      console.log(`focusPage now is ${focusPage}`)
      getPageData(event.target.dataset.page)
    }
  })

  function modeFlag(node) {
    if (node.className.indexOf('cardMode') === 21) {
      displayMode = 'card'
    } else {
      displayMode = 'list'
    }
  }


  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  function displayDataList(data) {
    let htmlContent = ''
    if (displayMode === 'card') {
      data.forEach(function (item, index) {

        htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h5>
            </div>

            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
      })
    } else if (displayMode === 'list') {
      htmlContent += `
        <table class="table">
           <tbody>
         `
      data.forEach(function (item, index) {
        htmlContent += `
          <tr class="row">
            <td class="col-sm-10">${item.title}</td>
            <td class="col-sm-2">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </td>
          </tr>
        `
      })
      htmlContent += `
          </tbody>
        </table>
      `
    }
    dataPanel.innerHTML = htmlContent
  }


  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  function showMovie(id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id
    console.log(url)

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results
      console.log(data)

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }
})()


