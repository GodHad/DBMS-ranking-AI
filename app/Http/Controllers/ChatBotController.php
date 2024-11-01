<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class ChatBotController extends Controller
{
    public function index(Request $request)
    {
        $message = $request->input('message');
        if (!$message || $message === '') return response()->json(['answer' => 'Kidding me? Please submit valid message.']);

        $apiKey = env('OPENAI_API_KEY');
        $client = new Client();
        $messages = [
            [
                'role' => 'system', 
                'content' => 'You are a helpful assistant that provides concise answers only about database management systems. If asked about other topics, say about your role.'
            ],
            [
                'role' => 'user', 
                'content' => $message,
            ]
        ];

        try {
            $response = $client->post('https://api.openai.com/v1/chat/completions', [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Authorization' => "Bearer {$apiKey}",
                ],
                'json' => [
                    'model' => 'gpt-4o-mini',
                    'messages' => $messages,
                    'max_tokens' => 1000,
                ],
            ]);

            $data = json_decode($response->getBody(), true);
            $botMessage = $data['choices'][0]['message']['content'] ?? '';

            return response()->json(['answer' => $botMessage]);
        } catch (RequestException $e) {
            return response()->json([
                'error' => 'An error occurred while communicating with the OpenAI API.',
                'message' => $e->getMessage(),
            ], 500);
        }

        return response()->json(['answer' => 'Hello? How can I assist you today?']);
    }
}
