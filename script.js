
const uploadFormNode = document.getElementById("upload-form");

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
            console.log("Successful");
        }
        else if(response.status === 400){
            console.log("The file was not uploaded");
        }else{
            console.log("An error occured");
        }
    })
});