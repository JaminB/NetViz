#!/usr/bin/python
import os, BaseHTTPServer, CGIHTTPServer, cgitb

"""Start a Mini HTTP Server to display results"""
def start_mini_http_server():
    cgitb.enable()
    try:
        os.chdir("www/")
        server = BaseHTTPServer.HTTPServer
        handler = CGIHTTPServer.CGIHTTPRequestHandler
        server_address = ("", 8000)
        print ("Successfully started HTTP server. To begin analyzing CSV files add them to the 'csvs' folder. \nView the results at http://localhost:8000/index.html")

        httpd = server(server_address, handler)
        httpd.serve_forever()
    except Exception as e:
        print "Something went terribly wrong. Here's an error message: " + str(e)


start_mini_http_server()




