let usersbox = document.getElementById("usersTable");
let fetchURL='https://jsonplaceholder.typicode.com';

function dataFetching(controllers,data){
    return fetch(fetchURL+controllers,data);
}

async function sendingUsers() {
    
    let res = await dataFetching('/users',{method:'GET'})
    let users = await res.json()
    .then((res) => usrEdit(res))
    .catch((e)=>{
        console.log('Users Error-',e);
    });
    console.log(users);

}
sendingUsers();
function usrEdit(users) {
    console.log(users);
    let userList = [];
    for (let i of users) {
        userList.push(i.id);
        let phone = i.phone.split(" ");
        //onclick="onClickUser(${i.id},'${i.name}')"
        usersbox.innerHTML += `<tr id="${i.id}" onclick="onClickUser(${i.id},'${i.name}')">   
            <td>${i.name}</td>
            <td> ${i.email} </td>
            <td>${phone[0]}</td>
            <td>${i.website}</td>
            <td>${i.company.name}</td>
            </tr>`
        console.log(i);
    }
    return userList;
}

function onClickUser(id,name){
        window.location.href=`./posts.html?id=${id}&name=${name}`;    
}