/* chat.js — 1:1 chat, send & receive messages */

const Chat = (function(){
  let currentChatId = null;
  let unsubscribe = null;

  function chatIdFor(a,b){ return [a,b].sort().join('_'); }

  function renderMessage(m, meUid){
    const div = document.createElement('div');
    div.className = 'p-2 rounded max-w-[60%] ' + (m.from===meUid ? 'ml-auto bg-gray-700' : 'mr-auto bg-gray-800');
    div.innerHTML = `<div>${escapeHtml(m.text)}</div>
      <div class="text-gray-400 text-xs mt-1">${new Date(m.ts.seconds*1000).toLocaleString()}</div>`;
    return div;
  }

  async function openChat(myUid, other){
    const chatArea = document.getElementById('chat-area-placeholder');
    const html = await fetch('components/chat.html').then(r=>r.text());
    chatArea.innerHTML = html;

    document.getElementById('chat-user-name').textContent = other.name;
    document.getElementById('chat-user-photo').src = other.photoURL;
    document.getElementById('chat-user-sub').textContent = other.online ? 'Online' : ('Last seen ' + (other.lastSeen ? new Date(other.lastSeen.seconds*1000).toLocaleString() : '—'));

    document.getElementById('open-profile-btn').addEventListener('click', ()=>App.openProfile(other));

    currentChatId = chatIdFor(myUid, other.uid);
    const msgsRef = db.collection('chats').doc(currentChatId).collection('messages').orderBy('ts');

    const messagesEl = document.getElementById('messages');
    if(unsubscribe) unsubscribe();
    unsubscribe = msgsRef.onSnapshot(snap => {
      messagesEl.innerHTML = '';
      snap.forEach(d => messagesEl.appendChild(renderMessage(d.data(), myUid)));
      messagesEl.scrollTop = messagesEl.scrollHeight;
    });

    document.getElementById('send-btn').addEventListener('click', async () => {
      const input = document.getElementById('msg-input');
      const text = input.value.trim();
      if(!text) return;
      await db.collection('chats').doc(currentChatId).collection('messages').add({
        text, from: myUid, ts: firebase.firestore.FieldValue.serverTimestamp()
      });
      await db.collection('chats').doc(currentChatId).set({
        participants:[myUid, other.uid],
        lastMessage: text,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      }, {merge:true});
      input.value = '';
    });
  }

  return {openChat};
})();
