#! /usr/bin/python
import cgi, json, os

def sanitize_filename(filename):
        import re
        if len(filename) > 20:
                return re.sub(r'[^\w=]', '', filename[0:20]) + ".csv"
        else:

                return re.sub(r'[^\w=]', '', filename.replace('.csv','')) + '.csv'

print "Content Type: text/json\n"
form = cgi.FieldStorage()
postdata = form['myfile']
filename = sanitize_filename(str(postdata.filename))
filedata = postdata.file.read()
filesize = len(filedata)
if os.environ['REQUEST_METHOD'] == 'POST':
        try:
            f = open("../csvs/" + filename, "w")
            f.write(filedata)
            f.close()
            print json.dumps({
                "files": {
                    "name": filename,
                    "size": filesize,
                }
            })
        except IOError:
            f = open("csvs/" + filename, "w")
            f.write(filedata)
            f.close()
            print json.dumps({
                "files": {
                    "name": filename,
                    "size": filesize,
                }
            })
        except:
            print json.dumps({
                "files": {
                    "name": filename,
                    "size": filesize,
                    "error": "Internal Error. Check to make sure 'CSVs' directory is readable."
                }
            })
else:
    print json.dumps({
                "files": {
                    "name": filename,
                    "size": filesize,
                    "error": "Invalid REQUEST_METHOD."
                }
            })