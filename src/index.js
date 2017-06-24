const request = require('request');
const API_KEY = '9622b4723f2375113533c2b614b40';

const MEETUP_LIST = 'meetup-list';

function overwriteMeetupList(html) {
  document.getElementById(MEETUP_LIST).innerHTML = html;
}

function meetupTemplate(meetup) {
  let photo = 'https://secure.meetupstatic.com/s/img/041003812446967856280/logo/svg/logo--script.svg';
  if (meetup.key_photo) {
    photo = meetup.key_photo.thumb_link;
  } else if (meetup.group_photo) {
    photo = meetup.group_photo.thumb_link;
  }
  return `<tr><td><img src=${photo}/></td>` +
      `<td><a href="${meetup.link}">${meetup.name}</a><td>` +
      `<td>${meetup.city}</td>` +
      `<td>${meetup.organizer.name}</td>` +
    '</tr>';
}

function renderMeetups(meetups) {
  const template = meetups.reduce((html, meetup, index) =>
    `${html}\n` + meetupTemplate(meetup)
  , '');
  overwriteMeetupList(template);
}

function errorHandle() {
  overwriteMeetupList(
    `<tr><td>No results available. Have you entered a valid zipcode?</td></tr>`);
}

function toggleLoading() {
  overwriteMeetupList(`<tr><td>Loading...</td></tr>`);
}

function fetchMeetups(zip) {
  toggleLoading();
  request({
    url: 'https://api.meetup.com/find/groups',
    method: 'GET',
    qs: {
      key: API_KEY,
      zip
    }
  }, (err, response, body) => {
    if (err || response.statusCode !== 200
      || body.length === 0) {
      errorHandle();
    } else {
      let parsed = body;
      try {
        parsed = JSON.parse(body);
        renderMeetups(parsed);
      } catch (e) {
        errorHandle();
      }
    }
  });
}

window.onload = () => {
  const zipInput = document.getElementById('zip-input');
  zipInput.addEventListener('keydown', (event) => {
    if (event.which === 13) {
      fetchMeetups(zipInput.value);
    }
  });
};
