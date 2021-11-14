let urlpar = new URLSearchParams(window.location.search);
let userId = urlpar.get('id');
let fetchURL='https://jsonplaceholder.typicode.com';
let userName = urlpar.get('name');
let postsbox = document.getElementById('posts');
document.getElementById('username').innerHTML = userName.toUpperCase();
collectingUserPosts();
//fetching Method
function dataFetching(controllers,data){
    return fetch(fetchURL+controllers,data);
}

async function collectingUserPosts() {
    await dataFetching(`/posts?userId=${userId}`,{method:'GET'})
    .then((res) => res.json())
    .then((res) => setuser(res))
    .catch((e)=>{console.log('Posts Error-',e)});
}

async function setuser(posts) {
    // console.log(posts)
   
    for (let i of posts) {
        // console.log(i);
        postsbox.innerHTML += `
    <label class='cardLabel-${i.id}' >
         <input type="checkbox" style="display: none;" class='cardCheck' disabled> 
        <div id="p${i.id}" class="mainCard">
            <div class="card"  >

                <div class="tick">
                    <div class="cardCircle circle">
                        <i class="check fas fa-check-circle"></i>
                    </div>
                    <div class='options'>
                    <i class="opt nopt fas fa-edit edit" tool-tip='top' tool-tip-text='edit'></i>
                    <i class="opt edopt far fa-save save" tool-tip='top' tool-tip-text='save'></i>
                    <i class="opt nopt trash fas fa-trash-alt" tool-tip='top' tool-tip-text='delete'></i>
                    <i class="opt edopt fas fa-times unsave" tool-tip='top' tool-tip-text="unsave"></i>
                    </div>
                </div>
                <div class="title-body">
                    <h2 class="title">${i.title}</h2>
                    <h3 class='body'>${i.body}</h3>
                </div>
            </div>
        
            <div class="commentSection">
                <div class="commentdrop">
                    <h3>Comments</h3>
                    <i class="fas fa-angle-double-down CommentArrow" tool-tip='top' tool-tip-text='see comments'></i>
                </div>
                <div class="comments">

                </div>

            </div>
        </div>
    <label>
        `
    }
    //multiselect Event
    let postsCount = (function(){
       let pc=posts.length;
        return function(k){
            pc-=k;
            console.log(pc);
            return pc;
        }
    })();
    let selectedPosts = [];
    let cardCheck = document.querySelectorAll('.cardCheck');
    let multiDeleteButton = document.querySelector('.deleteAll');

    multiSelectMode(multiDeleteButton,cardCheck,selectedPosts);

    //MultiSelectingPosts Event
    multiSelectCardsEvent(multiDeleteButton,selectedPosts,cardCheck);

    //multiDelete Event
    multiDeleteButtonEvent(multiDeleteButton,selectedPosts,postsCount,postsbox);


    for (let i of posts) {
        await dataFetching(`/posts/${i.id}/comments`,{method:'GET'})
        .then(res => res.json())
        .then(res => setComments(res, i.id))
        .catch((e)=>{console.log('Comments Error-',e)});
        // console.log(i);
        commentsDisplayEvent(i.id); 
        //Adding Delete Single Delete
        singleDeleteEvent(i.id,postsCount);

        let titleBody = document.querySelector(`#p${i.id} .title-body`);

        //Adding Edit Feature
        editEvent(titleBody,i.id);
        
        //Adding Edit Save Event
        editSaveEvent(titleBody,i.id);

        //Adding Edit UnSave Event
        editUnSaveEvent(titleBody,i.id);

    }//end of Loop

}

function multiSelectMode(multiDeleteButton,cardCheck,selectedPosts){
    document.getElementById('multiSelectMode').addEventListener('change', function () {
        let card = document.querySelectorAll(`.card`);
        let toolTip=this.parentNode.querySelector('i');
        if (this.checked) {
            cardCheck.forEach((e) => {
                e.removeAttribute('disabled');

            })
            this.parentElement.style.color='var(--select-color)'
            toolTip.setAttribute('tool-tip','top');
            toolTip.setAttribute( 'tool-tip-text','off');
            document.querySelectorAll('.trash,.edit').forEach((e) => {
                e.style.visibility = 'hidden';
            })
            card.forEach((e) => {
                e.removeAttribute('tool-tip');
                e.removeAttribute('tool-tip-text');
                e.style.cursor = 'pointer';
            })

        }
        else {
            this.parentElement.style.color='black'
            toolTip.setAttribute('tool-tip','top');
            toolTip.setAttribute( 'tool-tip-text','on');
            multiDeleteButton.style.display = 'none';
            cardCheck.forEach((e) => {
                e.checked = 0;
                selectedPosts.splice(0,selectedPosts.length);
                e.setAttribute('disabled', 'disabled');
            })
            document.querySelectorAll('.trash,.edit').forEach((e) => {
                e.style.visibility = 'visible';
            })
            card.forEach((e) => {
                e.removeAttribute('tool-tip');
                e.removeAttribute('tool-tip-text');
                e.style.cursor = 'context-menu'
            })

        }
    })
}


