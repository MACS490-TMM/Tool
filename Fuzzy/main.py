import numpy as np
import pandas as pd
import requests
from flask import Flask

app = Flask(__name__)


def load_data(filepath):
    # Load the CSV file
    dataframe = pd.read_csv(filepath, sep=';', decimal=',', index_col=0)
    print("Original Data:")
    print(dataframe)

    # Convert the DataFrame to a NumPy array
    input_matrix = dataframe.values.astype(float)
    print("Input Matrix:")
    print(input_matrix)

    return input_matrix
  
scale_to_fuzzy = {
        1.00: (1, 1, 1),
        2.00: (1, 2, 3),
        3.00: (2, 3, 4),
        4.00: (3, 4, 5),
        5.00: (4, 5, 6),
        6.00: (5, 6, 7),
        7.00: (6, 7, 8),
        8.00: (7, 8, 9),
        9.00: (9, 9, 9),
        0.50: (1/3, 1/2, 1),    # Reciprocal of 2
        0.33: (1/4, 1/3, 1/2),  # Reciprocal of 3
        0.25: (1/5, 1/4, 1/3),  # Reciprocal of 4
        0.20: (1/6, 1/5, 1/4),  # Approximate reciprocal of 5
        0.17: (1/7, 1/6, 1/5),  # Approximate reciprocal of 6
        0.14: (1/8, 1/7, 1/6),  # Approximate reciprocal of 7
        0.13: (1/9, 1/8, 1/7),  # Approximate reciprocal of 8
        0.11: (1/9, 1/9, 1/9),  # Reciprocal of 9
    }


def fuzzy_geometric_mean(matrix):
    # matrix is expected to be an array of arrays, where each sub-array is a list of triangular fuzzy numbers (tuples)
    geometric_means = []

    # Process each row (criterion) in the matrix
    for row in matrix:
        products = [1, 1, 1]  # Initialize products for X, Y, Z
        n = len(row)  # Number of elements in the row (comparisons for this criterion)

        # Multiply corresponding components of the triangular numbers
        for cell in row:
            products[0] *= cell[0]  # Multiply all the Xs
            products[1] *= cell[1]  # Multiply all the Ys
            products[2] *= cell[2]  # Multiply all the Zs

        # Calculate the nth root for each component
        gm_x = (products[0] ** (1.0 / n)).round(2)
        gm_y = (products[1] ** (1.0 / n)).round(2)
        gm_z = (products[2] ** (1.0 / n)).round(2)

        # Store the geometric mean for this criterion
        geometric_means.append((gm_x, gm_y, gm_z))

    return geometric_means


def fuzzy_weight(geometric_means):
    total = (np.sum(geometric_means, axis=0)).round(2)

    reverse = (1 / total).round(2)

    increasing_order = np.flip(reverse)

    temp = total**-1
    temp = np.flip(temp)

    weights = (geometric_means * temp).round(3)

    return weights


def criteria_weighting_process(input_matrix):
    print("Input Matrix: ")
    print(input_matrix)

    # Convert Saaty scale to fuzzy numbers
    pairwise_matrix = np.array([[scale_to_fuzzy.get(x, (0, 0, 0)) for x in row] for row in input_matrix])

    print("PW matrix: ")
    print(pairwise_matrix)

    geometric_means = fuzzy_geometric_mean(pairwise_matrix)

    print("Geometric Means: ")
    for means in geometric_means:
        print(means)

    weights = fuzzy_weight(geometric_means)

    print("Fuzzy Weights: ")
    for weight in weights:
        print(weight)

    # Sum each row of the weights
    total = np.sum(weights, axis=1)
    print("Total here: " + str(total))

    # defuzzifying the weights
    defuzzified_weights = (total / 3).round(3)
    # Round number up to 3 decimal places
    print("Defuzzified Weights: ")
    print(defuzzified_weights)

    # Normalized:
    normalized_weights = (defuzzified_weights / np.sum(defuzzified_weights)).round(3)
    print("Normalized Weights: ")
    print(normalized_weights)

    # For each criterion in input matrix, add weights to a map of criteria name and weight
    criteria_weights = dict(zip(['A', 'B', 'C', 'D', 'E'], normalized_weights))
    print("Final Criteria Weights: ")
    print(criteria_weights)

    return criteria_weights


def vendor_ranking_process(input_matrix):
    print("Input Vendor Matrix: ")
    print(input_matrix)

    # Convert Saaty scale to fuzzy numbers
    pairwise_matrix = np.array([[scale_to_fuzzy.get(x, (0, 0, 0)) for x in row] for row in input_matrix])

    print("PW Vendor matrix: ")
    print(pairwise_matrix)

    geometric_means = fuzzy_geometric_mean(pairwise_matrix)

    print("Vendor Geometric Means: ")
    for means in geometric_means:
        print(means)

    weights = fuzzy_weight(geometric_means)

    print("Vendor Fuzzy Weights: ")
    for weight in weights:
        print(weight)

    # Sum each row of the weights
    total = np.sum(weights, axis=1)
    print("Total here: " + str(total))

    # defuzzifying the weights
    defuzzified_weights = (total / 3).round(3)
    # Round number up to 3 decimal places
    print("Vendor Defuzzified Weights: ")
    print(defuzzified_weights)

    # Normalized:
    normalized_weights = (defuzzified_weights / np.sum(defuzzified_weights)).round(3)
    print("Vendor Normalized Weights: ")
    print(normalized_weights)

    # Here you need to ensure this dictionary is structured as expected
    vendor_scores = {'Vendor': normalized_weights}
    print("Final Vendor Weights: ")
    print(vendor_scores)

    return vendor_scores


