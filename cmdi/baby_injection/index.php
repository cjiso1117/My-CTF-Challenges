<?php

if (isset($_GET['file'])) {
    if (!preg_match('/[\$;\n`\.&|<>]|flag/', $_GET['file'])) {
        $file = $_GET['file'];
        $dst = uniqid() . $file;
        system("cp /tmp/$file $dst");
        echo "Your file /$dst";
    } else {
        die('bad hacker');
    }
} else {
    highlight_file(__FILE__);
}
