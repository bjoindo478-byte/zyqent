const message=document.getElementById('message');
document.getElementById('login').addEventListener('click',()=>message.textContent='Login belum aktif. Backend autentikasi perlu diselesaikan dan diuji.');
document.getElementById('register').addEventListener('click',()=>message.textContent='Pendaftaran belum aktif. Jangan menerima akun publik sebelum sistem keamanan siap.');
