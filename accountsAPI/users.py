"""
This is the users module and supports all the REST actions for the USERS collection
"""

from flask import make_response, abort

# Initialized data to serve the API
USERS = {
    "0001": {
        "customerID": "0001",
        "fname": "Alice",
        "lname": "Parker",
        "balance": "15",
        "transactions": []
    },
    "0002": {
        "customerID": "0002",
        "fname": "Clark",
        "lname": "Batman",
        "balance": "20",
        "transactions": []
    },
    "0003": {
        "customerID": "0003",
        "fname": "Blue",
        "lname": "Harvest",
        "balance": "25",
        "transactions": []
    },
}


def read_all():
    """
    This function responds to a request for /api/users
    with the complete lists of users
    :return:        json string of list of users
    """
    # Create the list of users
    return [USERS[key] for key in sorted(USERS.keys())]


def read_one(customerID):
    """
    This function responds to a request for /api/users/{customerID}
    with one matching user from users
    :param customerID:   customerID of user to find
    :return:        user matching customer ID
    """
    # If customerID exists in USERS, then get the user
    if customerID in USERS:
        user = USERS.get(customerID)

    # Error if user does not exist in USERS
    else:
        abort(
            404, "Person with customer ID {customerID} not found".format(customerID=customerID)
        )

    return user

transactionID = 1
def set_transactionID():
    global transactionID    # Needed to increment transactionID to differentiate the transactions 
    transactionID += 1

def update(customerID, user):
    """
    This function updates an existing user in the users structure
    :param customerID:   customerID of user to update in the users structure
    :param user:  user to update
    :return:        updated user structure
    """
    # If customerID exists in USERS, then update the balance
    if customerID in USERS:
        USERS[customerID]["transactions"].append(transactionID)
        set_transactionID()
        USERS[customerID]["balance"] = str(float(USERS[customerID]["balance"]) + float(user.get("balance")))

        return USERS[customerID]

    # Error if user does not exist in USERS
    else:
        abort(
            404, "Person with customer ID {customerID} not found".format(customerID=customerID)
        )