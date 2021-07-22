const usersElement = document.querySelector('#chat');
const usersAlreadyWrote = ['neoleksa', 'roma2006qaz', 'commanderroot', 'pyotrs', 'violets_tv', 'bloodlustr ', 'ebanuyplayer', 'dcserverforsmallstreamers'];

const params = new URLSearchParams(window.location.search);
const channel = params.get('channel') || 'neoleksa';
const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: 'NeoLeksa',
    password: 'oauth:hziyunludgch5sq2bzauvd5vxd000k'
  },
  channels: [channel],
});

client.connect().then(() => {});

client.on('chat', (channel, userObject, message, self) => {
  if (self) return;
  console.log(userObject);
  console.log(channel);
  console.log(self);
  const { username } = userObject;
  usersElement.innerHTML = usersElement.innerHTML + '<div>' + username + ':<br>' + message + '</div>';

  // if (username.toLowerCase() === channel.toLowerCase()) {
  //   if (message === '!start-count') {
  //     listeningForCount = true;
  //   } else if (message === '!end-count') {
  //     listeningForCount = false;
  //     // say count out loud.
  //     const sayCount = new SpeechSynthesisUtterance(Object.keys(users).length);
  //     window.speechSynthesis.speak(sayCount);
  //   } else if (message === '!clear-count') {
  //     countElement.textContent = 'Waiting for count...';
  //     usersElement.textContent = '';
  //     users = {};
  //   }
  // } else if (listeningForCount && message === '1') {
  //   users[tags.username] = true;
  //   // display current count page.
  //   countElement.textContent = Object.keys(users).length;
  //   usersElement.textContent = Object.keys(users).join(', ');
  // }
});

client.on("join", (channel, username, self) => {
  if (self) return;
  console.log(username + ' join');
  if (!usersAlreadyWrote.includes(username)) {
    client.say(channel, username + ' присоеденился к нам на стрим!');
    usersAlreadyWrote.push(username);
  }
});
client.on("mods", (channel, mods) => {
  console.log('mods');
  console.log(mods);
});
client.on("subscription", (channel, username, method, message, userstate) => {
  client.say(channel, username + ' подписался на на канал!');
  console.log('subscription' + username);
});