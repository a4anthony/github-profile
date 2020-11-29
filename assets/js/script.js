getData();

function getData() {
  const request = new XMLHttpRequest();
  const body = {
    query: `
            query{
                 viewer {
                    repositories(orderBy: {field: CREATED_AT, direction: DESC}, first: 20) {
                      edges {
                        node {
                          id
                          name
                          licenseInfo {
                            name
                          }
                          updatedAt
                          languages(last: 10, orderBy: {field: SIZE, direction: DESC}) {
                            edges {
                              node {
                                name
                                color
                                id
                              }
                              size
                            }
                          }
                           url
                        }
                      }
                      totalCount
                    }
                        followers {
                          totalCount
                        }
                        following {
                          totalCount
                        }
                  }
                  user(login: "a4anthony") {
                        id
                        avatarUrl
                        bio
                        url
                        websiteUrl
                        starredRepositories {
                            totalCount
                         }
                  }
            }
            `,
  };
  request.open("POST", "https://api.github.com/graphql", true);
  request.setRequestHeader(
    "Authorization",
    "bearer c393872bce46727e6af42134f0440dc05d0be1d3"
  );
  request.onload = function () {
    // Begin accessing JSON data here
    const data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      console.log(data.data.user);
      console.log(data.data.viewer);
      setAccountInfo(
        data.data.user,
        data.data.viewer.following.totalCount,
        data.data.viewer.followers.totalCount
      );
      setRepositories(data.data.viewer.repositories.edges);
      const badges = document.querySelectorAll(".badge");
      badges.forEach(function (badge) {
        badge.innerHTML = data.data.viewer.repositories.totalCount;
      });
      document.querySelector("body").classList.remove("hidden");
    } else {
      console.log("error");
    }
  };
  request.send(JSON.stringify(body));
}

function setRepositories(repos) {
  repos.forEach(function (el, index) {
    const div = document.createElement("div");
    const divRepo = document.createElement("div");
    divRepo.classList = "repository-container";
    div.className = "repo";
    div.id = "repo" + index;
    div.innerHTML =
      '<div class="repo-description"><a href="' +
      el.node.url +
      '">' +
      el.node.name +
      "</a></div>" +
      '<div class="star-chart"><button class="star-repo">' +
      '<i class="far fa-star"></i>Star</button></div>';
    const body = document.querySelector(".repositories");
    const hr = document.createElement("hr");
    // body.appendChild(div);

    var ul = document.createElement("ul");
    ul.className = "h-list";
    var li1 = document.createElement("li");
    var li2 = document.createElement("li");
    var li3 = document.createElement("li");
    li1.className = "lang";
    li2.className = "liscence";
    li3.className = "updated-at";
    if (el.node.languages.edges.length !== 0) {
      const svgSpan = document.createElement("span");
      svgSpan.style.color = el.node.languages.edges[0].node.color;
      svgSpan.innerHTML =
        '<i class="fas fa-circle"></i><span style="color: #586069">' +
        el.node.languages.edges[0].node.name +
        "</span>";
      li1.appendChild(svgSpan);
      ul.appendChild(li1);
    }
    if (el.node.licenseInfo) {
      li2.innerHTML =
        '<i class="fas fa-balance-scale"></i>' + el.node.licenseInfo.name;
      ul.appendChild(li2);
    }
    const fDate = el.node.updatedAt.split("T")[0];
    li3.innerHTML = "Updated " + moment(fDate, "YYYY-MM-DD").fromNow();
    ul.appendChild(li3);
    divRepo.appendChild(div);
    divRepo.appendChild(ul);
    body.appendChild(divRepo);
    body.appendChild(hr);
  });
}

function setAccountInfo(user, followingCount, followersCount) {
  console.log(user);
  const avatars = document.querySelectorAll(".avatar-img");
  avatars.forEach(function (avatar) {
    avatar.setAttribute("src", user.avatarUrl);
  });

  const blogLinks = document.querySelectorAll(".blog-link");
  blogLinks.forEach(function (blogLink) {
    blogLink.innerHTML = user.websiteUrl;
    blogLink.setAttribute("href", "https://" + user.websiteUrl);
  });

  const bios = document.querySelectorAll(".bio");
  bios.forEach(function (bio) {
    bio.innerHTML = user.bio;
  });
  document.querySelector(".count-stars").innerHTML =
    user.starredRepositories.totalCount;
  document.querySelector(".count-followers").innerHTML = followersCount;
  document.querySelector(".count-following").innerHTML = followingCount;
}

window.onscroll = function () {
  myFunction();
};

var header = document.getElementById("tabLinks");
var headerSm = document.getElementById("tabLinksSm");
var sticky = header.offsetTop;
var stickySm = headerSm.offsetTop;
var avatar = document.getElementById("avatar");
var stickyAvatar = avatar.scrollHeight;
const mainTab = document.getElementById("mainTab");

function myFunction() {
  // console.log(headerSm.scrollTop)
  console.log(stickySm);
  console.log(window.pageYOffset);
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }

  if (window.pageYOffset >= stickySm) {
    console.log("should stick");
    headerSm.classList.add("sticky");
    mainTab.classList.add("sticky-set");
  } else {
    headerSm.classList.remove("sticky");
    mainTab.classList.remove("sticky-set");
  }
  // console.log()/
  if (window.pageYOffset > sticky + stickyAvatar) {
    header.classList.add("sticky-avatar");
  } else {
    header.classList.remove("sticky-avatar");
  }
}

const tabLinks = document.getElementById("tabLinks");
const tabLinksSm = document.getElementById("tabLinksSm");
tabLinksSm.innerHTML = tabLinks.innerHTML;
