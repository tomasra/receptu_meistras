#!/usr/bin/env python
import csv
import json

from fuzzywuzzy import fuzz
from fuzzywuzzy import process

from flask import Flask, request, jsonify
app = Flask(__name__)

import unicodedata
 
def remove_accents(input_str):
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    only_ascii = nfkd_form.encode('ASCII', 'ignore')
    return only_ascii.decode('utf-8')


PRODUCT_ATTRIBUTES = ['name', 'price', 'unit', 'price_per_unit', 'item_netto_weight', 'category3', 'url']
EXCLUDE_CATEGORIES = ['Kūdikių ir vaikų prekės', 'Kosmetika ir higiena', 'Namų ūkio ir gyvūnų prekės']

ELASTIC_URL = 'http://localhost:9200/reciplay/_analyze'


def read_products(path):
    products = []
    with open(path) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['category1'] not in EXCLUDE_CATEGORIES:
                product = {}
                for attr in PRODUCT_ATTRIBUTES:
                    product[attr] = row[attr]
                products.append(product)
    return products

# # Full text search
# from whoosh.fields import Schema, TEXT, ID, STORED
# from whoosh.index import create_in, open_dir
# from whoosh.query import FuzzyTerm
# from whoosh.qparser import QueryParser
# from whoosh import scoring

# # schema = Schema(name=TEXT, id=ID(stored=True))
# schema = Schema(
#     name=TEXT(stored=True),
#     id=ID(stored=True)
# )

# import os

# def build_index():
#     # Create index dir if it does not exists.
#     if not os.path.exists("index"):
#         os.mkdir("index")
#     index = create_in('index', schema)
#     products = read_products('/home/tomas/Dropbox/Git/receptu_meistras/data/barbora.csv')
#     writer = index.writer()
#     for idx, product in enumerate(products):
#         writer.add_document(id=str(idx), name=product['name'])
#     writer.commit()
    

# index = open_dir('index')

# with index.searcher(weighting=scoring.TF_IDF()) as searcher:
#     query = QueryParser('name', index.schema, termclass=FuzzyTerm).parse('Cinamonas')
#     results = searcher.search(query)
#     for result in results:
#         print(result)
#     # result = searcher.search(Term('name', 'Milt'))[0]
# import pdb; pdb.set_trace()


"""
Elastic search
"""
import requests
import json

def elastic_stemmer(text):
    response = requests.get(ELASTIC_URL, {
        'analyzer': 'reciplay_analyzer',
        'text': text })
    response_json = json.loads(response.text)
    words = [
        token['token']
        for token in response_json['tokens']]
    return words

"""
Barbora
"""
def parse_product_title(title):
    result = {}

    # Amount
    amount_pos = title.rfind(', ')
    if amount_pos >= 0:
        result['amount'] = title[amount_pos + 1:].strip()
        title = title[:amount_pos]

    # Fat content (for dairy products)
    fat_content_pos = title.rfind(', ')
    if fat_content_pos >= 0:
        result['fat_content'] = title[fat_content_pos + 1:].strip()
        title = title[:fat_content_pos]

    # Product name and brand name
    name, brand = '', ''
    for word in title.split(' '):
        if word.isupper():
            brand = ' '.join([brand, word])
        else:
            name = ' '.join([name, word])
    if len(name) > 0:
        result['name'] = name
    if len(brand) > 0:
        result['brand'] = brand
        # Name must always exist
        if 'name' not in result:
            result['name'] = brand
    return result


# Run on startup
print('Stemming products...')
products = read_products('/home/tomas/receptu_meistras/data/barbora.csv')
for product in products:
    parsed_title = parse_product_title(product['name'])
    product['stemmed_name'] = elastic_stemmer(parsed_title['name'])
    product['stemmed_category3'] = elastic_stemmer(product['category3'])
print('Stemmed.')


def match_products(ingredients, limit=5):
    all_matches = []
    for ingr_dict in ingredients:
        amount = ingr_dict.get('amount', None)
        ingredient = ingr_dict.get('ingredient', None)
        try:
            stemmed_ingredient = elastic_stemmer(ingredient)
            product_ratios = []
            for product in products:
                # Fuzzy matching
                name_ratio = fuzz.partial_ratio(stemmed_ingredient, product['stemmed_name'])
                cat3_ratio = fuzz.partial_ratio(stemmed_ingredient, product['stemmed_category3'])
                # name_ratio = fuzz.partial_ratio(ingredient, product['name'])
                # cat3_ratio = fuzz.partial_ratio(ingredient, product['category3'])
                # gen_name_ratio = fuzz.partial_ratio(general_name, remove_accents(product['name']).lower())
                product_ratios.append((
                    product,
                    # [name_ratio, cat3_ratio, gen_name_ratio]
                    [name_ratio, cat3_ratio]
                ))
            # Order by sum of ratios
            ingr_matches = sorted(product_ratios, key=lambda p: sum(p[1]), reverse=True)[:limit]
            ingr_products = [match[0] for match in ingr_matches]
        except Exception as exc:
            ingr_products = []
        all_matches.append({
            'ingredient': ingredient,
            'amount': amount,
            'products': ingr_products, })
    # 2-tuple list: (ingredient_name, [matched_products])
    return all_matches

@app.route('/match', methods=['POST'])
def match():
    ingredients = [item for item in request.json['ingredients']]
    matches = match_products(ingredients)
    return jsonify(matches)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False)
