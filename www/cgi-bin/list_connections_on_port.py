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
            if "port" in form:
                if "label" in form:
                    session = analyzer.AnalysisSession('csvs/' + form.getvalue('csvname').strip(), srcportcolumni=int(form.getvalue('srcportcoli').strip()), dstportcolumni=int(form.getvalue('dstportcoli').strip()))
                    result = session.get_connections_by_port(port=form.getvalue("port"), label=form.getvalue("label"))
                    try:
                        data = result["success"]
                        if len(data) > 0:
                            print json.dumps(result)
                        else:
                            print json.dumps({"error": "No records matching port - " + str(form.getvalue("port")) + " (" + str(form.getvalue("label")) + ")"})

                    except KeyError:
                        print json.dumps(result)
                else:
                    print json.dumps({"error": "missing label"})
            else:
                print json.dumps({"error": "missing port"})

        else:
            print json.dumps({"error": "missing dstipcoli"})
else:
    print json.dumps({"error": "missing csvname"})