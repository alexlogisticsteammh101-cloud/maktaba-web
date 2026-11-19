const savedBooks = localStorage.getItem("maktaba-books");
const books = savedBooks ? JSON.parse(savedBooks) : [
  {title:"الفيل الأزرق",author:"أحمد مراد",category:"روايات",year:2012,copies:4,color:["#23445e","#537493"]},
  {title:"أسرار العقل",author:"نور حمدي",category:"تطوير ذات",year:2024,copies:3,color:["#a65d3d","#d49a72"]},
  {title:"الكون في سطر",author:"د. سامي الغريب",category:"علمية",year:2023,copies:5,color:["#315a51","#718d75"]},
  {title:"رياض الصالحين",author:"الإمام النووي",category:"دينية",year:2025,copies:8,color:["#9a7a40","#c6ad72"]},
  {title:"غابة الحوريات",author:"ليلى ناصر",category:"روايات",year:2025,copies:2,color:["#56506f","#9588a8"]},
  {title:"قوة العادات",author:"د. خالد المطيري",category:"تطوير ذات",year:2022,copies:6,color:["#6b5042","#aa8068"]}
];

const savedLoans=localStorage.getItem("maktaba-loans");
const loans=savedLoans ? JSON.parse(savedLoans) : [
  {member:"سارة محمود",initial:"س",book:"الفيل الأزرق",borrow:"15 نوفمبر 2026",due:"29 نوفمبر 2026",status:"نشطة"},
  {member:"يوسف أحمد",initial:"ي",book:"قوة العادات",borrow:"10 نوفمبر 2026",due:"24 نوفمبر 2026",status:"متأخر"},
  {member:"مريم خالد",initial:"م",book:"الكون في سطر",borrow:"18 نوفمبر 2026",due:"2 ديسمبر 2026",status:"نشطة"},
  {member:"نور إبراهيم",initial:"ن",book:"رياض الصالحين",borrow:"7 نوفمبر 2026",due:"21 نوفمبر 2026",status:"تم الإرجاع"}
];

const savedMembers=localStorage.getItem("maktaba-members");
const members=savedMembers ? JSON.parse(savedMembers) : [
  {name:"سارة محمود",initial:"س",email:"sara@example.com",borrowed:3,returned:18},
  {name:"يوسف أحمد",initial:"ي",email:"youssef@example.com",borrowed:2,returned:12},
  {name:"مريم خالد",initial:"م",email:"maryam@example.com",borrowed:1,returned:24},
  {name:"نور إبراهيم",initial:"ن",email:"noor@example.com",borrowed:4,returned:31}
];

function bookCard(book){
  return `<article class="book-card"><div class="book-cover"><div class="book-cover-inner" style="--cover-a:${book.color?.[0]||"#3b6657"};--cover-b:${book.color?.[1]||"#86a28c"}"><strong>${book.title}</strong><span>${book.author}</span></div></div><h3>${book.title}</h3><p><i class="status-dot"></i>${book.category} · ${book.copies} نسخ</p></article>`;
}

function renderBooks(list=books){
  document.getElementById("bookGrid").innerHTML=list.slice(0,4).map(bookCard).join("");
  document.getElementById("catalogGrid").innerHTML=list.map(bookCard).join("");
  document.getElementById("totalBooks").textContent=(1284+Math.max(0,books.length-6)).toLocaleString("ar-EG");
}

document.getElementById("activityList").innerHTML=[
  ["س","تمت استعارة","الفيل الأزرق","منذ 8 دقائق"],
  ["م","تم إرجاع","الكون في سطر","منذ 24 دقيقة"],
  ["ن","عضو جديد","انضم إلى المكتبة","منذ ساعة"],
  ["ي","متأخر التسليم","قوة العادات","منذ ساعتين"]
].map(a=>`<div class="activity-item"><div class="activity-avatar">${a[0]}</div><div><strong>${a[1]}</strong><span>${a[2]}</span></div><time>${a[3]}</time></div>`).join("");

function renderLoans(){
  document.getElementById("loansTable").innerHTML=loans.map(l=>`<tr><td><div class="member-cell"><div class="mini-avatar">${l.initial}</div><strong>${l.member}</strong></div></td><td>${l.book}</td><td>${l.borrow}</td><td>${l.due}</td><td><span class="badge ${l.status==="متأخر"?"late":l.status==="نشطة"?"active":"returned"}">${l.status}</span></td><td>⋮</td></tr>`).join("");
}
function renderMembers(){
  document.getElementById("membersGrid").innerHTML=members.map(m=>`<article class="member-card"><div class="avatar">${m.initial}</div><h3>${m.name}</h3><p>${m.email}</p><footer><div><strong>${m.borrowed}</strong><span>مستعار</span></div><div><strong>${m.returned}</strong><span>استعارة سابقة</span></div></footer></article>`).join("");
}
renderLoans();
renderMembers();

function showView(view){
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  document.getElementById(view+"View").classList.add("active");
  document.querySelectorAll(".nav-item[data-view]").forEach(n=>n.classList.toggle("active",n.dataset.view===view));
  document.getElementById("sidebar").classList.remove("open");
}
document.querySelectorAll(".nav-item[data-view]").forEach(button=>button.addEventListener("click",()=>showView(button.dataset.view)));
document.querySelectorAll("[data-view-link]").forEach(button=>button.addEventListener("click",()=>showView(button.dataset.viewLink)));
document.getElementById("menuButton").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));

