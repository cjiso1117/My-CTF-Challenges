<?php
if (isset($_GET['chapter'])) {
    if (preg_match('/[\(\) ;\n\t\r`\.#\\\'"?]|flag/', $_GET['chapter'])) {
        die('bad hacker');
    }
    system("bash -c 'cat chapter{" . $_GET['chapter'] . "}.txt'");
} else {
    highlight_file(__FILE__);
}
