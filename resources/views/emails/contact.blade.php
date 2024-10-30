<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 90%;
            max-width: 600px;
            margin: auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .info {
            margin: 10px 0;
            padding: 10px;
            border: 1px solid #e4e4e4;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        .footer {
            text-align: center;
            font-size: 0.9em;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Contact Details</h1>
        <div class="info">
            <strong>Name:</strong> {{ $firstname }} {{ $lastname }}<br>
            <strong>Phone:</strong> {{ $mobile }}<br>
            <strong>Email:</strong> {{ $email }}<br>
            <strong>Company:</strong> {{ $company }}<br>
            <strong>Job Title:</strong> {{ $jobtitle }}<br>
        </div>
        <h2>Message</h2>
        <p>{{ $content }}</p>
        <div class="footer">
            &copy; {{ date('Y') }} Your Company Name
        </div>
    </div>
</body>
</html>
