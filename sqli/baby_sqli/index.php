<?php
$servername = "db";
$username = "root";
$password = "example";
$dbname = "myDB";
if (!file_exists('/tmp/once_lock')) {
    $conn = new mysqli($servername, $username, $password);
    $sql = "CREATE DATABASE IF NOT EXISTS myDB;";
    $conn->query($sql);
    $sql = "CREATE TABLE IF NOT EXISTS myDB.users (id INT(6) AUTO_INCREMENT PRIMARY KEY, name varchar(30), password varchar(30));";
    $conn->query($sql);
    $sql = "INSERT INTO myDB.users (name,password) VALUES ('admin','FLAG{1337}');";
    $conn->query($sql);
    system('touch /tmp/once_lock');
}
if (isset($_GET["id"])) {
    if (preg_match('/[namspasswordadminflag ]/', $_GET["id"])) {
        die('bad hacker');
    }
    $conn = new mysqli($servername, $username, $password, $dbname);
    $sql = "SELECT 1,2,3 FROM myDB.users WHERE id=${_GET['id']};";
    echo $sql;
    print_r($conn->query($sql)->fetch_assoc());
} else {
    echo 'GET /?id=';
}
