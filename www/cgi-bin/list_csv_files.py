#! /usr/bin/python
import sys, json
sys.path.append("../")
sys.path.append("../../")
print("Content Type: text/json\n")
import analyzer
try:
    print json.dumps({"success": analyzer.list_files_in_directory("csvs")}, indent=3)
except Exception as e:
    print json.dumps({"error": "Something went terribly wrong. Here's an error message: " + str(e)}, indent=3)
