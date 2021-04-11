dropFile.ondragover = dropFile.ondragenter = function(evt) {
    evt.preventDefault();
};
  
dropFile.ondrop = function(evt) {
    fileInput.files = evt.dataTransfer.files;

    const dT = new DataTransfer();
    dT.items.add(evt.dataTransfer.files[0]);
    fileInput.files = dT.files;

    evt.preventDefault();
};