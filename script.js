const KEY="api_key=5845114bbdbde378a00719dec87e4f6e";
const IuRL="https://api.themoviedb.org/3";
const URL=IuRL + '/discover/movie?' +KEY;
const IMG_URL='https://image.tmdb.org/t/p/w500/';
const search_url=IuRL + '/search/movie?'+ KEY;

const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]
const movies1=document.getElementById('movies1');

const main= document.getElementById('main');
const search=document.getElementById('search');
const form=document.getElementById('form');
const tags=document.getElementById('tags');

const prev=document.getElementById('prev');
const next=document.getElementById('next');
const curr=document.getElementById('curr');

var currentPage=1;
var prevPage=0;
var nextPage=2;
var last_url ='';
var totalPages=10;
Genre();
var checkGenre=[];
function Genre()
{
    tags.innerHTML='';
    genres.forEach(g=>{
        const t=document.createElement('div');
        t.classList.add('tag');
        t.id=g.id;
        t.innerText=g.name;
        t.addEventListener('click',()=>{
            if(checkGenre.length == 0)
            {
                checkGenre.push(g.id);
            }
            else
            {
                if(checkGenre.includes(g.id))
                {
                    checkGenre.forEach((id,idx)=>{
                        if(id==g.id)
                        {
                            checkGenre.splice(idx,1);
                        }
                    })
                }
                else
                {
                    checkGenre.push(g.id);
                }
            }
            console.log(checkGenre);
            getMovie(URL +'&with_genres='+ encodeURI(checkGenre.join(',')));
            highSelect();
        })
        
        tags.append(t);
    })
}

