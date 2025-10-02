/* main.js — Tailwind-ready, responsive chat app loader */

window.App = (function(){
  const root = document.getElementById('component-root');

  async function loadComponent(path){
    const t = await fetch(path).then(r => r.text());
    return t;
  }

  async function showSignin(){
    root.innerHTML = await loadComponent('components/signin.html');

    document.getElementById('signin-btn').addEventListener('click', async ()=>{
      const email = document.getElementById('email').value.trim();
      const pass = document.getElementById('password').value.trim();
      try{ await Auth.signin(email, pass); } catch(e){ alert(e.message); }
    });

    document.getElementById('signup-btn').addEventListener('click', async ()=>{
      const email = document.getElementById('email').value.trim();
      const pass = document.getElementById('password').value.trim();
      const name = prompt('Display name:','New User');
      try{ await Auth.signup(email, pass, name); } catch(e){ alert(e.message); }
    });
  }

  async function showUsers(){
    root.innerHTML = await loadComponent('components/users.html');

    const me = Auth.getCurrentUser();
    document.getElementById('me-photo').src = me.photoURL || `https://i.pravatar.cc/100?u=${me.uid}`;
    document.getElementById('me-name').textContent = me.displayName || 'User';
    document.getElementById('me-email').textContent = me.email || '';
    document.getElementById('signout-btn').addEventListener('click', ()=>Auth.signout());

    const search = document.getElementById('user-search');
    search.addEventListener('input', ()=>Users.listen(search.value));
    Users.listen();
    setOnline(me.uid, true);

    // Hamburger toggle
    const hamburger = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');
    if(hamburger && sidebar){
      hamburger.addEventListener('click', ()=> sidebar.classList.toggle('hidden'));
      document.addEventListener('click', e=>{
        if(window.innerWidth < 768 && !sidebar.contains(e.target) && !hamburger.contains(e.target)){
          sidebar.classList.add('hidden');
        }
      });
    }
  }

  async function openChatWith(userObj){
    const me = Auth.getCurrentUser();
    if(!me) return alert('Not signed in');
    await Chat.openChat(me.uid, userObj);

    // hide sidebar on mobile
    const sidebar = document.getElementById('sidebar');
    if(window.innerWidth < 768 && sidebar) sidebar.classList.add('hidden');
  }

  async function openProfile(userObj){
    const html = await loadComponent('components/profile.html');
    const modalRoot = document.createElement('div');
    modalRoot.id = 'profile-modal';
    modalRoot.innerHTML = html;
    document.body.appendChild(modalRoot);

    document.getElementById('profile-name').value = userObj.name || '';
    document.getElementById('profile-photo').value = userObj.photoURL || '';

    document.getElementById('save-profile').addEventListener('click', async ()=>{
      const name = document.getElementById('profile-name').value.trim();
      const photoURL = document.getElementById('profile-photo').value.trim();
      await Users.saveProfile(userObj.uid, {name, photoURL});
      alert('Saved!');
      closeProfile();
    });

    document.getElementById('close-profile').addEventListener('click', closeProfile);
    function closeProfile(){ document.body.removeChild(modalRoot); }
  }

  // Initialize App
  Auth.onAuthStateChanged(user=>{
    if(user) showUsers();
    else showSignin();
  });

  return {openChatWith, openProfile};
})();
