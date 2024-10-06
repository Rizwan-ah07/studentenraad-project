// Event listener to populate the modal with the selected user's data
document.querySelectorAll('.edit-user-btn').forEach(button => {
    button.addEventListener('click', function () {
        // Get the user data from the button's data attributes
        const username = this.getAttribute('data-username');
        const email = this.getAttribute('data-email');
        const role = this.getAttribute('data-role');
        const userId = this.getAttribute('data-id');

        // Populate the modal fields
        document.getElementById('username').value = username;
        document.getElementById('email').value = email;
        document.getElementById('role').value = role;
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Attach event listener to all delete buttons
    const deleteButtons = document.querySelectorAll(".delete-user-btn");

    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const username = button.getAttribute("data-username");

            // Update modal content with user info
            document.getElementById("delete-username").textContent = username;
            document.getElementById("deleteUserModalLabel").textContent = `Delete the user - ${username}?`;
            document.getElementById("delete-user-username").value = username;
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Attach event listener to all delete buttons
    const deleteButtons = document.querySelectorAll(".delete-post-btn");

    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const postId = button.getAttribute("data-post-id");
            const postAuthor = button.getAttribute("data-post-author");

            // Update modal content with user info
            document.getElementById("delete-post-id").value = postId;
            document.getElementById("deletePostModalLabel").textContent = `Delete the post from ${postAuthor}?`;
        });
    });
});

document.querySelectorAll('.view-post-btn').forEach(button => {
    const postTitle = button.getAttribute('data-post-title');
    const postMessage = button.getAttribute('data-post-message');
    const postUpdated = button.getAttribute('data-post-updated');

    // Format the date in European format (DD-MM-YYYY)
    const date = new Date(postUpdated);
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;

    button.addEventListener('click', () => {
        document.getElementById('view-post-title').textContent = `Post: ${postTitle}`;
        document.getElementById('view-post-message').innerHTML = `${postMessage}<br><br>`;
        document.getElementById('view-post-updated').textContent = `Last updated: ${formattedDate}`;
    });
});


const editUserForm = document.getElementById('editUserForm');

editUserForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;

    const response = await fetch(`/admin/edit-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, role })
    });

    if (response.ok) {
        window.location.reload();
    } else {
        alert('Failed to update user');
    }
});

const deleteUserForm = document.getElementById('deleteUserForm');

deleteUserForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('delete-username').textContent;

    const response = await fetch(`/admin/delete-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    });

    if (response.ok) {
        window.location.reload();
    } else {
        alert('Failed to delete user');
    }
});

const deletePostForm = document.getElementById('deletePostForm');

deletePostForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const postId = document.getElementById('delete-post-id').value;

    const response = await fetch(`/admin/delete-post`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId })
    });

    if (response.ok) {
        window.location.reload();
    } else {
        alert('Failed to delete post');
    }
});