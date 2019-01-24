
window.base.stopF5();
window.base.verifyToken();
let ID = window.base.getUrlParam('code');

document.getElementById('preganent').href = "pregnant.html?code=" + ID;
document.getElementById('news').href = "news.html?code=" + ID;
document.getElementById('hospital_editors').href = "hospital_editors.html?code=" + ID;
document.getElementById('hospital_expert').href = "hospital_expert.html?code=" + ID;
document.getElementById('hospital_pregnancy').href = "hospital_pregnancy.html?code=" + ID;
document.getElementById('hospital_vaccine').href = "hospital_vaccine.html?code=" + ID;
document.getElementById('hospital_examination').href = "hospital_examination.html?code=" + ID;
document.getElementById('video').href = "../video/video.html?code=" + ID;