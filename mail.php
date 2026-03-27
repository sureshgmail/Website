<?php
// Error logging function - MUST be first before any calls to it
function logError($message, $debugOutput = '') {
    $logFile = __DIR__ . '/mail_errors.log';
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[{$timestamp}] {$message}";
    if ($debugOutput) {
        $logMessage .= "\nDEBUG OUTPUT:\n{$debugOutput}";
    }
    $logMessage .= "\n" . str_repeat('-', 80) . "\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

logError('=== MAIL.PHP EXECUTION STARTED ===');

require 'vendor/autoload.php';
logError('✓ Vendor autoload.php included successfully');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

logError('✓ PHPMailer classes imported');

// CORS headers to allow cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
logError('✓ Headers set successfully');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    logError('✓ Preflight OPTIONS request handled');
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    logError('✗ Invalid REQUEST_METHOD: ' . $_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method Not Allowed'
    ]);
    exit;
}

logError('✓ POST request received');
logError('POST DATA: ' . json_encode($_POST));

function sanitize($data)
{
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

$name    = isset($_POST['name'])    ? sanitize($_POST['name'])    : "";
$email   = isset($_POST['email'])   ? sanitize($_POST['email'])   : "";
$organization   = isset($_POST['organization'])   ? sanitize($_POST['organization'])   : "";
logError('✓ Form fields extracted: name=' . $name . ', email=' . $email . ', org=' . $organization);

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
    logError('✗ Validation failed: ' . json_encode($errors));
    echo json_encode([
        'status' => 'error',
        'errors' => $errors,
        'message' => "There was a validation error. Please check your input."
    ]);
    exit;
}

logError('✓ Form validation passed');




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

logError('✓ Email body HTML created successfully');

try {
    logError('✓ Starting try block - about to initialize PHPMailer');
    ob_start(); // Capture SMTP debug output
    logError('✓ Output buffering started');

    $mail = new PHPMailer(true);
    logError('✓ PHPMailer instance created');

    $mail->SMTPDebug = 2;
    logError('✓ SMTPDebug set to 2');
    $mail->isSMTP();
    logError('✓ SMTP mode enabled');
    
    // Google Workspace SMTP Configuration
    $mail->Host = 'smtp.gmail.com';
    logError('✓ SMTP Host set: smtp.gmail.com');
    $mail->SMTPAuth = true;
    logError('✓ SMTP Auth enabled');
    $mail->Username = 'your-email@yourcompany.com';  // Replace with your Google Workspace email
    $mail->Password = 'your-google-workspace-password';  // Your regular Google Workspace password (enable "Less secure app access" first)
    logError('✓ SMTP credentials configured (username: ' . substr($mail->Username, 0, 5) . '...)');
    $mail->SMTPSecure = 'tls';
    logError('✓ SMTPSecure set to TLS');
    $mail->Port = 587;
    logError('✓ SMTP Port set to 587');

    $mail->setFrom('your-email@yourcompany.com', 'KernelTeck');  // Replace with your Google Workspace email
    logError('✓ From address set');

    $mail->addAddress('connect@kernelteck.com');
    logError('✓ Recipient address added: connect@kernelteck.com');

    $mail->addBCC('ramesh@techdew.com');
    logError('✓ BCC address added');
    //  $mail->addBCC('ramesh1@techdew.com');
    // $mail->addBCC('ramesh2@techdew.com');
    // $mail->addBCC('ramesh3@techdew.com');

    $mail->isHTML(true);
    logError('✓ HTML mode enabled');
    $mail->Subject = 'New Form Submission - KernelTeck';
    logError('✓ Subject set');
    $mail->Body    = $body;
    logError('✓ Email body set');

    logError('✓ About to call $mail->send()...');
    $mail->send();
    logError('✓✓✓ EMAIL SENT SUCCESSFULLY ✓✓✓');

    ob_end_clean(); // Clear debug output on success
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Form submitted successfully.'
    ]);
    logError('✓ Success response sent to client');
    exit;
} catch (Exception $e) {
    logError('✗✗✗ EXCEPTION CAUGHT ✗✗✗');
    $debugOutput = ob_get_clean(); // Capture debug output on error
    
    // Log error to file
    logError(
        "Mail sending failed: " . $e->getMessage() . "\nForm Data: Name={$name}, Email={$email}, Organization={$organization}",
        $debugOutput
    );
    logError('✗ Error details logged and response sent to client');
    
    http_response_code(200);
    echo json_encode([
        'status' => 'error',
        'message' => 'Mail sending failed.',
        'details' => $e->getMessage(),
        'debug' => $debugOutput // Include SMTP debug info for troubleshooting
    ]);
    exit;
}

logError('=== MAIL.PHP EXECUTION COMPLETED ===');
