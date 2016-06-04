#!/usr/bin/env python
import csv
import json

from fuzzywuzzy import fuzz
from fuzzywuzzy import process

from flask import Flask, request, jsonify
app = Flask(__name__)


PRODUCT_ATTRIBUTES = ['name', 'price', 'unit', 'price_per_unit', 'item_netto_weight', 'category3']


def read_products(path):
    products = []
    with open(path) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            product = {}
            for attr in PRODUCT_ATTRIBUTES:
                product[attr] = row[attr]
            products.append(product)
    return products

def match_products(ingredients, limit=5):
    products = read_products('../data/barbora_20160603.csv')
    all_matches = []
    for ingredient in ingredients:
        product_ratios = []
        for product in products:
            name_ratio = fuzz.partial_ratio(ingredient, product['name'])
            cat3_ratio = fuzz.partial_ratio(ingredient, product['category3'])
            product_ratios.append((
                product,
                [name_ratio, cat3_ratio]
            ))
        # Order by sum of ratios
        ingr_matches = sorted(product_ratios, key=lambda p: sum(p[1]), reverse=True)[:limit]
        all_matches.append((ingredient, ingr_matches))
    # 2-tuple list: (ingredient_name, [matched_products])
    return all_matches

@app.route('/match', methods=['POST'])
def match():
    ingredients = [item['ingredient'] for item in request.json['ingredients']]
    matches = match_products(ingredients)
    return jsonify(matches)

if __name__ == "__main__":
    # match_products('Druska')
    # import ipdb; ipdb.set_trace()
    # pass
    app.run(host='0.0.0.0', debug=True)
