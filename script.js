function onready() {
  var filesUpload = document.getElementById("files-upload"),
		dropArea = document.getElementById("drop"),
		fileList = document.getElementById("file-list"),
		links = document.getElementById("alllinks");
		
	function uploadFile (file) {
		var li = document.createElement("li"),
			div = document.createElement("div"),
			img,
			progressBarContainer = document.createElement("div"),
			progressBar = document.createElement("div"),
			reader,
			xhr,
			fileInfo;
			
		li.appendChild(div);
		
		progressBarContainer.className = "progress-bar-container";
		progressBar.className = "progress-bar";
		progressBarContainer.appendChild(progressBar);
		li.appendChild(progressBarContainer);
		
		// Uploading - for Firefox, Google Chrome and Safari
		xhr = new XMLHttpRequest();
	
		
		// Present file info and append it to the list of files
		fileInfo = "<strong>" + file.name + " (" + parseInt(file.size / 1024, 10) + " KB)</strong>";
		progressBar.innerHTML = fileInfo;
		progressBar.style.width = "0%";
		
		// Update progress bar
		xhr.upload.addEventListener("progress", function (evt) {
			if (evt.lengthComputable) 
			{
				progressBar.style.width = (evt.loaded / evt.total) * 100 + "%";
			}
			else 
			{
				// No data to calculate on
			}
		}, false);
		
		// File uploaded
		xhr.addEventListener("load", function () 
		{
			progressBarContainer.className += " uploaded";
			progressBar.innerHTML = xhr.responseText;
			var href = xhr.responseText.match(/href="([^"]*)/)[1];		
			links.innerHTML += href + "\r\n";
			links.scrollTop = links.scrollHeight;
		}, false);

		xhr.open("POST", "upload.php", true);
		
		// Set appropriate headers
		//xhr.setRequestHeader("Content-Type", "multipart/form-data");
		//xhr.setRequestHeader("X-File-Name", file.name);
		//xhr.setRequestHeader("X-File-Size", file.size);
		//xhr.setRequestHeader("X-File-Type", file.type);

	  	var fd = new FormData();
	  	fd.append("files-upload", file);

		// Send the file (doh)
		xhr.send(fd);
		
		fileList.appendChild(li);
	}
	
	function traverseFiles (files) {
		if (typeof files !== "undefined") {
			for (var i=0, l=files.length; i<l; i++) {
				uploadFile(files[i]);
			}
		}
		else {
			fileList.innerHTML = "No support for the File API in this web browser";
		}	
	}
	
	filesUpload.addEventListener("change", function () {
		traverseFiles(this.files);
	}, false);
	
	dropArea.addEventListener("dragleave", function (evt) {
		var target = evt.target;
		
		if (target && target === dropArea) {
			this.className = "";
		}
		evt.preventDefault();
		evt.stopPropagation();
	}, false);
	
	dropArea.addEventListener("dragenter", function (evt) {
		this.className = "over";
		evt.preventDefault();
		evt.stopPropagation();
	}, false);
	
	dropArea.addEventListener("dragover", function (evt) {
		evt.preventDefault();
		evt.stopPropagation();
	}, false);
	
	dropArea.addEventListener("drop", function (evt) {
		traverseFiles(evt.dataTransfer.files);
		this.className = "";
		evt.preventDefault();
		evt.stopPropagation();
	}, false);										
};
document.addEventListener('ready', onready);