def calculate_final_scores(criteria_weights, vendor_ranking_list):
    # Convert criteria_weights to a DataFrame for easier manipulation
    weights_df = pd.DataFrame([criteria_weights], columns=criteria_weights.keys())
    print("Weights: ")
    print(weights_df)

    # Create a DataFrame to store scores
    scores_data = {}
    for vendor_name, vendor_scores in vendor_ranking_list:
        # Normalize the vendor_scores if not already normalized and convert to DataFrame format
        scores_data[vendor_name] = vendor_scores
    scores_df = pd.DataFrame(scores_data)

    # Calculate the weighted scores
    weighted_scores = scores_df.mul(weights_df.values[0], axis='columns').round(3)  # Multiply scores by weights
    final_scores = weighted_scores.sum(axis=1)  # Sum across criteria for each alternative

    # Creating a DataFrame for final output to maintain vendor association
    final_scores_df = pd.DataFrame(final_scores, columns=['Final Score']).transpose()

    return final_scores_df


def calculate_final_scores2(criteria_weights, vendor_ranking_list):
    # Convert criteria_weights to a DataFrame for easier manipulation
    weights_df = pd.DataFrame([criteria_weights], columns=criteria_weights.keys())
    print("Weights: ")
    print(weights_df)

    # Create a DataFrame to store scores
    scores_data = {}
    for vendor_name, vendor_scores in vendor_ranking_list:
        # Normalize the vendor_scores if not already normalized and convert to DataFrame format
        scores_data[vendor_name] = vendor_scores
    scores_df = pd.DataFrame(scores_data)

    # Calculate the weighted scores
    weighted_scores = scores_df.mul(weights_df.values[0], axis='columns').round(3)  # Multiply scores by weights
    final_scores = weighted_scores.sum(axis=1)  # Sum across criteria for each alternative

    # Creating a DataFrame for final output to maintain vendor association
    final_scores_df = pd.DataFrame(final_scores, columns=['Final Vendor Score']).transpose()

    return final_scores_df


def process_all_data(project_id):
    input_matrix = load_data("val.csv")
    list_of_vendor_files = ["val_vendors.csv", "val_vendors2.csv", "val_vendors3.csv", "val_vendors4.csv",
                            "val_vendors5.csv"]
    list_of_vendors = [load_data(file) for file in list_of_vendor_files]

    criteria_weights = criteria_weighting_process(input_matrix)
    vendor_ranking_list = []

    for index, vendor_matrix in enumerate(list_of_vendors):
        ranking = vendor_ranking_process(vendor_matrix)
        vendor_ranking_list.append(("Vendor " + str(index + 1), ranking['Vendor']))

    data = {
        'C1': [0.063, 0.272, 0.665],
        'C2': [0.425, 0.425, 0.151],
        'C3': [0.629, 0.107, 0.263],
        'C4': [0.149, 0.784, 0.067],
        'C5': [0.629, 0.107, 0.263],
    }

    # Convert data into the specified format:
    temp_ranking = [(f"Vendor {i + 1}", np.array(scores)) for i, scores in enumerate(data.values())]
    print("Temp ranking: ")
    print(temp_ranking)

    # final_scores = calculate_final_scores(criteria_weights, temp_ranking)
    final_scores = calculate_final_scores2(criteria_weights, temp_ranking)

    print("Final Scores for all vendors:")
    print(final_scores)

    print("Final Scores for all vendors:")

    formatted_scores = [
        {
            "projectId": project_id,
            "vendorId": index + 1,
            "score": final_scores.round(3).iloc[0][index]
        }
        for index, score in enumerate(final_scores)
    ]

    # Sort the formatted_scores list in descending order of scores
    sorted_scores = sorted(formatted_scores, key=lambda x: x['score'], reverse=True)

    # Assign ranks based on the sorted position
    for rank, score_dict in enumerate(sorted_scores, start=1):
        score_dict['ranking'] = rank

    print("Formatted Scores with Ranks:")
    print(sorted_scores)

    print("Formatted Scores:")
    print(formatted_scores)

    return formatted_scores


def main():
    app.run(debug=True, port=5000)


def send_scores_to_api(project_id, scores):
    url = f"http://localhost:8080/projects/{project_id}/vendorRanking/update"
    headers = {'Content-Type': 'application/json'}
    try:
        response = requests.put(url, json=scores, headers=headers)
        return response.json()
    except ConnectionError as e:
        return {'error': str(e)}


@app.route('/trigger-processing/<int:project_id>', methods=['POST'])
def trigger_processing(project_id):
    # Trigger data processing and sending to Go API
    final_scores = process_all_data(project_id=project_id)
    response = send_scores_to_api(str(project_id), final_scores)
    return response


if __name__ == "__main__":
    main()
