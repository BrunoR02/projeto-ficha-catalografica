import json
data = "oxsadae"

filename = "./python-scripts/tabela-cutter.json"

def get_list():
  with open("./python-scripts/list-cutter.txt","r") as fp:
    lines = fp.read().splitlines()
    result = {}
    for line in lines:
        key, value = line.split(None, 1)
        result[key.strip()] = value.strip()
    return result
    

def update_json():
  jsonData = []

  with open(filename) as fp:
    jsonData = json.load(fp)

  list = get_list()

  jsonData.update({'Z':list})

  with open(filename, 'w') as json_file:
    json.dump(jsonData, json_file, 
      indent=2,  
      separators=(',',': '))

  # f = open(filename,"w")
  # print(f.read())
  # f.write(data)
  # json.dumps(data,f)
  # f.close()


update_json()