function onready() {
  var filesUpload = document.getElementById("files-upload"),
		dropArea = document.getElementById("drop"),
		fileList = document.getElementById("file-list");
		
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
		
		/*
			If the file is an image and the web browser supports FileReader,
			present a preview in the file list
		*/
		if (typeof FileReader !== "undefined" && (/image/i).test(file.type)) {
			img = document.createElement("img");
			li.appendChild(img);
			reader = new FileReader();
			reader.onload = (function (theImg) {
				return function (evt) {
					theImg.src = evt.target.result;
				};
			}(img));
			reader.readAsDataURL(file);
		}
		
		// Uploading - for Firefox, Google Chrome and Safari
		xhr = new XMLHttpRequest();
		
		// Update progress bar
		xhr.upload.addEventListener("progress", function (evt) {
			if (evt.lengthComputable) {
				//if(evt.loaded != evt.total)
				//{
					progressBar.style.width = (evt.loaded / evt.total) * 100 + "%";
				//}
				//else
				//{
				//	progressBar.style.width = "0%";
				//}
			}
			else {
				// No data to calculate on
			}
		}, false);
		
		// File uploaded
		xhr.addEventListener("load", function () 
		{
			progressBarContainer.className += " uploaded";
			progressBar.innerHTML = xhr.responseText;
			
		}, false);

		xhr.open("POST", "/upload.php", true);
		
		// Set appropriate headers
		//xhr.setRequestHeader("Content-Type", "multipart/form-data");
		//xhr.setRequestHeader("X-File-Name", file.name);
		//xhr.setRequestHeader("X-File-Size", file.size);
		//xhr.setRequestHeader("X-File-Type", file.type);

	  	var fd = new FormData();
	  	fd.append("files-upload", file);

		// Send the file (doh)
		xhr.send(fd);
		
		// Present file info and append it to the list of files
		fileInfo = "<div><strong>Name:</strong> " + file.name + "</div>";
		fileInfo += "<div><strong>Size:</strong> " + parseInt(file.size / 1024, 10) + " kb</div>";
		div.innerHTML = fileInfo;
		
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