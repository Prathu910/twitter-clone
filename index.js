import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const darkToggle = document.querySelector(".dark-toggle");
const availableTweets =
  JSON.parse(localStorage.getItem("stored")) ?? tweetsData;

document.addEventListener("click", function (e) {
  if (e.target.dataset.like) {
    handleLikeClick(e.target.dataset.like);
  } else if (e.target.dataset.retweet) {
    handleRetweetClick(e.target.dataset.retweet);
  } else if (e.target.dataset.replies) {
    handleReplyClick(e.target.dataset.replies);
  } else if (e.target.id === "post") {
    handlePostTweetClick();
  } else if (e.target.dataset.reply) {
    handleYourReplyClick(e.target.dataset.reply);
  }
});

// Dark Mode toggle.
darkToggle.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  darkToggle.classList.toggle("fa-toggle-on");
});

function handleLikeClick(tweetId) {
  const likedtweetObj = availableTweets.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (likedtweetObj.isLiked) {
    likedtweetObj.likes--;
  } else {
    likedtweetObj.likes++;
  }

  likedtweetObj.isLiked = !likedtweetObj.isLiked;

  render();
}

function handleRetweetClick(tweetId) {
  const retweetedtweetObj = availableTweets.filter(function (tweet) {
    return tweet.uuid === tweetId;
  })[0];

  if (retweetedtweetObj.isRetweeted) {
    retweetedtweetObj.retweets--;
  } else {
    retweetedtweetObj.retweets++;
  }

  retweetedtweetObj.isRetweeted = !retweetedtweetObj.isRetweeted;

  render();
}

function handleReplyClick(tweetId) {
  document.getElementById(`reply-${tweetId}`).classList.toggle("hidden");
}

function handlePostTweetClick() {
  if (document.querySelector("#writeTweet").value) {
    const tweetText = document.querySelector("#writeTweet").value;
    availableTweets.unshift({
      handle: `@prathu`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: `${tweetText}`,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
    // Adding tweetsData Array to the localStorage.
    localStorage.setItem("stored", JSON.stringify(tweetsData));
    render();
  }
  document.querySelector("#writeTweet").value = "";
}

function handleYourReplyClick(tweetId) {
  const replyText = document.getElementById(`your-reply-${tweetId}`).value;
  // check if anything is written on textArea
  if (replyText) {
    // Push the new reply to its replies obj
    const repliedTweetObj = availableTweets.filter(function (tweet) {
      return tweet.uuid === tweetId;
    })[0];
    repliedTweetObj.replies.unshift({
      handle: `@prathu`,
      profilePic: `images/scrimbalogo.png`,
      tweetText: `${replyText}`,
    });
    // Adding tweetsData Array to the localStorage.
    localStorage.setItem("stored", JSON.stringify(availableTweets));
    // render the Reply
    render();
    handleReplyClick(tweetId);
  }
}

function feedHtml() {
  let tweetHtml = "";

  availableTweets.forEach(function (tweet) {
    let likedClass = "";
    let retweetClass = "";
    let repliesHtml = "";

    if (tweet.isLiked) {
      likedClass = "liked";
    }
    if (tweet.isRetweeted) {
      retweetClass = "retweeted";
    }

    if (tweet.replies.length > 0) {
      tweet.replies.forEach(function (reply) {
        repliesHtml += `
            <div class="replies">
              <img src="${reply.profilePic}" alt="Replied-Tweet-Img" />
              <div class="repliesDetails">
                <p class="tweetHandle">${reply.handle}</p>
                <p class="tweetText">${reply.tweetText}</p>
              </div>
            </div>
              `;
      });
    }
    tweetHtml += `
        <div class="tweet">
            <img src="${tweet.profilePic}" alt="Profile-Img" />
            <div class="tweetDetails">
                <p class="tweetHandle">${tweet.handle}</p>
                <p class="tweetText">
                    ${tweet.tweetText}
                </p>
                <div class="tweetActions">
                    <i class="fa-regular fa-comment-dots tweetAction" data-replies="${tweet.uuid}"><span>${tweet.replies.length}</span></i>
                    <i class="fa-solid fa-heart tweetAction ${likedClass}" data-like="${tweet.uuid}"><span>${tweet.likes}</span></i>
                    <i class="fa-solid fa-retweet tweetAction ${retweetClass}" data-retweet="${tweet.uuid}"><span>${tweet.retweets}</span></i>
                </div>
            </div>
       </div>
       <div class="hidden tweet-reply" id="reply-${tweet.uuid}">
       <div class="your-reply">
          <div class="replytext">
            <img src="images/scrimbalogo.png" alt="profile-pic" />
            <textarea
              name="reply"
              id="your-reply-${tweet.uuid}"
              placeholder="Enter Your Reply.."
            ></textarea>
          </div>
          <button class="reply-btn" data-reply="${tweet.uuid}">Reply</button>
        </div>
        ${repliesHtml}
       </div> 
    `;
  });

  return tweetHtml;
}

function render() {
  const tweets = document.querySelector(".tweets");
  tweets.innerHTML = feedHtml();
}

render();
