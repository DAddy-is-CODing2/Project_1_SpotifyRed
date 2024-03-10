
let currSong = new Audio()
let songs
let currFolder




// convert secs to sec:min format
function convertSecsToMinSecs(secs) {
    let min = Math.floor(secs / 60)
    let sec = Math.floor(secs % 60)         // to remove the deciamal digits

    if (sec < 10) {
        sec = `0${sec}`;
    }
    return `${min}:${sec}`;
}



// getting the songs and displaying them

async function getsongs(folder) {
    currFolder = folder
    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    
    //parsing the dom
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")

    // getting the songs name 
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }



    
    // showing the list of the song names after filtering
    let songUl = document.querySelector(".lib_div").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""

    for (const sn of songs) {
        songUl.innerHTML += `<li class="s_list flex align justify" >
            <div class="mName">${sn}</div>
            <img class="mus align" src="imgs/music.svg" alt="music" />
            <img class="playN invert pic align" src="imgs/playNow.svg" alt="playme" />
            </li>`
    }


    
    //playing the music and getting the song name
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(em => {
        em.addEventListener("click", playM => {
            playMusic(em.querySelector(".mName").firstChild.textContent);
        })
    })

    return songs

}






// to play the music
const playMusic = (track , pause = false) => {
    currSong.src =`/${currFolder}/` +  track

    if(!pause){                     // to play the song initially when pressed play/pause
        currSong.play()
        plaY.src = "imgs/pause.svg"
    }
    
    document.querySelector(".mTitle").innerHTML = decodeURI(track)
    document.querySelector(".mTime").innerHTML = "00.00 / 00.00"
}





async function displayAlbums() {

    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response

    // console.log(response)

    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".card_box")
    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {
        const e = array[index]
        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-1)[0]

            // Get the metadata of the folder
            console.log(`${folder}`)
            let a = await fetch(`songs/${folder}/info.json`)
            let response = await a.json()

            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}"  class="cards p-space bg-black  border">
            <div class="smooth"  style="width: 40px; height: 40px; background-color: rgb(4, 188, 4); border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" style="fill:rgb(4, 188, 4)" >
                  <path d="M6.00098 19.998H22.001" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M3.697 4.04178C3.07909 4.2103 3.007 4.91778 2.827 5.51778C2.67653 6.08204 2.35861 7.33023 2.14236 8.18298C1.981 8.93778 1.9594 9.23778 2.0554 9.71778C2.281 10.6178 3.061 10.9718 4.741 11.4398C5.58568 11.6558 6.181 11.837 7.081 12.077C7.23548 12.1264 7.71553 12.2475 8.101 12.3518C8.461 12.4778 8.761 12.4418 8.6938 12.7178C8.64698 12.8275 8.1034 13.4378 7.5994 13.9778C7.261 14.3978 7.033 14.4997 7.033 14.8178C7.033 14.8178 7.021 15.2978 7.69376 15.3578C7.801 15.4178 9.241 15.7778 9.781 15.9338C10.501 16.1138 11.041 15.8978 11.485 15.5978L13.681 14.1578C14.161 13.9418 14.281 14.033 14.821 14.177L19.621 15.4778C20.461 15.7778 21.181 15.0578 20.9698 14.2178C20.701 12.7178 20.221 11.8178 19.441 10.8578C18.181 9.35778 16.6448 8.77257 15.541 8.57778C15.0373 8.48889 13.1435 8.33911 11.341 8.20578C9.49344 8.06912 7.74174 7.94889 7.681 7.85778C6.361 7.55778 6.76899 5.61978 6.205 4.77378C5.981 4.43778 5.581 4.37778 4.981 4.19778C4.4725 4.06761 4.09567 3.93305 3.697 4.04178Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>                
            </div>

            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("cards")).forEach(e => { 
        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })
}








// spotify function

async function spotify(){


    // play/pause the music
    plaY.addEventListener("click", () => {          // ** id.anyFunc()
        if (currSong.paused) {
            currSong.play()
            plaY.src = "imgs/pause.svg"
        }
        else {
            currSong.pause()
            plaY.src = "imgs/play.svg"
        }
    })






    // display albums on the page
    displayAlbums()





    //timestamp
    currSong.addEventListener("timeupdate", () => {         // ** must give "timeupdate" and currentTime and duration are functions
        document.querySelector(".mTime").innerHTML = convertSecsToMinSecs(currSong.currentTime) + " / " + convertSecsToMinSecs(currSong.duration)
        document.querySelector(".gol").style.left = (currSong.currentTime / currSong.duration) * 100 + "%"
    })





    // add eventlistener to seek bar
    document.querySelector(".seek").addEventListener("click", sk => {
        let sperc = sk.offsetX / sk.target.getBoundingClientRect().width
        document.querySelector(".gol").style.left = (sperc) * 100 + "%"             // offsetX gives the position where we clicked on the seek bar

        currSong.currentTime = currSong.duration * sperc              // change current time of song by seeking the bar   
    })





    // add eventlistener for hamburger
    document.querySelector(".ham").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })





    // add eventlistener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-150%"
    })





    // adding eventlistenenr for next/prev buttons
    preV.addEventListener("click", () => {
        let index = songs.indexOf(currSong.src.split("/").slice(-1)[0])             // getting the index of the curr song as the intial value for the index
        if ((index - 1) >= 0) {                                                           // if index-1 >= 0 then play the new song
            playMusic(songs[index - 1])
        }
    })

    nexT.addEventListener("click", () => {
        let index = songs.indexOf(currSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })





    // adding eventlistenr for volume buttons
    document.querySelector(".mVol").getElementsByTagName("input")[0].addEventListener("change", (v) => {
        console.log(v.target.value)
        currSong.volume = parseFloat(v.target.value) / 100
    })



    // Add event listener to mute the track
    document.querySelector(".mVol>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("imgs/volume.svg")){
            e.target.src = e.target.src.replace("imgs/volume.svg", "imgs/mute.svg")
            currSong.volume = 0;
            document.querySelector(".mVol").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("imgs/mute.svg", "imgs/volume.svg")
            currSong.volume = .10;
            document.querySelector(".mVol").getElementsByTagName("input")[0].value = 10;
        }

    })

}

spotify()





















