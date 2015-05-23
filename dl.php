<?php
    $basedirectory = './.uploads/' . str_replace(".", "", $_SERVER['QUERY_STRING']) . "/files/";
    $h = opendir($basedirectory); //Open the current directory
    while (false !== ($entry = readdir($h))) 
    {
        if($entry != '.' && $entry != '..' && is_file($basedirectory . $entry))//Skips over . and .. and directories
        { 
            header("Content-Type: application/force-download");
            header('Content-Disposition: attachment; filename="'.$entry.'"');
            readfile($basedirectory . $entry);            
            break; //Exit the loop so no more files are read
        }
    }
    header("HTTP/1.0 404 Not Found");
?>