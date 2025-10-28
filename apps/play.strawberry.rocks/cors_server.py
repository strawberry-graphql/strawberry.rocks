#!/usr/bin/env python3
"""Simple HTTP server with CORS enabled for local testing."""

import http.server
import socketserver

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

if __name__ == '__main__':
    PORT = 8001
    with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
        print(f"Serving at http://localhost:{PORT} with CORS enabled")
        httpd.serve_forever()