function multiSelectCardsEvent(multiDeleteButton,selectedPosts,cardCheck){
    
    cardCheck.forEach((e) => {
        e.addEventListener('change', () => {
            let Postcard = e.parentNode;
            let card = Postcard.querySelector('.card');
            if (e.checked) {
                selectedPosts.push(Postcard);
                console.log(selectedPosts);
                multiDeleteButton.style.display = 'block';
                card.setAttribute('tool-tip-text', 'UnSelect');
            }
            else {
                if (selectedPosts.length == 1)
                    multiDeleteButton.style.display = 'none';

                selectedPosts.forEach((element, i) => {
                    if (Postcard == element) {
                        selectedPosts.splice(i, 1)
                    }
                })
                card.setAttribute('tool-tip-text', 'Select');
            }
        })
    })
}

function multiDeleteButtonEvent(multiDeleteButton,selectedPosts,postsCount,postsbox){
    multiDeleteButton.addEventListener('click', function () {
        console.log(selectedPosts);
        if (confirm('Deleting Selected Posts')) {
            let card=document.querySelectorAll('.mainCard')
            selectedPosts.forEach((e) => {
                e.remove();
                //let pc=postsCount();
                let pCount=postsCount(1);
                if(pCount==0 || pCount==1){
                    postsbox.querySelector('.multiDelete').style.display = 'none';
                    postsbox.querySelector('.multiDelete').checked=0;
                    document.querySelectorAll('.cardCheck').forEach((e) => {
                        
                        e.setAttribute('disabled', 'disabled');
                    })
                    document.querySelectorAll('.trash,.edit').forEach((e) => {
                        e.style.visibility = 'visible';
                    })
                    card.forEach((e) => {
                        e.removeAttribute('tool-tip');
                        e.removeAttribute('tool-tip-text');
                        e.style.cursor = 'context-menu'
                    })
                }
                if (pCount == 0) {
                    //console.log('No posts')
                    // postsbox.querySelector('.multiDelete').style.display = 'none';

                    let k = document.createElement('h2');
                    postsbox.append(k);
                    k.innerHTML = 'No Posts Yet';
                    k.style.textAlign = 'center'
                }
                
            })
            selectedPosts.splice(0,selectedPosts.length);
            multiDeleteButton.style.display = 'none';
        }
    })
}
function commentsDisplayEvent(id){
    let CommentArrow = document.querySelector(`#p${id} .CommentArrow`);
        CommentArrow.addEventListener('click', function () {
            // console.log(document.querySelector(`#p${i.id} .comments`));
            if (CommentArrow.className == 'fas fa-angle-double-down CommentArrow') {
                document.querySelector(`#p${id} .comments`).style.display = 'flex';
                CommentArrow.className = 'fas fa-angle-double-up CommentArrow';
                CommentArrow.setAttribute('tool-tip-text', 'Hide comments')
            }
            else {
                document.querySelector(`#p${id} .comments`).style.display = 'none';
                CommentArrow.className = 'fas fa-angle-double-down CommentArrow';
                CommentArrow.setAttribute('tool-tip-text', 'see comments')
            }

        })
        document.querySelector(`#p${id} .commentdrop`).addEventListener('click', function (e) {
            e.preventDefault();
            //console.log(e.eventPhase);
        })
}

