<?php

require_once "vendor/autoload.php";

use GuzzleHttp\Client;

function respond( $status, $message ) : string {
    return json_encode([
        "status" => $status,
        "message" => $message
    ]);
}

function from( string $name, string $email ) {
    return [ filter_var(trim($email), FILTER_SANITIZE_EMAIL) => filter_var(trim($name), FILTER_SANITIZE_STRING) ];
}

/**
 * @param string $request HTTP METHOD
 * @param array $config [
 *   'methods' => array,
 *   'origin' => string
 * ]
 */
function cors( string $request, array $config ) : void {
    header(sprintf("Access-Control-Allow-Origin: %s", $config['origin'] ));
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
    header('Vary: Origin');

    // Access-Control headers are received during OPTIONS requests
    if ($request == 'OPTIONS') {
        header("Access-Control-Allow-Methods: OPTIONS, POST");
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
        exit(0);
    }
}

function isValidPassword( $entered_password,  $configured_password) : bool {
    return ! strcmp( $entered_password, $configured_password);
}

function isValidUsername( $entered_username, $configured_username ) : bool {
    return ! strcmp( $entered_username, $configured_username );
}

function isValidCaptcha($captcha, $secret, $ip) {
    try {
        $client = new Client([
            'base_uri' => 'https://hcaptcha.com'
        ]);
        $body = "response=$captcha&secret=$secret&remoteip=$ip";

        $response = $client->request("POST", "/siteverify", [
            'headers' => [
                "Content-Type" => "application/x-www-form-urlencoded"
            ],
            'body' => $body
        ]);
        $json = json_decode($response->getBody(), true);
        return $json['success'];
    } catch(GuzzleHttp\Exception\ClientException $e) {
        http_response_code(500);
        echo respond('fail', "Please complete the captcha test above.");
        exit();
    }
}

/**
 * @param array $credentials [
 *   'username' => string
 *   'password' => string
 * ]
 */
function authenticate( array $credentials ) : void {
    extract( $credentials );
    if ( ! isset( $_SERVER['PHP_AUTH_USER'] ) || ! isValidUsername( $_SERVER['PHP_AUTH_USER'], $username ) || ! isValidPassword( $_SERVER['PHP_AUTH_PW'], $password) ) {
        header('WWW-Authenticate: Basic realm="My Realm"');
        header('HTTP/1.0 401 Unauthorized');
        http_response_code(401);
        exit;
    }
}

$request = filter_input(INPUT_SERVER, 'REQUEST_METHOD', FILTER_SANITIZE_ENCODED);
$config = parse_ini_file( "config.ini" );

extract( $config );

cors( $request, $cors );
//authenticate( $credentials );

$post = json_decode(file_get_contents("php://input"), true);
extract($post);

if( ! isValidCaptcha($post['h-captcha-response'], $config['captcha']['secret'], $_SERVER['REMOTE_ADDR'] )) {
    http_response_code(400);
    echo respond('fail', 'Please reload the page and redo the capthca test again.');
    exit();
}

if( empty($name) || empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo respond('fail', 'Missing required parameters.');
    exit();
}

try {
    $transport = ( new Swift_SmtpTransport( $smtp['server'], $smtp['port'], 'ssl' ))
        ->setUsername( $smtp['username'] )
        ->setPassword( $smtp['password'] )
    ;
    $mailer = new Swift_Mailer($transport);

    $mail = (new Swift_Message($subject))
        ->setFrom( from($name, $email) )
        ->setTo( [ $to['email]' => $to['name'] ] )
        ->setBody( filter_var( $message, FILTER_SANITIZE_STRING ) );

    if($mailer->send($mail)) {
        http_response_code(200);
        echo respond('success', "Mail sent");
    } else {
        http_response_code(500);
        echo respond('error', "Unable to send mail");
    }

} catch(Swift_RfcComplianceException $e) {
    http_response_code(400);
    error_log(print_r($e, true));
    echo respond( "fail", "Invalid email address" );
} catch(Swift_TransportException | Exception $e) {
    http_response_code(500);
    error_log(print_r($e, true));
    echo respond( "error", "Our mail servers are unable to send your message at the moment. Please send your message directly to <a href='&#109;&#097;&#105;&#108;&#116;&#111;:&#105;&#110;&#102;&#111;&#064;&#099;&#105;&#110;&#122;&#105;&#097;&#109;&#105;&#108;&#097;&#110;&#105;&#046;&#099;&#111;&#109;'>&#105;&#110;&#102;&#111;&#064;&#099;&#105;&#110;&#122;&#105;&#097;&#109;&#105;&#108;&#097;&#110;&#105;&#046;&#099;&#111;&#109;</a>" );
}

