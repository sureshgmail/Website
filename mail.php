<?php
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method Not Allowed'
    ]);
    exit;
}

function sanitize($data)
{
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

$name    = isset($_POST['name'])    ? sanitize($_POST['name'])    : "";
$email   = isset($_POST['email'])   ? sanitize($_POST['email'])   : "";
$organization   = isset($_POST['organization'])   ? sanitize($_POST['organization'])   : "";


$message = isset($_POST['message']) && !empty($_POST['message']) ? sanitize($_POST['message']) : "-";

$errors = [];

if (empty($name)) {
    $errors['name'] = "Name is required.";
} elseif (strlen($name) < 2) {
    $errors['name'] = "Name must be at least 2 characters.";
}

if (empty($email)) {
    $errors['email'] = "Email is required.";
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = "Invalid email format.";
}

if (empty($organization)) {
    $errors['organization'] = "organization number is required.";
}


if (!empty($errors)) {
    echo json_encode([
        'status' => 'error',
        'errors' => $errors,
        'message' => "There was a validation error. Please check your input."
    ]);
    exit;
}




$body = '<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">

    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <title>KernelTeck</title>
    </head>


    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px;" leftmargin="0">
    <table cellpadding="40"
        style="width:600px; background-color: #f2f4f6; margin: 0 auto; border-collapse: collapse;  font-family: "Helvetica", Arial, sans-serif;">
        <tr>
            <td style="width: 600px;">
                <table style="width: 600px; border-collapse: collapse;">
                    <tr style="height: 3rem;">
                        <td colspan="3" style="width: 300px;"></td>
                        <td align="right">
                            <img width="100" height="100" src="https://devdews.com/beta/kernelteck/web/final/v2/assets/images/fav-icon.png" alt="logo">
                        </td>
                    </tr>
                    <tr>
                        <td align="left" cellpadding="0" colspan="4" style="width: 600px;">
                            <h1
                                style="font-weight: bold;font-family: "Helvetica", Arial, sans-serif;font-size: 32px; line-height: 24px;">
                                Hello,</h1>
                            <p
                                style="font-weight: 500; color: gray; font-family: "Helvetica", Arial, sans-serif;font-size: 14px; ">
                                You
                                have received new form submission in website.
                            </p>
                            <p
                                style="font-weight: 500; color: gray; font-family: "Helvetica", Arial, sans-serif; font-size: 14px;">
                                Please find the below details,
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="4" style="height: 8px;"></td>
                    </tr>
                    <tr>
                        <td colspan="2" style="width: 300px; padding-right: 30px;">
                        <p align="right"
                                            style="font-weight: 500; color: gray; font-family: "Helvetica", Arial, sans-serif;font-size: 15px;">
                                            Name</p>
                                <p align="right"
                                    style="font-weight: 500; color: gray; font-family: "Helvetica", Arial, sans-serif;font-size: 15px;">
                                    Email</p>
                                <p align="right"
                                        style="font-weight: 500; color: gray; font-family: "Helvetica", Arial, sans-serif;font-size: 15px;">
                                        Organization</p>
                                
                                <p align="right"
                                style="font-weight: 500; color: gray; font-family: "Helvetica", Arial, sans-serif;font-size: 15px;">
                                Message</p>
                                </td>
                                <td colspan="2" style="width: 300px;">
                                <p style="font-family: "Helvetica", Arial, sans-serif;font-size: 15px;">' . $name . '</p>
                                <p style="font-family: "Helvetica", Arial, sans-serif;font-size: 15px;">' . $email . '</p>
                                <p style="font-family: "Helvetica", Arial, sans-serif;font-size: 15px;">' . $organization . '</p>
                                <p style="font-family: "Helvetica", Arial, sans-serif;font-size: 15px;">' . $message . '</p>
                        </td>

                    </tr>
                </table>
            </td>
        </tr>
    </table>
    </body>
    </html>';

try {


    $mail = new PHPMailer(true);

    $mail->SMTPDebug = 0;
    $mail->isSMTP();
    $mail->Host = 'mail.devdews.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'sendmail@devdews.com';
    $mail->Password = 'Wpk&lMV&0sW*';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 26;


    $mail->setFrom('info@devdews.com', 'KernelTeck');

    $mail->addAddress('connect@kernelteck.com');

    $mail->addBCC('ramesh@techdew.com');
    //  $mail->addBCC('ramesh1@techdew.com');
    // $mail->addBCC('ramesh2@techdew.com');
    // $mail->addBCC('ramesh3@techdew.com');

    $mail->isHTML(true);
    $mail->Subject = 'New Form Submission - KernelTeck';
    $mail->Body    = $body;


    $mail->send();

    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Form submitted successfully.'
    ]);
    exit;
} catch (Exception $e) {
    http_response_code(200);
    echo json_encode([
        'status' => 'error',
        'message' => 'Mail sending failed.',
        'details' => $e->getMessage()
    ]);
    exit;
}
