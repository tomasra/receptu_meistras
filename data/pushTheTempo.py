import csv
from datetime import datetime
from elasticsearch import Elasticsearch

HOST_NAME = "localhost"
FILE_NAME = 'barbora_20160603.csv'
es = Elasticsearch([HOST_NAME])

PRODUCT_ATTRIBUTES = ['id', 'name', 'price', 'unit', 'price_per_unit', 'item_netto_weight', 'category3', 'url', 'category1', 'category2', 'item_brand']
i = 0
with open(FILE_NAME)as csvfile:
     reader = csv.DictReader(csvfile)
     for row in reader:
         doc = {};
         for attr_name in PRODUCT_ATTRIBUTES:
             doc[attr_name] = row[attr_name];
         res = es.index(index="barbora", doc_type='product', id=i, body=doc)
         #print(doc)
         print i
         i = i + 1
         if (res['created'] == False):
            #print res

            print doc
            #print row