function highSelect()
{
    const tags1=document.querySelectorAll('.tag');
    tags1.forEach(tag=>{
        tag.classList.remove('highlights');
    })
    clearSearch()
    if(checkGenre.length!==0)
    {
        checkGenre.forEach(id=>{
            const highlight=document.getElementById(id);
            highlight.classList.add('highlights');
        })
    }
    
}
function clearSearch()
{
    let removeEle0=document.getElementById('removeEle');
    if(removeEle0)
    {
        removeEle0.classList.add('highlights');
    }
    else
    {
    let removeEle=document.createElement('div');
    removeEle.classList.add('tag','highlights');
    removeEle.id='removeEle';
    removeEle.innerText='Clear';
    tags.append(removeEle);
    removeEle.addEventListener('click',()=>{
        checkGenre=[];
        Genre();
        getMovie(URL);
        console.log(URL);
    })
    }
}
getMovie(URL);
function getMovie(url)
{
  last_url=url;
    fetch(url).then(res=>res.json()).then(data=>{
        if(data.results.length!==0){
        showMovie(data.results)
        currentPage=data.page;
        prevPage=currentPage-1;
        nextPage=currentPage+1;
        totalPages=data.total_pages;
        
        curr.innerText=currentPage;
        if(currentPage<=1)
        {
          prev.classList.add('disable');
          next.classList.remove('disable');
        }
        else if(currentPage>=totalPages)
        {
          next.classList.add('disable');
          prev.classList.remove('disable');
        }
        else{
          next.classList.remove('disable');
          prev.classList.remove('disable');
        }
        tags.scrollIntoView({behavior:"smooth"})
        }
        else
        {
            main.innerHTML=`<h1 class="noRes">No Matches Found</h1>`
        }
    })
}
function showMovie(data)
{
    main.innerHTML='';
    data.forEach(movie => {
        const {title,poster_path,vote_average,overview,id}=movie
        const movieQ=document.createElement('div');
        movieQ.classList.add('movie');
        movieQ.innerHTML=
        ` <img src="${poster_path? IMG_URL + poster_path : "https://previews.123rf.com/images/mathier/mathier1905/mathier190500002/134557216-no-thumbnail-image-placeholder-for-forums-blogs-and-websites.jpg?fj=1"}" alt=${title}>
        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${colorMovie(vote_average)}">${vote_average}</span>
        </div>
        <div class="description">
            <h3>Overview</h3>
            ${overview}
            <br/>
          <button class="Know_more" id=${id}>More</button>
        </div>`

        main.append(movieQ);
        document.getElementById(id).addEventListener('click',()=>{
          console.log(id)
          openNav(movie);
        })
    });
    
}
const overLay=document.getElementById('overlay-content')
function openNav(movie) {
  let id=movie.id
  fetch(IuRL+'/movie/' + id +'/videos?'+KEY).then(res=>res.json())
  .then(vData=>{
    
    console.log(vData)
    if(vData)
    {
      document.getElementById("myNav").style.width = "100%";
      if(vData.results.length>0)
      {
        var store=[]; 
        var carousel=[];
        vData.results.forEach((video,idx)=>{
          let {name,key,site}=video
          if(site == 'YouTube')
          {
            store.push(`<iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" 
            title="${name}" frameborder="0" class="store hide"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
            gyroscope; picture-in-picture" allowfullscreen></iframe>`)
          }
          if(idx<20){
          carousel.push(`<span class="cDots">${idx+1}</span>`)
        }
        })
        var contentCarousel=`
        <h1 class="noRes setFont">${movie.original_title}</h1>
        <br/>
        ${store.join()}
        <br/>
        <div class="cDot">${carousel.join()}</div>
        `
        
        overLay.innerHTML=  contentCarousel
        showVideos()
      }
      else
    {
      overLay.innerHTML=`<h1 class="noRes">No Matches Found</h1>`
    }
    }
    
  })
  
}
let slide=0
let totalVid=0
function showVideos()
{
  let storeClass=document.querySelectorAll('.store')
  let carDots=document.querySelectorAll('.cDots')
  totalVid=storeClass.length;
  storeClass.forEach((storeTag,idx)=>{
    if(slide==idx)
    {
      storeTag.classList.add('show')
      storeTag.classList.remove('hide')
    }
    else
    {
      storeTag.classList.add('hide')
      storeTag.classList.remove('show')
    }
  })
  carDots.forEach((car,idx)=>{
    if(slide==idx)
    {
      car.classList.add('active')
  
    }
    else{
      car.classList.remove('active')
    }
  })
}
const lArrow=document.getElementById('left-arrow')
const rArrow=document.getElementById('right-arrow')
lArrow.addEventListener('click',() => {
  if(totalVid>19)
  {
    if(slide>0)
  {
    slide--;
  }
  else
  {
    slide=19;
  }
  showVideos()
  }
  else{
  if(slide>0)
  {
    slide--;
  }
  else
  {
    slide=totalVid-1;
  }
  showVideos()
}
})
rArrow.addEventListener('click',() => {
  if(totalVid>19)
  {
    if(slide<20)
  {
    slide++;
  }
  else
  {
    slide=0;
  }
  showVideos()
  }
  else{
  if(slide<(totalVid-1))
  {
    slide++;
  }
  else
  {
    slide=0;
  }
  showVideos()
}
})
/* Close */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}
function colorMovie(avg)
{
    if(avg>=8)
    {
        return 'green'
    }
    else if(avg>=6)
    {
        return 'yellow'
    }
    else
    {
        return 'red';
    }
}
form.addEventListener('submit',e=>{
    e.preventDefault();
    const searchItem=search.value;
    checkGenre=[];
    Genre();
    if(searchItem)
    {
        getMovie(search_url+ '&query=' + searchItem)
    }
    else
    {
        getMovie(URL);
    }
})
prev.addEventListener('click',()=>{
  if(prevPage>=0)
  {
    pageCall(prevPage);
  }
})

next.addEventListener('click',()=>{
  if(nextPage<=totalPages)
  {
    pageCall(nextPage);
  }
})
function pageCall(page)
{
  let UrlSplit=last_url.split('?');
  let querySplit=UrlSplit[1].split('&');
  let key=querySplit[querySplit.length-1].split('=');
  if(key[0]!='page'){
     let url=last_url+'&page='+page;
     getMovie(url);
  }
  else
  {
    key[1]=page.toString();
    let a=key.join('=');
    querySplit[querySplit.length-1]=a;
    let b=querySplit.join('&');
    let url=UrlSplit[0]+'?'+b;
    getMovie(url);
  }
}
movies1.addEventListener('click',()=>{
  getMovie(URL);
})