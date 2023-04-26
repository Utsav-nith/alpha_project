import React from 'react'
import axios from 'axios'
import Right from '../assets/arrowRight.svg'
import Left from '../assets/arrowLeft.svg'
import Download from '../assets/Download.svg'
import {Search} from './Search'
import {fetchTrending} from './Giftrending'
import {fetchTrendSearch} from './GiftrendingSearch'



export default function Gif() {
    // STATEs
    const [data, setData] = React.useState([]);
    const [title, setTitle] = React.useState('Gif');
    const [loader, setLoader] = React.useState(true);
    const [offset, setOffset] = React.useState(0);
    const [limit, setLimit] = React.useState(8)
    const [totalCount, setTotalCount] = React.useState(0)
    const [search, setSearch] = React.useState("Happy");
    const [trending, setTrending] = React.useState(false)
    const [trendSearch, setTrendSearch] = React.useState(false)
    const [tSearch, setTsearch] = React.useState([])

//
// ─── FETCH ──────────────────────────────────────────────────────────────────────
const fetchData = async (title)=>{
  let URL = `https://api.giphy.com/v1/gifs/search?q=${title}&api_key=GlVGYHkr3WSBnllca54iNt0yFbjz7L65&limit=${limit}&offset=${offset}`;// Try and catch
try{
    let fetchGif = await axios(URL);
    let fetchRes = await fetchGif;
    // Set State console log
    if(fetchRes.status === 200){
    // console.log(fetchRes.data)
    // Set Data
    setData(fetchRes.data.data)
    // Set Total Count
    setTotalCount(fetchRes.data.pagination.total_count)
    // Set loader false
    setLoader(false)
     // Call new content
     content()
     // Set fetch random false
     if(trending){
     setTrending(false)
    // Reset offset
    setOffset(0)
     }
     // Set trend searching
     setTrendSearch(false)
    
    }
}
catch(error){
    if(error) throw error
}

}
// Remove image
// const removeImage = id => {
//     setData(
//      data.filter(gif => gif.id !== id)
//     )
//   }
// USE EFFECT on offset change fetch new data
React.useEffect(()=>{
    if(trending){
    fetchTrending(limit, offset, setOffset, setTrending, setData, setLoader, setTotalCount, content, setTrendSearch, title, setTitle)
    }
    if(!trending){
    fetchData(title)
    }
},[offset])

 //
 // ─── HANDLE DOWNLOAD ────────────────────────────────────────────────────────────
     
const handleDownload = (url)=>{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function(){
        let urlCreator = window.URL || window.webkitURL;
        let imageUrl = urlCreator.createObjectURL(this.response);
        let tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = title.charAt(0).toUpperCase() + title.slice(1);
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    }
    xhr.send();
}

// Scroll on top function
const onTop = () => {
    let options = { top: 0, left: 0, behavior: 'smooth' };
    window.scrollTo(options);
}

// Handle Next Pagination
const handleNext = ()=>{
    // Set loader true
    setLoader(true);
    // Add one page
    setOffset(offset + limit)
    // Go on top
    onTop()
}
// Handle prev Pagination
const handlePrev = ()=>{
    // Loader true
    setLoader(true);
    // One page
    setOffset(offset - limit) 
    // Go on top
    onTop()
}

 //
 // ─── RENDER CONTENT ─────────────────────────────────────────────────────────────
     
const content = () => {
    switch(true) {
    // If loader is true show loader spinner
      case loader:
        return <div></div>
    // If data array more than zero loop through
      case data.length > 0:
        return  data.map(g=> {
            return (
                <div className='gif-card' key={g.id}>
                <details>
                <summary>Show</summary>
                    <h4>{g.title !== undefined ? (g.title.charAt(0).toUpperCase() + g.title.slice(1)) : ''}</h4>
                <button onClick= {()=> handleDownload(g.images.fixed_height.url)} className="gif-download">
                    <img className='svg' src={Download} alt="download"/>
                </button>
                   
                </details>
                <img onClick= {()=> handleDownload(g.images.fixed_height.url)} className='image' src={g.images.fixed_width.url} alt="gif"/>
                </div>
            )
        })

    // Otherwise return default
      default:
        return data
    }
  }

//
// ─── RETURN ─────────────────────────────────────────────────────────────────────
    
return (
    <div>
        <header>
        
        <div className='gif-title'>
        <h1 className='gif-title-h1'> Gif Search</h1>
        </div>
        <div><strong>Search:</strong> {title}</div>
        <Search search={search} setSearch={setSearch} fetchData={fetchData} setTitle={setTitle}/>
        
        </header>
       <button className='gif-btn-trending' onClick={()=> fetchTrending(limit, offset, setOffset, setTrending, setData, setLoader, setTotalCount, content, setTrendSearch, title, setTitle)}>Trending</button>
       <button className='gif-btn-trendsearch' onClick={()=> trendSearch ? setTrendSearch(false) : fetchTrendSearch(setTrendSearch, trendSearch, setTsearch, setData)}>Trending Search</button>
        <div className='gif-wrap'>
      
        {trendSearch ? 
        (
            <div className='gif-trend-search'>
            <ul> 
            {tSearch.map((t,i)=> <li key={i}><strong>{i + 1}</strong> {t.toUpperCase()}</li>)}
            </ul>
            </div>
        )
        :
        ''
        }
          {content()}
        </div>

        <div className="pagination">
        {
            totalCount === 0 ?
            ''
            :
            offset < limit ?
            <img onClick={handleNext} className='svg' src={Right} alt="right"/>
            :
            offset >= totalCount ?
            <img onClick={handlePrev} className='svg' src={Left} alt="left"/>
            :
            <>
            <img onClick  ={handlePrev} className='svg' src={Left} alt="left"/>
            <img onClick={handleNext} className='svg' src={Right} alt="right"/>

            </>
        }
        
        </div>
       
    </div>
)
    }