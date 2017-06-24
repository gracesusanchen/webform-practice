const request = require('request');
const API_KEY = '9622b4723f2375113533c2b614b40';

function renderMeetups(meetups) {
  const template = meetups.reduce((html, meetup, index) => {
    //<image src="${meetup.key_photo.thumb_link}"/>
    return `${html}\n` +
      `<tr><td></td><td><a href="${meetup.link}">${meetup.name}</a><td>` +
      `<td>${meetup.city}</td><td>${meetup.organizer.name}</td></tr>`;
  }, '');

  document.getElementById('meetup-list').innerHTML = template;
}

function fetchMeetups(zip) {
  request({
    url: 'https://api.meetup.com/find/groups',
    method: 'GET',
    qs: {
      key: API_KEY,
      zip
    }
  }, (err, response, body) => {
    let parsed = body;
    try {
      parsed = JSON.parse(body);
    } catch (e) {
      // TODO error handle
    }
    renderMeetups(parsed);
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
