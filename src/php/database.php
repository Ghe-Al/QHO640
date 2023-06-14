<?php
class Database
{
    private $server_name = 'localhost';
    private $database_username = 'root';
    private $database_password = '';
    private $database_name = 'calendar_app';
    private $connection = null;

    public function register($user)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'INSERT INTO users (`username`, `password`, `email`, `type`) VALUES (?,?,?,?)'
        );
        $sql->bind_param(
            'sssi',
            $user['username'],
            $user['password'],
            $user['email'],
            $user['type']
        );
        if ($sql->execute()) {
            $id = $this->connection->insert_id;
            $sql->close();
            $this->connection->close();
            return $id;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function appoint($event)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        $sql = $this->connection->prepare(
            'INSERT INTO events (`responsible`, `name`, `hallnumber`, `type`, `comments`, `date`) VALUES (?,?,?,?,?,?)'
        );
        $sql->bind_param(
            'ssisss',
            $event['username'],
            $event['eventName'],
            $event['hallNumber'],
            $event['eventType'],
            $event['comments'],
            $event['date']
        );
        if ($sql->execute()) {
            $id = $this->connection->insert_id;
            $sql->close();
            $this->connection->close();
            return $id;
        } 
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function loginUser($email, $password)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT * FROM `users` WHERE email=? AND password=?'
        );
        $sql->bind_param('ss', $email, $password);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $sql->close();
            $this->connection->close();
            return $user;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function getUserByUsernameOrEmail($username)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT DISTINCT * FROM `users` WHERE username=? OR email=?'
        );
        $sql->bind_param('ss', $username, $username);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            $sql->close();
            $this->connection->close();
            return $user;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function getEventByDate($date)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'SELECT DISTINCT * FROM `events` WHERE date=?'
        );
        $sql->bind_param('s', $date);
        $sql->execute();
        $result = $sql->get_result();
        if ($result->num_rows > 0) {
            $event = $result->fetch_assoc();
            $sql->close();
            $this->connection->close();
            return $event;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }

    public function updateUser($user)
    {
        $this->connection = new mysqli(
            $this->server_name,
            $this->database_username,
            $this->database_password,
            $this->database_name
        );
        $this->connection->set_charset('utf8');
        $sql = $this->connection->prepare(
            'UPDATE `users` SET `username`=?,`password`=?,`email`=?,`type`=? WHERE id=?'
        );
        $sql->bind_param(
            'sssii',
            $user['username'],
            $user['password'],
            $user['email'],
            $user['type'],
            $user['id']
        );
        if ($sql->execute()) {
            $sql->close();
            $this->connection->close();
            return true;
        }
        $sql->close();
        $this->connection->close();
        return false;
    }
}