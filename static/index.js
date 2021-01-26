

async function getTweets() {

    const friendsObject = await fetch('/twitterfriends', {method: "GET"})
    const friendsJSON = await friendsObject.json();
    const friendsArray = friendsJSON.friendsArray;
    const friendsLength = friendsArray.length

    console.log(friendsJSON);

    const usersObject = await fetch('/instagramusers', {method: "GET"})
    const usersJSON = await usersObject.json();
    const usersArray = usersJSON.usersArray;
    const usersLength = usersArray.length

    console.log(usersJSON);

    class DisplayTwitter extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
              new_tweets: 0,
              set_opacity: 0.3,
              set_visibility: "visible",
              list: [],
              value: '',
              unreadTweets: 0,
              pic_border: "Gainsboro",
              decrease_user: true
            }
            this.requestTweets = this.requestTweets.bind(this);
            this.removeBorder = this.removeBorder.bind(this);
            this.renderTweetsList = this.renderTweetsList.bind(this);
        }

        removeBorder() {
          if(this.state.decrease_user === false){
            this.props.decreaseTotalUsers("twitter");
            this.setState({decrease_user: true})
          }
          this.props.resetUserPics("twitter");
          this.setState({pic_border: "Gainsboro"});
        }

        requestTweets() {
            const friendScreenName = this.props.screen_name
            const friendId = this.props.id

            const setTweetsState = (response) => {
                {
                    if (response.ok) {
                        response.json()
                        .then( friend => {
                            const newTweet = friend.new_tweet;
                            const newList = friend.tweets_array;
                            console.log(newTweet, newList);

                            if(this.state.pic_border !== "red") {
                              this.setState({unreadTweets: newTweet});
                            } else {
                              this.setState({unreadTweets: this.state.unreadTweets + newTweet});
                            }

                            this.setState({new_tweets: this.state.new_tweets + newTweet});
                            this.props.increaseTotalTweets(this.state.unreadTweets, "twitter");

                            if(newTweet > 0 && this.state.decrease_user === true) {
                              this.props.AddPicsToDashboard(this.props.pic, "twitter");
                              this.props.increaseTotalUsers("twitter");
                              this.setState({decrease_user: false})
                            }

                            if(newList.length > 0) {
                                for(let i=0 ; i<newList.length ; i++) {
                                    this.setState({value: newList[i]});
                                    console.log(this.state.value)
                                    this.setState(state => {
                                    const list = [state.value].concat(state.list);
                                    return {
                                        list,
                                        value: '',
                                    };
                                  });
                                  console.log(this.state.list)
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

        renderTweetsList() {
          const timeline = document.getElementById("timeline");
          timeline.innerHTML = "";

          const tweetsList = this.state.list;
          for(let i=1; i <= tweetsList.length ; i++){
              const newDiv = document.createElement("div");
              newDiv.setAttribute("id", i)
              newDiv.innerHTML = "";
              document.getElementById("timeline").appendChild(newDiv);
           }

          for(let i=0; i < this.state.unreadTweets ; i++) {
              twttr.widgets.createTweet(
                   tweetsList[i],
                   document.getElementById(parseInt(i+1)),
                 );
           }

           const unreadTweets = this.state.unreadTweets

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

        componentDidMount() {
            const hideDisplay = async () => {
              await this.requestTweets();
              if(this.state.new_tweets == 0) {
                this.setState({set_visibility: "hidden"});
              }
            }
            hideDisplay();
            setInterval(() => this.requestTweets(), 300000);
        }

        componentDidUpdate(prevProps, prevState) {
          if(this.state.new_tweets !== prevState.new_tweets) {
              this.setState({pic_border: "red"});
              this.setState({set_opacity: 1});
              this.setState({set_visibility: "visible"});
          }
        }

        render() {
            return (
              <div className="displayWrapper">
                <div className="displayBox">
                  <div className="story" style={{borderColor: this.state.pic_border}}>
                    <img src={this.props.pic}  className="PicClip"
                    onClick={() => {this.renderTweetsList(); this.removeBorder(); this.props.decreaseTotalTweets(this.state.unreadTweets, "twitter");}}
                    style={{opacity: this.state.set_opacity}}/>
                    <div className="newTweetsDisplay" style={{ visibility: this.state.set_visibility}}>
                      <div className="numberDisplay">
                      {this.state.new_tweets}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
        }
    }

    class DisplayInstagram extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
              new_stories: 0,
              set_opacity: 0.3,
              set_visibility: "visible",
              pic_border: "Gainsboro",
              unreadStories: 0,
              decrease_user: true,
              latestReel: 0
            }
            this.requestStories = this.requestStories.bind(this);
            this.removeBorder = this.removeBorder.bind(this);
        }

        removeBorder() {
          if(this.state.decrease_user === false){
            this.props.resetUserPics("instagram");
            this.props.decreaseTotalUsers("instagram");
            this.props.decreaseTotalTweets(this.state.unreadStories, "instagram");
            this.setState({decrease_user: true})
          }
         this.setState({pic_border: "Gainsboro"});
       }

        requestStories(load) {
            const userScreenName = this.props.screen_name;
            const userId = this.props.id;

            const setStoriesState = (response) => {
                {
                    if (response.ok) {
                        response.json().then(user => {
                            const newStorie = user.new_storie;
                            const lastReel = user.last_reel
                            console.log(newStorie);

                            if(this.state.pic_border !== "red") {
                              this.setState({unreadStories: newStorie - this.state.new_stories});
                            } else {
                              this.setState({unreadStories: this.state.unreadStories + (newStorie - this.state.new_stories)});
                            }

                            if (load === true) {
                              this.setState({latestReel: lastReel})
                              if(newStorie !== 0) {
                                this.setState({new_stories: newStorie});
                                this.setState({set_visibility: "visible"});
                                console.log(this.props.screen_name, this.state.latestReel)
                              }
                            } else {
                              if(lastReel > this.state.latestReel) {
                                  console.log(this.props.screen_name, lastReel, this.state.latestReel)
                                  this.props.increaseTotalUsers("instagram");
                                  this.props.increaseTotalTweets(this.state.unreadStories, "instagram");
                                  this.props.AddPicsToDashboard(this.props.pic, "instagram");
                                  this.setState({new_stories: newStorie});
                                  this.setState({latestReel: lastReel});
                                  this.setState({decrease_user: false});
                                  this.setState({pic_border: "red"});
                                  this.setState({set_opacity: 1});
                                  this.setState({set_visibility: "visible"});
                            }
                          }
                    })} else {
                        console.log("No new Stories from " + userScreenName);
                    }
                }
            }

            async function fetchNewStories() {
                const storiesData = await fetch("/instagram", {
                    method: "POST",
                    credentials: "include",
                    body: userId,
                    cache: "no-cache",
                    headers: new Headers({
                        "content-type": "application/json"
                    })

                });

                return setStoriesState(storiesData);
            }

           fetchNewStories();
        }

        componentDidMount() {
          this.requestStories(true);
          setInterval(() => this.requestStories(false), 315000);
        }

        render() {
          return (
            <div className="displayWrapper">
              <div className="displayBox">
                <div className="story" style={{borderColor: this.state.pic_border}}>
                  <img src={this.props.pic}  className="PicClip"
                  onClick={() => {this.removeBorder(); this.props.decreaseTotalStories(this.state.unreadStories, "instagram");}}
                  style={{opacity: this.state.set_opacity}}/>
                  <div className="newTweetsDisplay" style={{visibility: this.state.set_visibility}}>
                    <div className="numberDisplay">
                    {this.state.new_stories}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
    }

    class Dashboard extends React.Component {
        constructor(props) {
          super(props);
            this.state = {
                totalStories: 0,
                totalTweets: 0,
                totalUsers: 0,
                totalIgUsers: 0,
                idTwitter: 1,
                idInstagram: 1,
                igToggle: "block",
                Toggle: "block",
                newTwitterUserPosts: [],
                newInstagramUserPosts: [],
                valueTwitter: '',
                valueInstagram: ''
            }
          this.increaseTotalTweets = this.increaseTotalTweets.bind(this);
          this.decreaseTotalTweets = this.decreaseTotalTweets.bind(this);
          this.increaseTotalUsers = this.increaseTotalUsers.bind(this);
          this.decreaseTotalUsers = this.decreaseTotalUsers.bind(this);
          this.resetState = this.resetState.bind(this);
          this.hideDisplay = this.hideDisplay.bind(this);
          this.AddPicsToDashboard = this.AddPicsToDashboard.bind(this);
          this.resetUserPics = this.resetUserPics.bind(this);
        }

        AddPicsToDashboard(pic, dashboard){
          switch (dashboard) {
          case "twitter":
            this.setState({valueTwitter: pic})
            this.setState(state => {
              const newTwitterUserPosts = [state.valueTwitter].concat(state.newTwitterUserPosts);
              return {
                  newTwitterUserPosts,
                  valueTwitter: ''
              };
            });
            break;
          case "instagram":
            this.setState({valueInstagram: pic});
            this.setState(state => {
              const newInstagramUserPosts = [state.valueInstagram].concat(state.newInstagramUserPosts);
              return {
                  newInstagramUserPosts,
                  valueInstagram: ''
               };
             });
             break;
         }
        }

        increaseTotalTweets(update, dashboard) {
          switch (dashboard) {
            case "twitter":
              if(this.state.totalTweets >= 0) {
                this.setState({totalTweets: this.state.totalTweets + update});
              }
              break;
            case "instagram":
              if(this.state.totalStories >= 0) {
              this.setState({totalStories: this.state.totalStories + update});
              }
              break;
          }
        }

        decreaseTotalTweets(update, dashboard) {
          switch (dashboard) {
            case "twitter":
              if(this.state.totalTweets > 0) {
                this.setState({totalTweets: this.state.totalTweets - update});
              }
              break;
            case "instagram":
              if(this.state.totalStories > 0) {
              this.setState({totalStories: this.state.totalStories - update});
              }
              break;
            }
        }

        increaseTotalUsers(dashboard) {
          switch (dashboard) {
            case "twitter":
              if(this.state.totalUsers >= 0) {
                this.setState({totalUsers: this.state.totalUsers + 1});
              }
              break;
            case "instagram":
              if(this.state.totalIgUsers >= 0) {
              this.setState({totalIgUsers: this.state.totalIgUsers + 1});
              }
              break;
            }
        }

        decreaseTotalUsers(dashboard) {
          switch (dashboard) {
            case "twitter":
              if(this.state.totalUsers > 0) {
                this.setState({totalUsers: this.state.totalUsers - 1});
              }
              break;
            case "instagram":
              if(this.state.totalIgUsers > 0) {
              this.setState({totalIgUsers: this.state.totalIgUsers - 1});
              }
              break;
            }
        }

        resetState(dashboard) {
          switch (dashboard) {
            case "twitter":
              this.setState({
                totalTweets: 0,
                totalUsers: 0,
                newTwitterUserPosts: []
              });
              break;
            case "instagram":
              this.setState({
                totalIgUsers: 0,
                totalStories: 0,
                newInstagramUserPosts: []
              });
              break;
          }
         }

         resetUserPics(dashboard){
           switch (dashboard) {
             case "twitter":
              this.setState({newTwitterUserPosts: []});
              break;
             case "instagram":
              this.setState({newInstagramUserPosts: []});
              break;
           }
         }

        remountDisplays() {
          this.setState({idInstagram: this.state.id * 50 })
        }

        hideDisplay(dashboard) {
          switch (dashboard) {
            case "twitter":
              if(this.state.Toggle === "block") {
               this.setState({Toggle: "none"})
             } else {
               this.setState({Toggle: "block"})
             }
             const timeline = document.getElementById("timeline");
             timeline.innerHTML = "";
              break;
            case "instagram":
              if(this.state.igToggle === "block") {
               this.setState({igToggle: "none"})
             } else {
               this.setState({igToggle: "block"})
             }
             break;
          }
        }

        render() {
           var userDisplays = []
           var igUserDisplays = []
           userDisplays = friendsArray.map(friendProps => (
               <DisplayTwitter key={this.state.idTwitter + friendProps.index}
                               key_id={this.state.idTwitter + friendProps.index}
                               screen_name={friendProps.screen_name[0]}
                               pic={friendProps.pic[0]}
                               id={friendProps.id}
                               increaseTotalTweets={this.increaseTotalTweets}
                               decreaseTotalTweets={this.decreaseTotalTweets}
                               increaseTotalUsers={this.increaseTotalUsers}
                               decreaseTotalUsers={this.decreaseTotalUsers}
                               AddPicsToDashboard={this.AddPicsToDashboard}
                               resetUserPics={this.resetUserPics}
                />));
           userDisplays.unshift(<button className="resetDashboard" onClick={() => {this.resetState("twitter");}}>Reset</button>)

           igUserDisplays = usersArray.map(userProps => (
               <DisplayInstagram key={this.state.idInstagram + userProps.index}
                                 key_id={this.state.idInstagram + userProps.index}
                                 screen_name={userProps.screen_name[0]}
                                 pic={userProps.pic[0]}
                                 id={userProps.id}
                                 increaseTotalTweets={this.increaseTotalTweets}
                                 decreaseTotalTweets={this.decreaseTotalTweets}
                                 increaseTotalUsers={this.increaseTotalUsers}
                                 decreaseTotalUsers={this.decreaseTotalUsers}
                                 AddPicsToDashboard={this.AddPicsToDashboard}
                                 resetUserPics={this.resetUserPics}
                />));
           igUserDisplays.unshift(<button className="resetDashboard" onClick={() => {this.resetState("instagram");}}>Reset</button>)

            return (
              <div>
                <div id="dashboardWrapper">
                  <div id="buttonsWrapper">
                    <button onClick={() => {this.hideDisplay("twitter")}} className="dashboard" >
                      <span href="#" className="fa fa-twitter"></span>
                      <span className="dashboardDisplay">{this.state.totalTweets}</span>
                      <span className="dashboardDisplay users">{this.state.totalUsers}</span>
                      <div>
                        <img className="PicClip small" src={this.state.newTwitterUserPosts[0]}/>
                        <img className="PicClip small" src={this.state.newTwitterUserPosts[1]}/>
                        <img className="PicClip small" src={this.state.newTwitterUserPosts[2]}/>
                        <img className="PicClip small" src={this.state.newTwitterUserPosts[3]}/>
                      </div>
                    </button>
                    <button onClick={() => {this.hideDisplay("instagram")}} className="dashboard instagram" >
                      <span href="#" className="fa fa-instagram"></span>
                      <span className="dashboardDisplay stories">{this.state.totalStories}</span>
                      <span className="dashboardDisplay instagram">{this.state.totalIgUsers}</span>
                      <div>
                        <img className="PicClip small" src={this.state.newInstagramUserPosts[0]}/>
                        <img className="PicClip small" src={this.state.newInstagramUserPosts[1]}/>
                        <img className="PicClip small" src={this.state.newInstagramUserPosts[2]}/>
                        <img className="PicClip small" src={this.state.newInstagramUserPosts[3]}/>
                      </div>
                    </button>
                  </div>
                </div>
                <div id="twitter" style={{display: this.state.Toggle}}>
                  {userDisplays}
                </div>
                <div id="instagram" style={{display: this.state.igToggle}}>
                  {igUserDisplays}
                </div>
              </div>
            )
          }
    }

    ReactDOM.render( <Dashboard /> ,
         document.getElementById("render"));

}

getTweets()
