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
        const [decreaseTweets, setDecreaseTweets] = useState(true);
        const [order, setOrder] = useState(2)

        const removeBorder = () => {
          if(decreaseUser === false){
            props.decreaseTotalUsers("twitter");
            setDecreaseUser(true)
          }
            setPicBorder("Gainsboro");
            setOrder(2);
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

                            setResponseTweets(newTweet);
                            if(newTweet > 0) {
                            setTweets( tweets + newTweet)
                            setDecreaseTweets(true)
                            setOrder(1);
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
          props.parentCallback(list, unreadTweets);
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
            <div className="displayBox" style={{ display: display, order: order}}>
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
        )
}

    function TwitterUsers(props) {
      const [oldTweets, setOldTweets] = useState([])

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
                }
                else {
                      console.log("No old tweets from" + friendScreenName);
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

      const sendData = () => {
        console.log(oldTweets)
        props.oldCallback(oldTweets);
    }

    useEffect(() => {
      requestTweets();
    },[])

        return (
            <div className="displayBox">
              <div className="story" >
                <img src={props.pic}  className="PicClip"
                onClick={() => sendData()}
              />
              </div>
            </div>
        )
}

    function RenderedTweets(props) {

      const [revert, setRevert] = useState(true)

      useEffect(() => {
              twttr.widgets.createTweet(
                      props.tweetData.tweetId ,
                      document.getElementById(props.order),
                      { align: "center", conversation: "none" , dnt: false}
              )
    })

      const showLinkedTweets = (revert) => {
        if(revert) {
          const el = document.getElementById(props.order);
          el.innerHTML = ""

        twttr.widgets.createTweet(
                props.tweetData.linkedTweet ,
                document.getElementById("linkedTweet" + props.order),
                { align: "center", conversation: "none", dnt: false  }
        )
      setRevert(false)
    } else {
        const el = document.getElementById(props.order);
        el.innerHTML = ""

         document.getElementById("linkedTweet" + props.order).innerHTML = ""
         setRevert(true)
        }
      }

      if(props.tweetData.linkedTweet) {
         return (<div className="renderedTweet">
                    <div id={props.order}></div>
                    <button className="renderLinkedtt" onClick={() => showLinkedTweets(revert)} >Show linked tweet</button>
                    <div id={"linkedTweet" + props.order}></div>
                </div> )} else {
                  return (<div className="renderedTweet">
                             <div id={props.order}></div>
                         </div>)
                }
    }

    function TweetsTimeline(props) {
      return (
        <div id="timeline" >
         {props.tweetsElement}
        </div>
      )
    }

    function Dashboard() {
          const  [totalTweets, setTotalTweets] = useState(0);
          const  [totalUsers, setTotalUsers] = useState(0);
          const  [idTwitter, setidTwitter] = useState(1);
          const  [tweetData, setTweetData] = useState([]);
          const [dataLength, setDataLength] = useState(0);
          const [unreadTweets, setUnreadTweets] = useState(0);
          const [oldTweets, setOldTweets] = useState([]);
          const [visibility, setVisibility] = useState("hidden");
          const [tweetsElement, setTweetElement] = useState([])

          const increaseTotalTweets = (update, dashboard) => {
                if(totalTweets >= 0) {
                  setTotalTweets(totalTweets + update);
                }
          }
          const decreaseTotalTweets = (update, dashboard) => {
                if(totalTweets > 0) {
                  setTotalTweets( totalTweets - update );
                }
          }
          const increaseTotalUsers = (dashboard) => {
                if(totalUsers >= 0 && totalUsers < friendsLength) {
                  setTotalUsers( totalUsers + 1);
                }
          }
          const decreaseTotalUsers = (dashboard) => {
                if(totalUsers > 0) {
                  setTotalUsers( totalUsers - 1);
                }
          }

          const callbackFunction = (list, unreadTweets) => {
            setTweetData(list);
            setDataLength(list.length)
            setUnreadTweets(unreadTweets)
            setVisibility("visible")
          }

          const oldCallback = (oldTweets) => {
            console.log(oldTweets)
            setOldTweets(oldTweets)
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
                                     oldCallback={oldCallback}
                      />));

            useEffect(() => {
                var elements = []
                for(let i=0; i < unreadTweets; i++) {
                  const el = document.getElementById(i);
                  if(el) {
                  el.innerHTML = ""
                }
                  elements.push(<RenderedTweets tweetData={tweetData[i]}
                                                     order={i}/>)
                  console.log(elements)
                }
                setTweetElement(elements)
                }
            , [tweetData])

            useEffect(() => {
            console.log("ODO")
                var elements = []
                for(let i=0; i < oldTweets.length; i++) {
                  const el = document.getElementById(i);
                  if(el) {
                  el.innerHTML = ""
                }
                  elements.push(<RenderedTweets tweetData={oldTweets[i]}
                                                     order={i}/>)
                  console.log("PIAN" + oldTweets[i])
                }
                setTweetElement(elements)
           }, [oldTweets])

           const scrollUserBar = (direction) => {
            const el = document.getElementById("userbar");
            direction ? el.scrollLeft += 300 : el.scrollLeft -= 300
          }

          return (
              <div>
                <div id="navbar">
                  <div id="buttons">
                    <a href="/config">Config</a>
                  </div>
                </div>
                <div id="render">
                  <div className="dashboard">
                    <div className="totalTweets" id="upDisplay">
                      <div className="totalTweetsnumber">
                      Tweets {totalTweets}
                      </div>
                    </div>
                    <div className="totalTweets" id="downDisplay">
                      <div className="totalTweetsnumber">
                      Users {totalUsers}
                      </div>
                    </div>
                  </div>
                  <div id="userbar" >
                      {userDisplays}
                  </div>
                  <div id="scrollButtonsWrap">
                    <button  className="ScrollButton" onClick={() => scrollUserBar(false)}>
                    {"<"}
                    </button>
                    <button className="ScrollButton" onClick={() => scrollUserBar(true)}>
                    {">"}
                    </button>
                  </div>
                </div>
                  <div id="flex">
                    <TweetsTimeline tweetsElement={tweetsElement} />
                    <div id="sidebar">
                    {twitterUsers}
                    </div>
                </div>
              </div>
            )

        }


    ReactDOM.render( <Dashboard /> ,
         document.getElementById("app"));

}

getTweets()
