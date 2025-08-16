(()=>{
    let youtubeLeftControls,youtubePlayer;
    let currentVideo="";
    let currentVideoBookmarks=[];
    chrome.runtime.onMessage.addListener((obj,sender,response)=>{
        const{ type,value,videoId}=obj;
        if(type="NEW"){
            currentVideo=videoId;
            newVideoLoaded();
        }
    });
    const fetchBookmarks=()=>{
       return new Promise((resolve)=>{
        chrome.storage.sync.get([currentVideo],(obj)=>{
            resolve(obj[currentVideo]? JSON.parse(obj[currentVideo]):[]);
        });
       });
    }
    const newVideoLoaded= async () =>{
        const bookmarkbtnExists= document.getElementsByClassName("bookmark-btn")[0];
        currentVideoBookmarks=await fetchBookmarks();
        console.log(bookmarkbtnExists);
        if(!bookmarkbtnExists){
            const bookmarkBtn=document.createElement("img");
            bookmarkBtn.src=chrome.runtime.getURL("images/bookmark.png");
            bookmarkBtn.className="ytp-button"+"bookmark-btn";
            bookmarkBtn.title="Click to bookmark current timestamp";
            youtubeLeftControls= document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer= document.getElementsByClassName("video-stream")[0];
            youtubeLeftControls.appendChild();
            bookmarkBtn.addEventListener("click",addNewBookmarkEventHandeler);
        }
    }
    const addNewBookmarkEventHandeler=async()=>{
        const currentTime= youtubePlayer.currentTime;
        const newBookmark={
            time:currentTime,
            desc:"Bookmark at"+ getTime(currentTime),
        };
        currentVideoBookmarks= await fetchBookmarks();
        chrome.storage.sync.set({
            [currentVideo]:JSON.stringify([...currentVideoBookmarks,newBookmark].sort((a,b)=>a.time-b.time))
        });
    }
})();
const getTime = t=>{
    var date=new Date(0);
    date.setSeconds(t);
    return date.toISOString(),substr(11,8);
}