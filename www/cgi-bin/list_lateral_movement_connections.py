#! /usr/bin/python
import sys, json, cgi
sys.path.append("../")
sys.path.append("../../")
print("Content Type: text/json\n")
import analyzer
form = cgi.FieldStorage()
if "csvname" in form:
    if "srcportcoli" in form:
        if "dstportcoli" in form:
            session = analyzer.AnalysisSession('csvs/' + form.getvalue('csvname').strip(), srcportcolumni=int(form.getvalue('srcportcoli').strip()), dstportcolumni=int(form.getvalue('dstportcoli').strip()))
            result = session.get_connections_by_potential_lateral_movement()
            try:
                data = result["success"]
                if len(data) > 0:
                    print json.dumps(result)
                else:
                    print json.dumps({"error": "No lateral movement found."})

            except KeyError:
                print json.dumps(result)
        else:
            print json.dumps({"error": "missing dstipcoli"})
else:
    print json.dumps({"error": "missing csvname"})
