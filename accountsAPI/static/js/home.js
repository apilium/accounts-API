/*
 * JavaScript file for the application to demonstrate using the API
 */

// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/users',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        update: function(customerID, balance, lname, fname, transactions) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/users/' + customerID,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'customerID': customerID,
                    'balance': balance,
                    'fname': fname,
                    'lname': lname,
                    'transactions': transactions
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_update_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $customerID = $('#customerID'),
        $balance = $('#balance');

    // Return the API
    return {
        reset: function() {
            $customerID.val('');
            $balance.val('');
        },
        update_editor: function(customerID, balance) {
            $balance.val(balance);
            $customerID.val(customerID).focus();
        },
        build_table: function(users) {
            let rows = ''

            // Clear the table
            $('.users table > tbody').empty();

            // Get the users to insert into table
            if (users) {
                for (let i=0, l=users.length; i < l; i++) {
                    rows += `<tr><td class="fname">${users[i].fname}</td><td class="lname">${users[i].lname}</td><td class="balance">${users[i].balance}</td><td class="transactions">${users[i].transactions}</td></tr>`;
                    console.log(rows)
                }
                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $customerID = $('#customerID'),
        $balance = $('#balance');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(customerID, balance) {
        return customerID !== "" && balance !== "";
    }

    // Create event handlers
    $('#update').click(function(e) {
        let customerID = $customerID.val(),
            balance = $balance.val();

        e.preventDefault();

        if (validate(customerID, balance)) {
            model.update(customerID, balance)
        } else {
            alert('Input fields cannot be empty');
        }
        e.preventDefault();
    });


    $('#reset').click(function() {
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            costumerID,
            balance;

        customerID = $target
            .parent()
            .find('td.customerID')
            .text();

        balance = $target
            .parent()
            .find('td.balance')
            .text();

        view.update_editor(customerID, balance);
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_update_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));