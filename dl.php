<?php
    $basedirectory = './.uploads/' . str_replace(".", "", $_SERVER['QUERY_STRING']) . "/files/";
    $h = opendir($basedirectory); //Open the current directory
    if(file_exists($basedirectory))
    {
        while (false !== ($entry = readdir($h))) 
        {
            if($entry != '.' && $entry != '..' && is_file($basedirectory . $entry))//Skips over . and .. and directories
            { 
                header('Content-Type: '.mime_content_type($basedirectory . $entry));
                header('Content-Disposition: inline; filename="'.$entry.'"');
                readfile($basedirectory . $entry);            
                exit();
            }
        }
    }
    header("HTTP/1.0 404 Not Found");
?>