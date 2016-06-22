#! /usr/bin/python
import sys, json, cgi
sys.path.append("../")
sys.path.append("../../")
print("Content Type: text/json\n")
import analyzer
form = cgi.FieldStorage()
if "csvname" in form:
    if "sizecoli" in form:
        if "srcipcoli" in form:
            if "dstipcoli" in form:
                if "type" in form:
                        session = analyzer.AnalysisSession('csvs/' + form.getvalue('csvname').strip(), srcipcolumni=int(form.getvalue('srcipcoli').strip()), dstipcolumni=int(form.getvalue('dstipcoli').strip()), sizecolumni=int(form.getvalue("sizecoli").strip()))
                        print json.dumps(session.get_top_talkers(type=form.getvalue("type"), sorton="total_bytes_sent"))
                else:
                    print json.dumps({"error": "missing type (src or dst)"})

            else:
                print json.dumps({"error": "missing dstipcoli"})
        else:
            print json.dumps({"error": "missing srcipcoli"})
    else:
        print json.dumps({"error": "missing sizecoli"})


else:
    print json.dumps({"error": "missing csvname"})
