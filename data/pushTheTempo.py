#!/usr/bin/env python
from __future__ import print_function

import csv
import elasticsearch
from elasticsearch import Elasticsearch


ELASTIC_HOST = 'localhost'
ELASTIC_INDEX = 'barbora'
ELASTIC_DOC_TYPE = 'product'


def rebuild_index(filename):
    es = Elasticsearch([ELASTIC_HOST])
    # Drop existing index
    try:
        response = es.indices.delete(ELASTIC_INDEX)
        if response['acknowledged'] is not True:
            raise Exception
    except elasticsearch.exceptions.NotFoundError:
        pass

    # Create index
    response = es.indices.create(
        ELASTIC_INDEX,
        body={
            'settings': {
                "analysis": {
                    "analyzer": {
                        "my_analyzer": {
                            "tokenizer": "standard",
                            "filter": [
                                "standard",
                                "lowercase",
                                "my_length",
                                "my_stemmer"
                            ]
                        }
                    },
                    "filter": {
                        "my_stemmer": {
                            "type": "stemmer",
                            "name": "lithuanian"
                        },
                        "my_length": {
                            "type": "length",
                            "min": 3
                        }
                    }
                }
            },
            'mappings': {
                "product":{
                    "properties":{
                        "name": {
                            "type":"text",
                            "analyzer":"my_analyzer"
                        },
                        "category3": {
                            "type":"text",
                            "analyzer":"my_analyzer"
                        },
                        "category1": {
                            "type":"text",
                            "analyzer":"my_analyzer"
                        },
                        "category2": {
                            "type":"text",
                            "analyzer":"my_analyzer"
                        },
                        "item_brand": {
                            "type":"text",
                            "analyzer":"my_analyzer"
                        }
                    }
                }
            }
        }  
    )
    PRODUCT_ATTRIBUTES = ['id', 'name', 'price', 'unit', 'price_per_unit', 'item_netto_weight', 'category3', 'url', 'category1', 'category2', 'item_brand']

    i = 0
    with open(filename, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            doc = {};
            for attr_name in PRODUCT_ATTRIBUTES:
                doc[attr_name] = row[attr_name];
            res = es.index(index=ELASTIC_INDEX, doc_type=ELASTIC_DOC_TYPE, id=i, body=doc)
            i += 1
            if (res['created'] == False):
                print(doc)


if __name__ == '__main__':
    rebuild_index('barbora.csv')
