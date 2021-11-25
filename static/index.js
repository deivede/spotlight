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
        const [oldTweets, setOldTweets] = useState([]);
        const [decreaseTweets, setDecreaseTweets] = useState(true);

        const removeBorder = () => {
          if(decreaseUser === false){
            props.decreaseTotalUsers("twitter");
            setDecreaseUser(true)
          }
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
                            const oldTweet = friend.old_tweets;

                            console.log(newTweet, newList);
                            console.log(oldTweet);

                            setOldTweets(oldTweet)
                            setResponseTweets(newTweet);
                            if(newTweet > 0) {
                            setTweets( tweets + newTweet)
                            setDecreaseTweets(true)
                          }

                            if(newList.length > 0) {
                                for(let i=0 ; i < newList.length ; i++) {
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

        const sendData = () => {
          console.log("me diga então")
          console.log(oldTweets)
          props.parentCallback(list, unreadTweets, oldTweets);
      }

      const decrease = () => {
          if( decreaseTweets === true) {
          setTimeout(() => props.decreaseTotalTweets(unreadTweets, "twitter"), 200)
        }
        setDecreaseTweets(false)
      }


        useEffect(() => {
          if(tweets > 0) {
            if(picBorder !== "red") {
              setUnreadTweets(responseTweets);
            } else if(picBorder === "red") {
              setUnreadTweets(unreadTweets + responseTweets);
            }

            if(decreaseUser === true) {
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
          <div className="displayWrapper" style={{ display: display}}>
            <div className="displayBox">
              <div className="story" style={{borderColor: picBorder}}>
                <img src={props.pic}  className="PicClip"
                onClick={() => {sendData(); removeBorder(); decrease();}}
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

    function TwitterUsers(props) {
      const [oldTweets, setOldTweets] = useState([]);

      const requestTweets = () => {
          const friendScreenName = props.screen_name
          const friendId = props.id

          const setTweetsState = (response) => {
              {
                  if (response.ok) {
                      response.json()
                      .then( friend => {
                          const oldTweet = friend.old_tweets;
                          console.log(oldTweet);
                          setOldTweets(oldTweet)
                })
              }  else {
                      console.log("No new tweets from" + friendScreenName);
                  }
              }
          }

          async function fetchNewTweets() {
              const tweetsData = await fetch('/oldtweets', {
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

      const getOld = () => {
        props.getOld(oldTweets);
        console.log("jao")
        console.log(oldTweets)
      }

      useEffect(() => {
        requestTweets();
      },[])

        return (
          <div className="displayWrapper" >
            <div className="displayBox">
              <div className="story" >
                <img src={props.pic}  className="PicClip"
                onClick={() => getOld()}
              />
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
        const  [tweetData, setTweetData] = useState([]);
        const [embedTweets, setEmbedTweets] = useState([]);
        const [dataLength, setDataLength] = useState(0);
        const [display, setDisplay] = useState("none");
        const [unreadTweets, setUnreadTweets] = useState(0);
        const [oldTweets, setOldTweets] = useState([]);
        const [usersVisibility, setUsersVisibility] = useState(true);
        const [visibility, setVisibility] = useState("hidden");

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

        const callbackFunction = (list, unreadTweets, oldTweets) => {
          console.log(list)
          setTweetData(list);
          setDataLength(list.length)
          setUnreadTweets(unreadTweets)
          setOldTweets(oldTweets)
          setVisibility("visible")
        }

        useEffect(() => {
          for(let i=0; i <= dataLength; i++) {
            var timeline = document.getElementById(i);
            if(timeline){
            timeline.innerHTML = "";
            }
          }
          console.log(unreadTweets)
          console.log(tweetData)
          for(let i=0; i < unreadTweets ; i++) {
              twttr.widgets.createTweet(
                   tweetData[i].tweetId,
                   document.getElementById(parseInt(i)),
                   {
                     align: "center"
                   }
                 );
           }
        }, [tweetData, unreadTweets])

        const renderLinkedTweets = (i) => {
          const div = document.getElementById("linkedtweets");
          div.innerHTML = "";

          console.log(tweetData[i].linkedTweet);
          twttr.widgets.createTweet(
               tweetData[i].linkedTweet,
               document.getElementById("linkedtweets"),
               {
                 align: "center"
               }
             );
        }

        const renderUnreadTweets = () => {
           for(let i = unreadTweets; i <= tweetData.length ; i++) {
                 twttr.widgets.createTweet(
                   tweetData[i].tweetId,
                   document.getElementById(parseInt(i))
                 );
              }
          }

        const renderOldTweets = () => {
          const div = document.getElementById("linkedtweets");
          div.innerHTML = "";
           for(let y=0; y < 20 ; y++) {
                 twttr.widgets.createTweet(
                   oldTweets[y],
                   document.getElementById("linkedtweets")
                 );
              }
          }

          const getOld = (alltweets) => {
            console.log("cads")
              setOldTweets(alltweets);
              setTimeout(() => renderOldTweets(), 1000);
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
                               parentCallback={callbackFunction}
                />));

        var twitterUsers = []
        twitterUsers = friendsArray.map(friendProps => (
               <TwitterUsers key={idTwitter + friendProps.index + 1}
                               key_id={idTwitter + friendProps.index + 1}
                               screen_name={friendProps.screen_name[0]}
                               pic={friendProps.pic[0]}
                               id={friendProps.id}
                               getOld={getOld}
                />));

          var tweetsElement = []

          if(dataLength == 0) {
            tweetsElement.push(<div>
                               </div>)
          } else {
            for(let i=0; i < dataLength; i++) {
              tweetsElement.push(<div>
                                  <div id={i}></div>
                                  <button
                                          onClick={() => renderLinkedTweets(i)}
                                          className="linkedtweet"
                                  >
                                  linked tweet
                                  </button>
                                 </div>)
            }
          }


          tweetsElement.push(<button
                  onClick={() => renderUnreadTweets()}
                  className="linkedtweet"
          >
          More Tweets
          </button>)

          tweetsElement.unshift(<button
                  onClick={() => renderOldTweets()}
                  className="linkedtweet"
          >
          Old Tweets
          </button>)

          const displayUsers = () => {
            display == "none" ? setDisplay("block") : setDisplay("none")
          }

        return (
            <div>
              <nav id="navbar"><a href="/config">Config</a></nav><button onClick={() =>  displayUsers()}>users</button>
              <div id="flex">
                <div id="render">
                    <div className="dashboard">
                      <span className="dashboardDisplay"><span className="totalTweets">{totalTweets}</span></span>
                      <span className="dashboardDisplay users"><span className="totalTweets">{totalUsers}</span></span>
                    </div>
                    <div style={{display: display}}>
                      {twitterUsers}
                    </div>
                    <div>
                      {userDisplays}
                    </div>
                  </div>
                <div id="timeline" style={{visibility: visibility}}>
                 {tweetsElement}
                </div>
                <div id="linkedtweets"></div>
              </div>
            </div>
          )

          }


    ReactDOM.render( <Dashboard /> ,
         document.getElementById("app"));

}

getTweets()
