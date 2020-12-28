
async function getTweets() {

    const friendsObject = await fetch('/twitterfriends', {method: "GET"})
    const friendsJSON = await friendsObject.json();
    const friendsArray = friendsJSON.friendsArray;
    const friendsLength = friendsArray.length

    console.log(friendsJSON);

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
            this.props.decreaseTotalUsers();
            this.setState({decrease_user: true})
          }
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
                            }
                            this.setState({new_tweets: this.state.new_tweets + newTweet});
                            this.props.incrementTotalTweets(this.state.unreadTweets);
                            if(newTweet > 0 && this.state.decrease_user === true) {
                              this.props.incrementTotalUsers();
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
                const tweetsData = await fetch('', {
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
                    onClick={() => {this.renderTweetsList(); this.removeBorder(); this.props.decreaseTotalTweets(this.state.unreadTweets);}}
                    style={{opacity: this.state.set_opacity}}/>
                    <div className="newTweetsDisplay" style={{border: this.state.remove_border, visibility: this.state.set_visibility}}>
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



    class TwitterDashboard extends React.Component {
        constructor(props) {
          super(props);
            this.state = {
                totalTweets: 0,
                totalUsers: 0,
                id: 1
            }
          this.incrementTotalTweets = this.incrementTotalTweets.bind(this);
          this.decreaseTotalTweets = this.decreaseTotalTweets.bind(this);
          this.incrementTotalUsers = this.incrementTotalUsers.bind(this);
          this.decreaseTotalUsers = this.decreaseTotalUsers.bind(this);
          this.resetState = this.resetState.bind(this);
          }

        incrementTotalTweets(update) {
          if(this.state.totalTweets >= 0) {
            this.setState({totalTweets: this.state.totalTweets + update});
          }
        }

        decreaseTotalTweets(update) {
          if(this.state.totalTweets > 0) {
          this.setState({totalTweets: this.state.totalTweets - update});
          }
        }

        incrementTotalUsers() {
          if(this.state.totalUsers >= 0){
          this.setState({totalUsers: this.state.totalUsers + 1});
          }
        }

        decreaseTotalUsers() {
          if(this.state.totalUsers > 0) {
          this.setState({totalUsers: this.state.totalUsers - 1});
          }
        }

        resetState() {
          this.setState({
            totalTweets: 0,
            totalUsers: 0
          });
         }

        remountDisplays() {
          this.setState({id: this.state.id * 50 })
        }

         render() {
           var userDisplays = []
           userDisplays = friendsArray.map(friendProps => (<DisplayTwitter key={this.state.id + friendProps.index} key_id={this.state.id + friendProps.index}
             screen_name={friendProps.screen_name[0]} pic={friendProps.pic[0]} id={friendProps.id} incrementTotalTweets={this.incrementTotalTweets}
             decreaseTotalTweets={this.decreaseTotalTweets} incrementTotalUsers={this.incrementTotalUsers} decreaseTotalUsers={this.decreaseTotalUsers} />));
           userDisplays.unshift(<button className="resetDashboard" onClick={() => {this.remountDisplays(); this.resetState();}}>Reset</button>)
            return (
              <div>
                <div>
                  <button className="dashboard" ><span href="#" className="fa fa-twitter"></span> <span className="dashboardDisplay">{this.state.totalTweets}
                  </span><span className="dashboardDisplay users">{this.state.totalUsers}</span>
                  </button>
                </div>
                <div >
                  {userDisplays}
                </div>
              </div>
            )
          }
    }

    ReactDOM.render(
                  <TwitterDashboard /> ,
         document.getElementById("render")
       );

}

getTweets();
