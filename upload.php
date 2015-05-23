<?php
	if (session_status() == PHP_SESSION_NONE) 
	{
		session_start();
	}
	
	set_time_limit(0);
	
	ini_set('max_execution_time', 0);
	ini_set('max_input_time', 0);
	ini_set('memory_limit', '256M');
	ini_set('post_max_size', '256M');
	ini_set('upload_max_filesize', '256M');
	
	function generate_string($num)
	{
		$characters = array(
			'0','1','2', '3', '4', '5', '6', '7', '8', '9', 
			'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
		);
		$sum = $num;
		$base = count($characters);
		$str = "";	
		do
		{
			$str .= $characters[$sum % $base];
			$sum = (int)($sum / $base);
		} while ($sum);
		$str = strrev($str);
		return $str;
	}
	
	function generate_id()
	{
		$filename = "current.id";	

		$rs = @fopen($filename, 'r+');
		flock($rs, LOCK_EX);
		$chread = fread($rs, 8192);
		$maxnumber = intval($chread);
		fseek ($rs, 0);
		fwrite($rs, strval($maxnumber + 1));
		fflush ($rs);
		flock($rs, LOCK_UN);			
		fclose($rs);
		
		$lid = generate_string($maxnumber);

		return $lid;
	}
	
	$errorid = "unknown";
	$filename = "";
	$size = "0 KB";
	$filestring = "<strong>" . $filename . " (" . $size . ")</strong>";
	if($_SESSION['loggedin'] == true)
	{
		if(isset($_FILES['files-upload']))
		{
			$filename = $_FILES['files-upload']['name'];
			$sizecalc = (int)($_FILES['files-upload']['size'] / 1024);
			$size = $sizecalc . " KB";
			$filestring = "<strong>" . $filename . " (" . $size . ")</strong>";
			if($_FILES['files-upload']['error'] == 0)
			{
				if($_FILES['files-upload']['size'] >= 1 && $_FILES['files-upload']['size'] < (64*1024*1024))
				{
					$id = generate_id();
					if(mkdir("./.uploads/" . $id))
					{
						if(mkdir("./.uploads/" . $id . "/files"))
						{
							if(move_uploaded_file($_FILES['files-upload']['tmp_name'], "./.uploads/" . $id . "/files/" . $_FILES['files-upload']['name']))
							{
								@touch("./.uploads/" . $id . "/" . session_id() . ".session");
								@touch("./.uploads/" . $id . "/" . $_SERVER['REMOTE_ADDR'] . ".ip");
								echo('<a href="http://' . $_SERVER[HTTP_HOST] . $id . '">' . $filestring . '</a>');
								exit;
							}
							else
							{
								$errorid = "move operation failed";
							}
						}
						else
						{
							$errorid = "filecontainer creation error";
						}					
					}
					else
					{
						$errorid = "directory($id) creation error";
					}
				}
				else
				{
					$errorid = "invalid file size";
				}		
			}
			else
			{
				$errorid = "files variable error number " . $_FILES['files-upload']['error'];
			}
		}
		else
		{
			$errorid = "no files";
		}
	}
	else
	{
		$errorid = "not logged in";
	}
	
	echo($filestring . "error uploading file: " . $errorid);
	exit;
