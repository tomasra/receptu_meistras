#!/usr/bin/env python
import csv
import json

from fuzzywuzzy import fuzz
from fuzzywuzzy import process

from flask import Flask, request, jsonify
app = Flask(__name__)


PRODUCT_ATTRIBUTES = ['name', 'price', 'unit', 'price_per_unit', 'item_netto_weight', 'category3', 'url']
EXCLUDE_CATEGORIES = ['Kūdikių ir vaikų prekės', 'Kosmetika ir higiena', 'Namų ūkio ir gyvūnų prekės']


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

def match_products(ingredients, limit=5):
    products = read_products('../data/barbora_20160603.csv')
    all_matches = []
    # for ingredient, amount in ingredients:
    for ingr_dict in ingredients:
        ingredient = ingr_dict['ingredient']
        amount = ingr_dict['amount']
        # general_name = ingr_dict['general_name'].replace('-', ' ')

        product_ratios = []
        for product in products:
            name_ratio = fuzz.partial_ratio(ingredient, product['name'])
            cat3_ratio = fuzz.partial_ratio(ingredient, product['category3'])
            # gen_name_ratio = fuzz.partial_ratio(general_name, remove_accents(product['name']).lower())
            product_ratios.append((
                product,
                # [name_ratio, cat3_ratio, gen_name_ratio]
                [name_ratio, cat3_ratio]
            ))
        # Order by sum of ratios
        ingr_matches = sorted(product_ratios, key=lambda p: sum(p[1]), reverse=True)[:limit]
        ingr_products = [match[0] for match in ingr_matches]
        # all_matches.append((ingredient, ingr_products))
        all_matches.append({
            'ingredient': ingredient,
            'amount': amount,
            'products': ingr_products,
        })
    # 2-tuple list: (ingredient_name, [matched_products])
    return all_matches

@app.route('/match', methods=['POST'])
def match():
    ingredients = [item for item in request.json['ingredients']]
    matches = match_products(ingredients)
    return jsonify(matches)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False)