const modal=document.getElementById("bookModal");
["addBookButton","addBookButton2"].forEach(id=>document.getElementById(id).addEventListener("click",()=>modal.classList.add("open")));
document.querySelectorAll("[data-close-modal]").forEach(button=>button.addEventListener("click",()=>modal.classList.remove("open")));
modal.addEventListener("click",event=>{if(event.target===modal)modal.classList.remove("open")});
document.getElementById("bookForm").addEventListener("submit",event=>{
  event.preventDefault();
  const data=Object.fromEntries(new FormData(event.currentTarget));
  books.unshift({title:data.title,author:data.author,category:data.category,year:Number(data.year),copies:Number(data.copies),color:["#315a51","#718d75"]});
  localStorage.setItem("maktaba-books",JSON.stringify(books));
  renderBooks();event.currentTarget.reset();modal.classList.remove("open");showToast("تمت إضافة الكتاب بنجاح");
});

document.getElementById("filterPills").addEventListener("click",event=>{
  if(event.target.tagName!=="BUTTON")return;
  document.querySelectorAll("#filterPills button").forEach(b=>b.classList.remove("active"));event.target.classList.add("active");
  const category=event.target.dataset.category;
  renderBooks(category==="الكل"?books:books.filter(b=>b.category===category));
});
document.getElementById("sortSelect").addEventListener("change",event=>{
  const sorted=[...books].sort((a,b)=>event.target.value==="year"?b.year-a.year:a.title.localeCompare(b.title,"ar"));
  renderBooks(sorted);
});
document.getElementById("globalSearch").addEventListener("input",event=>{
  const query=event.target.value.trim();
  if(!query){renderBooks();return}
  renderBooks(books.filter(b=>`${b.title} ${b.author} ${b.category}`.includes(query)));
  if(!document.getElementById("catalogView").classList.contains("active"))showView("catalog");
});
document.addEventListener("keydown",event=>{if(event.key==="/"&&document.activeElement.tagName!=="INPUT"){event.preventDefault();document.getElementById("globalSearch").focus()}});

document.getElementById("themeToggle").addEventListener("click",()=>{
  document.body.classList.toggle("dark");
  localStorage.setItem("maktaba-theme",document.body.classList.contains("dark")?"dark":"light");
});
if(localStorage.getItem("maktaba-theme")==="dark")document.body.classList.add("dark");

function showToast(message){const toast=document.getElementById("toast");toast.textContent=message;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2200)}

const memberModal=document.getElementById("memberModal");
document.getElementById("addMemberButton").addEventListener("click",()=>memberModal.classList.add("open"));
document.querySelectorAll("[data-close-member]").forEach(button=>button.addEventListener("click",()=>memberModal.classList.remove("open")));
memberModal.addEventListener("click",event=>{if(event.target===memberModal)memberModal.classList.remove("open")});
document.getElementById("memberForm").addEventListener("submit",event=>{
  event.preventDefault();
  const data=Object.fromEntries(new FormData(event.currentTarget));
  const name=data.name.trim();
  const initial=name.charAt(0);
  members.push({name,initial,email:data.email.trim(),borrowed:0,returned:0});
  localStorage.setItem("maktaba-members",JSON.stringify(members));
  renderMembers();
  event.currentTarget.reset();
  memberModal.classList.remove("open");
  showToast("تمت إضافة العضو بنجاح");
});

const loanModal=document.getElementById("loanModal");
function formatDate(value){
  if(!value)return "";
  return new Intl.DateTimeFormat("ar-EG",{day:"numeric",month:"long",year:"numeric"}).format(new Date(`${value}T12:00:00`));
}
function openLoanModal(){
  const memberSelect=document.getElementById("loanMember");
  const bookSelect=document.getElementById("loanBook");
  memberSelect.innerHTML=members.map(member=>`<option value="${member.name}">${member.name}</option>`).join("");
  bookSelect.innerHTML=books.map(book=>`<option value="${book.title}">${book.title}</option>`).join("");
  const today=new Date();
  const due=new Date(today);
  due.setDate(due.getDate()+14);
  document.querySelector("#loanForm [name=borrow]").value=today.toISOString().slice(0,10);
  document.querySelector("#loanForm [name=due]").value=due.toISOString().slice(0,10);
  loanModal.classList.add("open");
}
document.getElementById("newLoanButton").addEventListener("click",openLoanModal);
document.querySelectorAll("[data-close-loan]").forEach(button=>button.addEventListener("click",()=>loanModal.classList.remove("open")));
loanModal.addEventListener("click",event=>{if(event.target===loanModal)loanModal.classList.remove("open")});
document.getElementById("loanForm").addEventListener("submit",event=>{
  event.preventDefault();
  const data=Object.fromEntries(new FormData(event.currentTarget));
  const member=members.find(item=>item.name===data.member);
  loans.unshift({
    member:data.member,
    initial:member?.initial||data.member.charAt(0),
    book:data.book,
    borrow:formatDate(data.borrow),
    due:formatDate(data.due),
    status:"نشطة"
  });
  if(member){member.borrowed=(member.borrowed||0)+1}
  localStorage.setItem("maktaba-loans",JSON.stringify(loans));
  localStorage.setItem("maktaba-members",JSON.stringify(members));
  renderLoans();
  renderMembers();
  event.currentTarget.reset();
  loanModal.classList.remove("open");
  showToast("تم تسجيل الاستعارة بنجاح");
});
renderBooks();

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}
