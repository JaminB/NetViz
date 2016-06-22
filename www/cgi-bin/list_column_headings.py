#! /usr/bin/python
import sys, json, cgi
sys.path.append("../")
sys.path.append("../../")
print("Content Type: text/json\n")
import analyzer
form = cgi.FieldStorage()
if "csvname" in form:
    session = analyzer.AnalysisSession('csvs/' + form.getvalue("csvname"))
    print json.dumps({"success": session.get_csv_as_list(headers=True)}, indent=3)
else:
    print json.dumps({"error": "missing csvname"})
