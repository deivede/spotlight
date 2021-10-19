const { useState } = React
const { useEffect} = React

async function getTweets() {

    const friendsObject = await fetch('/twitterfriends', {method: "GET"})
    const friendsJSON = await friendsObject.json();
    const friendsArray = friendsJSON.friendsArray;
    const friendsLength = friendsArray.length

    console.log(friendsJSON);

    function DisplayTwitter(props) {

        const [tweets, setTweets] = useState(0);
        const [responseTweets, setResponseTweets] = useState(0)
        const [opacity, setOpacity] = useState(0.3);
        const [visibility, setVisibility] = useState("visible");
        const [list, setList] = useState([]);
        const [unreadTweets, setUnreadTweets] = useState(0);
        const [picBorder, setPicBorder] = useState("Gainsboro");
        const [decreaseUser, setDecreaseUser] = useState(true);
        const [display, setDisplay] = useState("none");

        const removeBorder = () => {
          if(decreaseUser === false){
            props.decreaseTotalUsers("twitter");
            setDecreaseUser(true)
          }
            props.resetUserPics("twitter");
            setPicBorder("Gainsboro");
        }

        const requestTweets = () => {
            const friendScreenName = props.screen_name
            const friendId = props.id

            const setTweetsState = (response) => {
                {
                    if (response.ok) {
                        response.json()
                        .then( friend => {
                            const newTweet = friend.new_tweet;
                            const newList = friend.tweets_array;
                            console.log(newTweet, newList);

                            setResponseTweets(newTweet)
                            setTweets( tweets + newTweet );

                            if(newList.length > 0) {
                                for(let i=0 ; i<newList.length ; i++) {
                                    setList(list => [...list, newList[i]]);
                                }
                            }
                         })
                  }
                  else {
                        console.log("No new tweets from" + friendScreenName);
                    }
                }
            }

            async function fetchNewTweets() {
                const tweetsData = await fetch('/twitter', {
                    method: "POST",
                    body: friendId,
                    headers: new Headers({
                        "content-type": "application/json"
                    })
                });

                  return setTweetsState(tweetsData);
            }


           fetchNewTweets();
        }

        const renderTweetsList = () => {
          console.log(list);
          const timeline = document.getElementById("timeline");
          timeline.innerHTML = "";

          const tweetsList = list;
          for(let i=1; i <= tweetsList.length ; i++){
              const newDiv = document.createElement("div");
              newDiv.setAttribute("id", i)
              newDiv.innerHTML = "";
              document.getElementById("timeline").appendChild(newDiv);
           }

          for(let i=0; i < unreadTweets ; i++) {
              twttr.widgets.createTweet(
                   tweetsList[i],
                   document.getElementById(parseInt(i+1)),
                   {
                     align: "center"
                   }
                 );
           }


           function renderUnreadTweets(){
              for(let i = unreadTweets; i <= tweetsList.length ; i++) {
                    twttr.widgets.createTweet(
                      tweetsList[i],
                      document.getElementById(parseInt(i))
                    );
                 }
             }

            const renderMoreButton = document.createElement("button");
            renderMoreButton.addEventListener("click", renderUnreadTweets);
            renderMoreButton.setAttribute("id", "loadButton");
            renderMoreButton.innerHTML = "Mais Tweets";
            document.getElementById("timeline").appendChild(renderMoreButton);
            console.log(tweetsList);
        }

        useEffect(() => {
          if(tweets > 0) {
            if(picBorder !== "red") {
              setUnreadTweets(responseTweets);
            } else if(picBorder === "red") {
              setUnreadTweets(unreadTweets + responseTweets);
            }

            if(decreaseUser === true) {
              props.addPicsToDashboard(props.pic, "twitter");
              props.increaseTotalUsers("twitter");
              setDecreaseUser(false)
            }
              setDisplay("inline-block");
              setPicBorder("red");
              setOpacity(1);
              setVisibility("visible");
            }
        }, [tweets]);

        useEffect(() => {
          console.log(responseTweets + "porra")
          console.log(unreadTweets + "porra")
          props.increaseTotalTweets(unreadTweets, "twitter");
        }, [unreadTweets]);

        useEffect(() => {
          const hideDisplay = async () => {
            await requestTweets();
            if(tweets == 0) {
              setVisibility("hidden");
            }
          }
          hideDisplay();
          setInterval(() => requestTweets(), 300000);
        },[]);


        return (
          <div className="displayWrapper" style={{display: display}}>
            <div className="displayBox">
              <div className="story" style={{borderColor: picBorder}}>
                <img src={props.pic}  className="PicClip"
                onClick={() => {renderTweetsList(); removeBorder(); props.decreaseTotalTweets(unreadTweets, "twitter");}}
                style={{opacity: opacity}}/>
                <div className="newTweetsDisplay" style={{ visibility: visibility}}>
                  <div className="numberDisplay">
                  {tweets}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }

    function Dashboard() {

        const  [totalTweets, setTotalTweets] = useState(0);
        const  [totalUsers, setTotalUsers] = useState(0);
        const  [idTwitter, setidTwitter] = useState(1);
        const  [toggle, setToggle] =  useState("block");
        const  [newTwitterUserPosts, setNewTwitterUserPosts] = useState([]);

        const addPicsToDashboard = (pic, dashboard) => {
          switch (dashboard) {
          case "twitter":
            setNewTwitterUserPosts(newTwitterUserPosts => [...newTwitterUserPosts, pic]);
            break;
          }
        }

        const increaseTotalTweets = (update, dashboard) => {
          switch (dashboard) {
            case "twitter":
              if(totalTweets >= 0) {
                setTotalTweets(totalTweets + update);
              }
              break;
          }
        }

        const decreaseTotalTweets = (update, dashboard) => {
          switch (dashboard) {
            case "twitter":
              if(totalTweets > 0) {
                setTotalTweets( totalTweets - update );
              }
              break;
            }
        }

        const increaseTotalUsers = (dashboard) => {
          switch (dashboard) {
            case "twitter":
              if(totalUsers >= 0 && totalUsers < friendsLength) {
                setTotalUsers( totalUsers + 1);
              }
              break;
            }
        }

        const decreaseTotalUsers = (dashboard) => {
          switch (dashboard) {
            case "twitter":
              if(totalUsers > 0) {
                setTotalUsers( totalUsers - 1);
              }
              break;
            }
        }

        const resetState = (dashboard) => {
          switch (dashboard) {
            case "twitter":
              setTotalTweets(0)
              setTotalUsers(0)
              setNewTwitterUserPosts([])
              break;
          }
         }

        const resetUserPics = (dashboard) => {
           switch (dashboard) {
             case "twitter":
              setNewTwitterUserPosts([]);
              break;
           }
         }

        const hideDisplay = (dashboard) => {
          switch (dashboard) {
            case "twitter":
              if(toggle === "block") {
               setToggle("none")
             } else {
               setToggle("block")
             }
             const timeline = document.getElementById("timeline");
             timeline.innerHTML = "";
             break;
          }
        }

        var userDisplays = []
        userDisplays = friendsArray.map(friendProps => (
               <DisplayTwitter key={idTwitter + friendProps.index}
                               key_id={idTwitter + friendProps.index}
                               screen_name={friendProps.screen_name[0]}
                               pic={friendProps.pic[0]}
                               id={friendProps.id}
                               increaseTotalTweets={increaseTotalTweets}
                               decreaseTotalTweets={decreaseTotalTweets}
                               increaseTotalUsers={increaseTotalUsers}
                               decreaseTotalUsers={decreaseTotalUsers}
                               addPicsToDashboard={addPicsToDashboard}
                               resetUserPics={resetUserPics}
                />));

            return (
              <div>
                <div id="dashboardWrapper">
                  <div id="buttonsWrapper">
                    <button onClick={() => {hideDisplay("twitter")}} className="dashboard" >
                      <span href="#" className="fa fa-twitter"></span>
                      <span className="dashboardDisplay">{totalTweets}</span>
                      <span className="dashboardDisplay users">{totalUsers}</span>
                      <div>
                        <img className="PicClip small" src={newTwitterUserPosts[0]}/>
                        <img className="PicClip small" src={newTwitterUserPosts[1]}/>
                        <img className="PicClip small" src={newTwitterUserPosts[2]}/>
                        <img className="PicClip small" src={newTwitterUserPosts[3]}/>
                      </div>
                    </button>
                  </div>
                </div>
                <div id="twitter" style={{display: toggle}}>
                  {userDisplays}
                </div>
              </div>
            )

    }

    ReactDOM.render( <Dashboard /> ,
         document.getElementById("render"));

}

getTweets()
