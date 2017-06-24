const request = require('request');
const API_KEY = '9622b4723f2375113533c2b614b40';

function renderMeetups(meetups) {
  const template = meetups.reduce((html, meetup, index) => {
    return `${html}\n` +
      `<p>${index}: ${meetup.name}</p>`;
  }, '');

  document.getElementById('container').innerHTML = template;
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

fetchMeetups('94107');