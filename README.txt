# NetViz
#### A Very Simple Vizualization Tool for CSV formatted Network Logs
##### Version 0.2
###### Author: Jamin Becker
###### License: GNU GPLv3

NetViz allows you to easily vizualize any CSV formatted network log as long as it contains the following columns:

  - Source IP
  - Destination IP
  - Source Port
  - Destination Port
  - Bytes Sent / Received


### Installation/Usage
#### Prerequisites
* Python 2.7 (tested)

#### On Windows
* Unzip the archive
* Inside the newly extracted folder add the CSV formatted network logs you wish to analyze into www/csvs
* Navigate back to the top-level directory and double click start.py (You may be prompted to add a firewall rules, this is needed to start a local webserver on port 8000
* Navigate to http://localhost:8000

#### On Linux
* Navigate to a non-root directory such as /home/your-username/ (will not work in root owned directories)
* git clone https://github.com/JaminB/NetViz.git
* Inside the newly extracted folder add the CSV formatted network logs you wish to analyze into www/csvs
* Navigate back to the top-level directory ./start.py
* Navigate to http://localhost:8000
