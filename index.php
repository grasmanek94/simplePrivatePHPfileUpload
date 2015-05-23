<?php
  if (session_status() == PHP_SESSION_NONE) 
  {
      session_start();
  }
  
  if(isset($_POST) && isset($_POST['password']) && $_POST['password'] === "fileuploader@1")
  {
      $_SESSION["loggedin"] = true;
  }
  
  if($_SESSION["loggedin"] == true)
  {
    echo('<html><head><meta charset="utf-8"/><title>Upload</title><link href="http://fonts.googleapis.com/css?family=PT+Sans+Narrow:400,700" rel="stylesheet" /><link href="style.css" rel="stylesheet" />  <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script><script src="script.js"></script></head><body><div id="drop"><a href="javascript:document.getElementById('); echo("'files-upload'"); echo(').click(); ">Drop Here (Max 32MB)</a><input id="files-upload" type="file" name="files-upload" multiple /></div><textarea id="alllinks" name="alllinks" style="width: 100%; height: 64px;" readonly></textarea><ul id="file-list"></ul></body></html>');
  }
  else
  {
    echo('<html><head><meta charset="utf-8"/><title>Upload</title></head><body><form name="login" action="/" method="POST"><div align="center"><input id="password" name="password" type="password" style="width=100%"></div></form></body></html>');  
  }
?>
