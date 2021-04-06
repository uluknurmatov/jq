const API = "http://localhost:8000/posts";
const modal = $("#my_modal");
const modal_inp = $("#my_modal_inp");
const btn = $("#btn_modal_window");
const span = $(".close_modal_window");
let editedId = null;
let searchText = "";
let pageCount = 1;
let page = 1;
renderPost();
$(".add_btn").on("click", function () {
    let newPost = {
        content: $(".inp_post").val(),
    };
    postNew(newPost);
    $(".inp_post").val("");
});
function postNew(newPost) {
    if (!$(".inp_post").val().trim()) {
        alert("Заполните поле");
        $(".inp_post").val("");
        return;
    }
    fetch(API, {
        method: "POST",
        body: JSON.stringify(newPost),
        headers: {
            "Content-Type": "application/json",
        },
    }).then(() => renderPost());
}
function renderPost() {
    fetch(API)
        .then((res) => res.json())
        .then((postData) => {
            $(".posts_list").html("");
            $(".inp_post").val("");
            postData.forEach((item) => {
                $(".posts_list").append(`
                <div  style="list-style-type:none; margin-bottom:20px; border:2px solid #e1e3e6; ;">${item.content}</div>
                <button id=${item.id} class="btn-delete" style="height:25px; background-color: rgb(59, 59, 255); color: white">Удалить</button>
                <button id=${item.id} class="btn-edit" style="height:25px; background-color: rgb(59, 59, 255); color: white">Редактировать</button>
            `);
            });
        });
}
$("body").on("click", ".btn-delete", function (event) {
    let id = event.target.id;
    fetch(`http://localhost:8000/posts/${id}`, {
        method: "DELETE",
    }).then((res) => renderPost());
});
renderPost();
$("body").on("click", ".btn-edit", function (e) {
    editedId = e.target.id;
    fetch(`http://localhost:8000/posts/${editedId}/`)
        .then((res) => res.json())
        .then((postToEdit) => {
            $(".edit-inp").val(postToEdit.posts);
            modal.css("display", "block");
        });
});
$(".btn-save").on("click", function () {
    if (!$(".edit-inp").val().trim()) {
        alert("Заполните поле");
        $(".edit-inp").val("");
        return;
    }
    let editedPost = {
        content: $(".edit-inp").val(),
    };
    fetch(`http://localhost:8000/posts/${editedId}`, {
        method: "PUT",
        body: JSON.stringify(editedPost),
        headers: {
            "Content-Type": "application/json; charset = utf-8",
        },
    }).then(() => {
        renderPost();
        modal.css("display", "none");
    });
});
span.on("click", function () {
    modal.css("display", "none");
});
getPagination();
function getPagination() {
    fetch(`${API}?q=${searchText}`)
        .then((res) => res.json())
        .then((data) => {
            pageCount = Math.ceil(data.length / 5);
            $(".pagination-page").remove();
            for (let i = pageCount; i >= 1; i--) {
                $(".previous-btn").after(`
            <span class="pagination-page">
            <a href="#">${i}</a>
            </span>
            `);
            }
        });
}
$(".search-inp").on("input", function (e) {
    searchText = e.target.value;
    searchText.append();
    console.log(e.target.value);
    // renderPost(searchText);
});
