const usersElement = document.querySelector('#chat');
const usersAlreadyWrote = ['neoleksa'];
const chat = [
  {
    username: 'test',
    message: 'message message message message message message message message message',
    color: '#FF0000'
  }
];

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
let defaultColors = [
      '#FF0000','#0000FF','#008000','#B22222','#FF7F50',
      '#9ACD32','#FF4500','#2E8B57','#DAA520','#D2691E',
      '#5F9EA0','#1E90FF','#FF69B4','#8A2BE2','#00FF7F'
    ],
    randomColorsChosen = {};

function resolveColor(channel, username, color) {
  if(color !== null) {
    return color;
  }
  if(!(channel in randomColorsChosen)) {
    randomColorsChosen[channel] = {};
  }
  if(username in randomColorsChosen[channel]) {
    color = randomColorsChosen[channel][username];
  }
  else {
    color = defaultColors[Math.floor(Math.random()*defaultColors.length)];
    randomColorsChosen[channel][username] = color;
  }
  return color;
}

function formatEmotes(text, emotes) {
  let splitText = text.split('');
  for(const i in emotes) {
    const e = emotes[i];
    for(const j in e) {
      let mote = e[j];
      if(typeof mote == 'string') {
        mote = mote.split('-');
        mote = [parseInt(mote[0]), parseInt(mote[1])];
        const length = mote[1] - mote[0],
            empty = Array.apply(null, new Array(length + 1)).map(function () {
              return ''
            });
        splitText = splitText.slice(0, mote[0]).concat(empty).concat(splitText.slice(mote[1] + 1, splitText.length));
        splitText.splice(mote[0], 1, '<img width="26px" height="26px" class="emoticon" src="http://static-cdn.jtvnw.net/emoticons/v1/' + i + '/3.0">');
      }
    }
  }
  return splitText.join('');
}


client.connect().then(() => {});

client.on('message', (channel, userObject, message, self) => {
  if (self) return;
  const { username, color, emotes } = userObject;
  message = formatEmotes(message, emotes);
  if (username === 'neoleksa') return;
  console.log(userObject);
  console.log(message);
  console.log(channel);
  console.log(self);
  console.log(emotes);
  if (chat.length === 10) chat.shift();
  chat.push({
    username: username,
    message: message,
    color: resolveColor(channel, username, color)
  });
  usersElement.innerHTML = '';
  for (const user of chat) {
    usersElement.innerHTML = '<div><span style="color: ' + user.color + '">' + user.username + ': </span><p>'  + user.message + '</p></div>' + usersElement.innerHTML;
  }
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