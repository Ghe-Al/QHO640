<?php
include './database.php';
include './jwt.php';

$action = $argv[1];

$bearer_token = get_bearer_token();
$is_jwt_valid = isset($bearer_token) ? is_jwt_valid($bearer_token) : false;

$database = new Database();

if ($action === 'register') {
    $rest_json = str_replace("'", "\"", $argv[2]);
    $_POST = json_decode($rest_json, true);
    $user = [
        'username' => $_POST['username'],
        'password' => md5($_POST['password']),
        'email' => $_POST['email'],
        'type' => 0,
    ];

    if ($user_id = $database->register($user)) {
        $user['id'] = $user_id;
        $headers = ['alg' => 'HS256', 'typ' => 'JWT'];
        $payload = ['user' => $user];
        $jwt = generate_jwt($headers, $payload);
        return_json(['status' => $jwt]);
    }
} elseif ($action === 'login') {
    $rest_json = str_replace("'", "\"", $argv[2]);
    $_POST = json_decode($rest_json, true);

    if (
        $user = $database->loginUser(
            $_POST['email'],
            md5($_POST['password'])
        )
    ) {
        $headers = ['alg' => 'HS256', 'typ' => 'JWT'];
        $payload = ['user' => $user];
        $jwt = generate_jwt($headers, $payload);
        return_json(['status' => $jwt]);
    }
} elseif ($action === 'user') {
    if ($is_jwt_valid) {
        $username = getPayload($bearer_token)->user->username;
        if ($user = $database->getUserByUsernameOrEmail($username)) {
            return_json(['status' => $user]);
        }
    }
} elseif ($action === 'update') {
    $rest_json = str_replace("'", "\"", $argv[2]);
    $_POST = json_decode($rest_json, true);

    if ($user = $database->getUserByUsernameOrEmail($_POST['username'])) {
        $user['username'] = $_POST['username'];
        $user['password'] = md5($_POST['password']);
        $user['email'] = $_POST['email'];
        if ($database->updateUser($user)) {
            $headers = ['alg' => 'HS256', 'typ' => 'JWT'];
            $payload = ['user' => $user];
            $jwt = generate_jwt($headers, $payload);
            return_json(['status' => $jwt]);
        }
    }
} elseif ($action === 'appoint') {
    $rest_json = str_replace("'", "\"", $argv[2]);
    $_POST = json_decode($rest_json, true);

    $event = [
        'username' => str_replace("%20", " ", $_POST['username']),
        'eventName' => str_replace("%20", " ", $_POST['eventName']),
        'hallNumber' => str_replace("%20", " ", $_POST['hallNumber']),
        'eventType' => str_replace("%20", " ", $_POST['eventType']),
        'comments' => str_replace("%20", " ", $_POST['comments']),
        'date' => str_replace("%20", " ", $_POST['date']),
    ];

    if ($database->appoint($event)) {
        $headers = ['alg' => 'HS256', 'typ' => 'JWT'];
        $payload = ['event' => $event];
        $jwt = generate_jwt($headers, $payload);
        return_json(['status' => $jwt]);
    }
} elseif ($action === 'event') {
    $rest_json = str_replace("'", "\"", $argv[2]);
    $_POST = json_decode($rest_json, true);

    if ($event = $database->getEventByDate(str_replace("%20", " ", $_POST['date']))) {
        return_json(['status' => $event]);
    }
}

return_json(['status' => 0]);

function return_json($arr)
{
    if(!headers_sent()) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: *');
        header('Content-Type: application/json; charset=utf-8');
    }
    echo json_encode($arr);
    exit();
}