function singleDeleteEvent(id,postsCount){
    let singleDelete = document.querySelector(`#p${id} .trash`);
        singleDelete.addEventListener('click', function (e) {
            //console.log(e.eventPhase)
            e.preventDefault();
            let title = document.querySelector(`#p${id} .title`).innerHTML;
            if (window.confirm(`Do you want to delete the post-[` + title.toUpperCase() + `]`)) {
                document.querySelector(`#p${id}`).parentNode.style.display = 'none';
               // postsCount--;
               let pCount=postsCount(1);
               if(pCount==0 || pCount==1){
                postsbox.querySelector('.multiDelete').style.display = 'none';
               }
                if (pCount == 0) {
                    //console.log('No posts')
                    let k = document.createElement('h2');
                    postsbox.append(k);
                    k.innerHTML = 'No Posts Yet';
                    k.style.textAlign = 'center'
                }
            
                //console.log('yes', postsCount)
            }
        })
}

function editEvent(titleBody,id){
    let edit = document.querySelector(`#p${id} .edit`);
        edit.addEventListener('click', function () {
            document.querySelectorAll(`#p${id} .nopt`).forEach((e) => { e.style.display = 'none' })
            document.querySelectorAll(`#p${id} .edopt`).forEach((e) => { e.style.display = 'block' })
            let titleDuplicate = document.createElement('textarea');
            titleDuplicate.innerHTML = titleBody.querySelector('.title').innerHTML;
            titleDuplicate.className = 'titleEdit'
            titleBody.querySelector('.title').replaceWith(titleDuplicate);
            let bodyDuplicate = document.createElement('textarea');
            bodyDuplicate.innerHTML = titleBody.querySelector('.body').innerHTML;
            bodyDuplicate.className = 'bodyEdit'
            titleBody.querySelector('.body').replaceWith(bodyDuplicate);
            // console.log(titleBody.querySelectorAll(`.titleEdit,.bodyEdit`))
            // titleBody.querySelectorAll('.titleEdit,.bodyEdit').forEach((e)=>{   
            //     e.addEventListener('change',(event)=>{
            //         console.log(e.value);
            //         console.log('hi')
            //     })
            // })

        })
}

function editSaveEvent(titleBody,id){
    let editSave = document.querySelector(`#p${id} .save`);
        editSave.addEventListener('click', () => {
            let te = titleBody.querySelector('.titleEdit').value;
            let be = titleBody.querySelector('.bodyEdit').value
            if (!te) {
                alert('Post Title Cannot be Empty');
                titleBody.querySelector('.titleEdit').focus();
            }
            else if (!be) {
                alert('Post Body Cannot be Empty');
                titleBody.querySelector('.bodyEdit').focus()
            }
            else {
                document.querySelectorAll(`#p${id} .nopt`).forEach((e) => { e.style.display = 'block' })
                document.querySelectorAll(`#p${id} .edopt`).forEach((e) => { e.style.display = 'none' })

                let titleMain = document.createElement('h2');
                titleMain.innerHTML = titleBody.querySelector('.titleEdit').value;
                titleMain.className = 'title'
                titleBody.querySelector('.titleEdit').replaceWith(titleMain);
                let bodyMain = document.createElement('h3');
                bodyMain.innerHTML = titleBody.querySelector('.bodyEdit').value;
                bodyMain.className = 'body'
                titleBody.querySelector('.bodyEdit').replaceWith(bodyMain);
            }
        })
}

function editUnSaveEvent(titleBody,id){
    let editUnsave = document.querySelector(`#p${id} .unsave`);
        editUnsave.addEventListener('click', () => {
            document.querySelectorAll(`#p${id} .nopt`).forEach((e) => { e.style.display = 'block' })
            document.querySelectorAll(`#p${id} .edopt`).forEach((e) => { e.style.display = 'none' })

            let titleMain = document.createElement('h2');
            titleMain.innerHTML = titleBody.querySelector('.titleEdit').innerHTML;
            titleMain.className = 'title'
            titleBody.querySelector('.titleEdit').replaceWith(titleMain);
            let bodyMain = document.createElement('h3');
            bodyMain.innerHTML = titleBody.querySelector('.bodyEdit').innerHTML;
            bodyMain.className = 'body'
            titleBody.querySelector('.bodyEdit').replaceWith(bodyMain);
        })
}
function setComments(comments, pid) {
    let commentsbox = document.querySelector('#p' + pid + ' .comments');
    let k = 0;
    for (let i of comments) {
        // console.log(i);
        k++;
        if (k > 3) break;
        commentsbox.innerHTML += `<div class='cm comment-${i.id}'>
    <div><img src="./useri.jpg"><span>${i.name}</span></div>
    <h3>${i.body}</h3>
    <h4>${i.email}</h4>
    </div>`
        // console.log(document.querySelector(`.comments`));
    }

}




