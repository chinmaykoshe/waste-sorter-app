/* users.js — list users, search, profile edit */

const Users = (function(){
  let unsubscribe = null;

  const usersListEl = () => document.getElementById('users-list');

  function renderUserItem(u){
    const div = document.createElement('div');
    div.className = 'flex items-center gap-3 p-2 rounded hover:bg-gray-700 cursor-pointer';
    const statusClass = u.online ? 'bg-green-500' : 'bg-gray-500';
    div.innerHTML = `
      <img src="${u.photoURL}" class="w-11 h-11 rounded-full"/>
      <div class="flex-1 flex flex-col">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full ${statusClass}"></span>
          <span class="font-semibold">${escapeHtml(u.name)}</span>
        </div>
        <div class="text-gray-400 text-sm">${u.email || ''} • ${u.lastSeen? timeAgo(u.lastSeen.toDate()) : '—'}</div>
      </div>
    `;
    div.addEventListener('click', ()=>window.App.openChatWith(u));
    return div;
  }

  function listen(q=''){
    if(unsubscribe) unsubscribe();
    let query = db.collection('users').orderBy('name');
    unsubscribe = query.onSnapshot(snap => {
      const list = usersListEl();
      list.innerHTML = '';
      snap.forEach(doc => {
        const u = doc.data();
        if(!u || !u.uid) return;
        if(Auth.getCurrentUser() && u.uid === Auth.getCurrentUser().uid) return;
        if(q && !u.name.toLowerCase().includes(q.toLowerCase())) return;
        list.appendChild(renderUserItem(u));
      });
    });
  }

  async function saveProfile(uid, data){
    await db.collection('users').doc(uid).set(data,{merge:true});
    const user = auth.currentUser;
    if(user && user.uid === uid) await user.updateProfile({displayName:data.name, photoURL:data.photoURL});
  }

  return {listen, saveProfile};
})();

function timeAgo(d){
  const diff = Math.floor((Date.now() - d.getTime())/1000);
  if(diff < 60) return diff+'s ago';
  if(diff < 3600) return Math.floor(diff/60)+'m ago';
  if(diff < 86400) return Math.floor(diff/3600)+'h ago';
  return Math.floor(diff/86400)+'d ago';
}

function escapeHtml(s){ return (s||'').replace(/[&<>'"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":"&#39;",'"':'&quot;'}[c])); }
