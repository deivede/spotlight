
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
              remove_border: "",
              set_opacity: 0.3,
              set_visibility: "visible",
              list: [],
              value: ''
            }
            this.reqTweets = this.reqTweets.bind(this);
            this.removeBorder = this.removeBorder.bind(this);
            this.renderTweetsList = this.renderTweetsList.bind(this);
        }

        removeBorder() {
         this.setState({remove_border: "0px"});
       }

        reqTweets() {
            const friendId = this.props.id;

            const setTweetsState = (response) => {
                {
                    if (response.ok) {
                        response.json()
                        .then( friend => {
                            var newTweet = friend.new_tweet;
                            var newList = friend.tweets_array;
                            console.log(newTweet, newList);

                            this.setState({new_tweets: this.state.new_tweets + newTweet});
                            if(newList.length > 0) {
                                for(var i=0 ; i<newList.length ; i++) {
                                    this.setState({value: newList[i]});
                                    console.log(this.state.value)
                                    this.setState(state => {
                                    var list = [state.value].concat(state.list);
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
                        console.log("No new tweets from" + friendId);
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
          const div = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20']

          document.getElementById("0").innerHTML = "";
          document.getElementById("1").innerHTML = "";
          document.getElementById("2").innerHTML = "";
          document.getElementById("3").innerHTML = "";
          document.getElementById("4").innerHTML = "";
          document.getElementById("5").innerHTML = "";
          document.getElementById("6").innerHTML = "";
          document.getElementById("7").innerHTML = "";
          document.getElementById("8").innerHTML = "";
          document.getElementById("9").innerHTML = "";
          document.getElementById("10").innerHTML = "";
          document.getElementById("11").innerHTML = "";
          document.getElementById("12").innerHTML = "";
          document.getElementById("13").innerHTML = "";
          document.getElementById("14").innerHTML = "";
          document.getElementById("15").innerHTML = "";
          document.getElementById("16").innerHTML = "";
          document.getElementById("17").innerHTML = "";
          document.getElementById("18").innerHTML = "";
          document.getElementById("19").innerHTML = "";

          const tweetsList = this.state.list;

          if(tweetsList.length <= 20) {
            for(let i=0; i<=tweetsList.length ; i++) {
               twttr.widgets.createTweet(
                 tweetsList[i],
                 document.getElementById(div[i])
               );
            }
        } else if(tweetsList.length > 20) {
            for(let i=0; i<=19 ; i++) {
               twttr.widgets.createTweet(
                 tweetsList[i],
                 document.getElementById(div[i])
               );
            }
          }
          console.log(tweetsList);
        }

        componentDidMount() {
            const hideDisplay = async () => {
              await this.reqTweets();
              if(this.state.new_tweets == 0) {
                this.setState({set_visibility: "hidden"});
              }
            }
            hideDisplay();
            setInterval(() => this.reqTweets(), 300000);
        }

        componentDidUpdate(prevProps, prevState) {
          if(this.state.new_tweets !== prevState.new_tweets) {
              this.setState({remove_border: "3px solid red"});
              this.setState({set_opacity: 1});
              this.setState({set_visibility: "visible"});
          }
        }

        render() {
            return (
              <div className="displayWrapper">
                <div className="displayBox">
                  <div>
                    <img src={this.props.pic}  className="PicClip"
                    onClick={() => {this.renderTweetsList(); this.removeBorder()}}
                    style={{opacity: this.state.set_opacity}}/>
                  </div>
                  <div className="newTweetsDisplay" style={{border: this.state.remove_border, visibility: this.state.set_visibility}}>
                    <div className="numberDisplay">
                    {this.state.new_tweets}
                    </div>
                  </div>
                </div>
              </div>
            )
        }
    }

    class RenderTweets extends React.Component {
                  render() {
                    var displayTwitterArray = []
                    displayTwitterArray = friendsArray.map(friendProps => (<DisplayTwitter key={friendProps.id} pic={friendProps.pic[0]} id={friendProps.id} />));
                    return displayTwitterArray
                  }
              }

    ReactDOM.render(
                  <RenderTweets /> ,
         document.getElementById("render")
       );

}

getTweets();
