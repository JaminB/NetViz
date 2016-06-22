__author__ = 'HKEFF7'

def list_files_in_directory(directory, include_hidden=False, sort_by_creation_date=False):
	from os import listdir
	from os.path import isfile, join, getmtime
	files = [f for f in listdir(str(directory))]
	filteredFiles = []
	if include_hidden == False:
		for f in files:
			if f[0] != '.':
				filteredFiles.append(f)
	else:
		filteredFiles = files
	if sort_by_creation_date:
		filteredFiles.sort(key=lambda f: getmtime(str(directory) + f), reverse=False)
	return filteredFiles

class AnalysisSession():
    def __init__(self, csv_file_location, srcipcolumni=None, dstipcolumni=None, srcportcolumni=None, dstportcolumni=None, sizecolumni=None):
        self.csv_as_list = self.parse_csv(csv_file_location)
        self.srcipcolumni = srcipcolumni
        self.dstipcolumni = dstipcolumni
        self.srcportcolumni = srcportcolumni
        self.dstportcolumni = dstportcolumni
        self.sizecolumni = sizecolumni

    def parse_csv(self, location):
        import csv
        importedRows = []
        try:
            with open(location, "rb") as f:
                reader = csv.reader(f)
                for row in reader:
                   importedRows.append(row)
            return importedRows
        except IOError:
            return None

    def get_csv_as_list(self, headers=False, data=False):
        if data and headers:
            return self.csv_as_list
        elif headers:
            return self.csv_as_list[0]
        else:
            return self.csv_as_list[1: len(self.csv_as_list)]

    def get_unique_ips(self, type="source"):
        uniqueIPs = set()
        if type.lower() == "src" or type == "source":
            index = self.srcipcolumni
        else:
            index = self.dstipcolumni
        if index != None:
            for row in self.get_csv_as_list(headers=False, data=True):
                uniqueIPs.add(row[index])
            return {"success": uniqueIPs}
        return {"error": type + " column never specified"}


    def get_top_talkers(self, type="source", sorton="total_bytes_sent"):
        if type.lower() == "src" or type == "source":
            index = self.srcipcolumni
        else:
            index = self.dstipcolumni
        unique = self.get_unique_ips(type=type)
        try:
            unique = unique["success"]
        except KeyError:
            return {"error": unique["error"]}
        if self.sizecolumni != None:

            topTalkers = []
            for uip in unique:
                size = 0
                count = 0
                topTalker = {}
                for row in self.get_csv_as_list(headers=False, data=True):
                    if row[index] == uip:
                        count+=1
                        try:
                            size+=int(row[self.sizecolumni])
                        except ValueError:
                            return {"error": "size column must be an integer"}
                topTalker.update({
                    "type": type,
                    "ip": uip,
                    "occurrences": count,
                    "total_bytes_sent": size
                })
                topTalkers.append(topTalker)
            if sorton == "total_bytes_sent":
                topTalkers = sorted(topTalkers, key=lambda k: k['total_bytes_sent'], reverse=True)
            else:
                topTalkers = sorted(topTalkers, key=lambda k: k['occurrences'], reverse=True)
            return {"success": topTalkers}
        else:
            return {"error": "size column index never specified"}

    def get_potential_lateral_movement_connections(self):
        LATERAL_MOVEMENT_PORTS = ['139', '445', '3389']
        lateralMovementRows = []
        if self.srcportcolumni != None and self.dstportcolumni != None:
            for row in self.get_csv_as_list(data=True):
                if row[self.srcportcolumni] in LATERAL_MOVEMENT_PORTS or row[self.dstportcolumni] in LATERAL_MOVEMENT_PORTS:
                    lateralMovementRows.append(row)
            return {"success": lateralMovementRows}
        else:
            return {"error": "source and/or destination port column indices never specified"}

    def get_connections_by_ports(self, port, label):
        rows = []
        if self.srcportcolumni != None and self.dstportcolumni != None:
                for row in self.get_csv_as_list(data=True):
                    if row[self.srcportcolumni] == port or row[self.dstportcolumni] == port:
                        rows.append(row)
                return {"success": (label, rows)}
        else:
            return {"error": "source and/or destination port column indices never specified"}


