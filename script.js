
const uploadFormNode = document.getElementById("upload-form");
let statusMessage = document.getElementById("status-message");

uploadFormNode.addEventListener("submit", async function(event){
    event.preventDefault();

    const fileInput = document.getElementById("excel-file");
    const file = fileInput.files[0];
    console.log(file);
    const formData = new FormData();
    formData.append("file", file);
    console.log("this is formdata", formData);

    fetch('/upload', {
        method: 'POST',
        body: formData,
    }).then( (response) => {
        if(response.status === 200){
            statusMessage.textContent = "Data successfully uploaded on the Database!";
            statusMessage.classList.add("success");
        }
        else if(response.status === 400){
            statusMessage.textContent = "The file was not uploaded!";
            statusMessage.classList.add("error");
        }else{
            statusMessage.textContent = "An error occured!";
            statusMessage.classList.add("error");
        }
    })
});