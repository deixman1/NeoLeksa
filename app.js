const usersElement = document.querySelector('#chat');
const usersAlreadyWrote = ['neoleksa', 'ebanuyplayer', 'roma2006qaz'];
const chat = [
  {
    username: 'test',
    message: 'message',
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


client.connect().then(() => {});

client.on('chat', (channel, userObject, message, self) => {
  if (self) return;
  console.log(userObject);
  console.log(channel);
  console.log(self);
  const { username, color } = userObject;
  if (username === 'neoleksa') return;
  if (chat.length === 7) chat.shift();
  chat.push({
    username: username,
    message: message,
    color: color
  });
  usersElement.innerHTML = '';
  for (const user of chat) {
    usersElement.innerHTML = usersElement.innerHTML +
        '<div><h3 style="color: ' + user.color + '">' + user.username + ':</h3><p>' + user.message + '</p></div>';
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