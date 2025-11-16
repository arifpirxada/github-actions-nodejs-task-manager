// Display or not display signup or logout navlink, on the bases of user login

const switchLog = (isLogged) => {
    const sign = document.querySelector(".signNav")
    const logout = document.querySelector(".logoutNav")
    if (isLogged === "yes") {
        sign.style.display = "none"
        logout.style.display = "block"
    } else {
        logout.style.display = "none"
        sign.style.display = "block"
    }
}

switchLog("no")

// Domain variable

const myTasker = "https://mytasker.cyclic.app/"

// Request for Signup

const signup = async ( btn ) => {
    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const pass = document.getElementById("pass").value
    const cpass = document.getElementById("cpass").value
    const alert = document.getElementById("alertMessage")

    if (name === "" || email === "" || pass === "" || cpass === "") {
        alert.innerHTML = "Please fill all the fields!"
    } else if (pass != cpass) {
        alert.innerHTML = "Passwords do not match!"
    } else {
        btn.innerHTML = '<span class="spinner-border text-warning spinner-border" role="status" aria-hidden="true"></span>'

        const userData = {
            name: name,
            email: email,
            pass: pass,
            cpass: cpass
        }
        const jsonData = JSON.stringify(userData)
        const response = await fetch(`${myTasker}signup`, {
            method: "POST",
            body: jsonData,
            headers: {
                "Content-type": "application/json"
            }
        })
        const data = await response.json()
        btn.innerHTML = 'Register'

        if (data.message === "Insertion successful") {
            alert.innerHTML = "success!"
            window.location.href = "/"
        } else {
            alert.innerHTML = data.message
        }
    }
}

// Request for Login

const userLogin = async ( btn ) => {
    const email = document.getElementById("your_email").value
    const pass = document.getElementById("your_pass").value
    const inform = document.getElementById("inform")

    if (email === "" || pass === "") {
        inform.innerHTML = "Please fill all the fields!"
    } else {
        btn.innerHTML = '<span class="spinner-border text-warning spinner-border" role="status" aria-hidden="true"></span>'

        const logData = {
            email: email,
            pass: pass,
        }
        const jsonlogData = JSON.stringify(logData)
        const res = await fetch(`${myTasker}login`, {
            method: "POST",
            body: jsonlogData,
            headers: {
                "Content-type": "application/json"
            }
        })
        const resData = await res.json()
        btn.innerHTML = 'Log in'

        if (resData.message === "Login success") {
            inform.innerHTML = "success!"
            window.location.href = "/"
        } else {
            inform.innerHTML = resData.message
        }
    }
}

// Function to set _id for editing Task

const changeId = (id, title, desc, taskNum) => {
    document.getElementById("taskId").value = id
    document.getElementById("updateTitle").value = title
    document.getElementById("updateDesc").value = desc
    document.getElementById("taskBtn").value = taskNum
}

// Request for Task Addition
if (document.getElementById("taskTitle")) {
    var num = 0
}
const operTask = async (action, e) => {

    const taskContainer = document.getElementById("accordionExample")
    const fetchSpinner = document.getElementById("fetch-spinner")

    if (action === "fetch") {
        // Fetch Tasks
        fetchSpinner.classList.remove("d-none")
        const userFetchData = {
            action: action
        }
        const jsonFetchData = JSON.stringify(userFetchData)
        const resp = await fetch(myTasker, {
            method: "POST",
            body: jsonFetchData,
            headers: {
                "Content-type": "application/json"
            }
        })
        const resFetchData = await resp.json()
        fetchSpinner.classList.add("d-none")

        if (resFetchData.message === "notLogged") {
            switchLog("no")
        } else {
            switchLog("yes")
        }

        if (resFetchData.message !== "noData" && resFetchData.message !== "notLogged") {
            document.getElementById("noData").remove()
            document.getElementById("defaultAccordion").remove()

            resFetchData.forEach(element => {
                taskContainer.insertAdjacentHTML("beforeend",
                    `<div><div class="accordion-item">
            <h2 class="accordion-header">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#${num}" aria-expanded="false" aria-controls="${num}">
                    ${num + 1}.&nbsp;&nbsp;${element.taskTitle}
                </button>
            </h2>
            <div id="${num}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    ${element.taskDesc}
                </div>
            </div>
        </div>
        <button onclick="operEdit('${element._id}', this)" class="btn btn-danger up-btn">Delete</button>
        <button onclick="changeId('${element._id}','${element.taskTitle}', '${element.taskDesc}', ${num})" class="btn btn-primary up-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button></div>`
                )
                num++
            });

        }
    } else {
        // Add Tasks
        var title = document.getElementById("taskTitle")
        var desc = document.getElementById("taskDesc")
        const taskAlert = document.getElementById("taskAlert")

        if (title.value === "" || desc.value === "") {
            taskAlert.innerHTML = "Please fill all the fields!"
        } else {

            e.target.innerHTML = '<span class="spinner-border text-primary spinner-border" role="status" aria-hidden="true"></span>'
            const userTaskData = {
                action: action,
                title: title.value,
                desc: desc.value
            }
            const jsonTaskData = JSON.stringify(userTaskData)
            const reaction = await fetch(myTasker, {
                method: "POST",
                body: jsonTaskData,
                headers: {
                    "Content-type": "application/json"
                }
            })
            const resTaskData = await reaction.json()

            e.target.innerHTML = 'Add Task'
            if (resTaskData.message === "Insertion successful") {
                window.location.href = window.location.href
                title.value = ""
                desc.value = ""
                if (document.getElementById("noData")) {
                    document.getElementById("noData").remove()
                    document.getElementById("defaultAccordion").remove()
                }
            } else if (resTaskData.message === "notLogged") {
                window.location.href = "/login"
            } else {
                taskAlert.innerHTML = resTaskData.message
            }
        }
    }
}

operTask("fetch")

// Function to Update a Task

const operEdit = async (action, btn = "none") => {

    if (action === "edit") {

        btn.innerHTML = '<span class="spinner-border text-primary spinner-border" role="status" aria-hidden="true"></span>'
        const upTaskId = document.getElementById("taskId").value
        const upTitle = document.getElementById("updateTitle").value
        const upDesc = document.getElementById("updateDesc").value
        let taskNumber = document.getElementById("taskBtn").value
        const editAlert = document.getElementById("editTaskAlert")

        const editData = {
            id: upTaskId,
            taskTitle: upTitle,
            taskDesc: upDesc
        }
        const jsonEditData = JSON.stringify(editData)

        const res = await fetch(myTasker, {
            method: "PATCH",
            body: jsonEditData,
            headers: {
                "Content-type": "application/json"
            }
        })
        const upTaskData = await res.json()
        btn.innerHTML = 'Update'
        document.getElementById("close-modal").click()

        editAlert.innerHTML = upTaskData.message
        taskNumber = parseInt(taskNumber)

        if (upTaskData.message === "Updation successful") {
            document.getElementById(taskNumber).parentElement.children[0].children[0].innerHTML = `${taskNumber + 1}.&nbsp;&nbsp;${upTitle}`
            document.getElementById(taskNumber).children[0].innerHTML = upDesc
        }
    } else {
        btn.innerHTML = '<span class="spinner-border text-warning spinner-border-sm" role="status" aria-hidden="true"></span>'
        const delData = {
            id: action
        }
        const jsonDelData = JSON.stringify(delData)

        const res = await fetch(myTasker, {
            method: "DELETE",
            body: jsonDelData,
            headers: {
                "Content-type": "application/json"
            }
        })
        const delTaskData = await res.json()
        btn.innerHTML = 'Delete'

        if (delTaskData.message !== "Internal server error") {
            btn.parentElement.style.display = "none"
        }
    }
}