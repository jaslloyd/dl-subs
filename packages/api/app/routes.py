from datetime import datetime, timedelta
from flask_login import current_user, login_required
from flask import render_template, url_for, redirect, jsonify, request, make_response, session, send_from_directory
from app.models import User, Entry
from app import app, db
import jwt
from functools import wraps
from faker import Faker
import uuid
from sqlalchemy import func, desc
from sqlalchemy.sql import label
import os
import stripe
# This can now be used on all routes where login is required...

stripe.api_key = app.config['STRIPE_KEY']


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        # Need a try catch block in case the token is not valid and it can't be decoded

        current_user = User.verify_auth_token(token)
        if not current_user:
            return jsonify({'error': 'Token has expired'})
        # todo: Think about better place for this...
        current_user.last_seen = datetime.utcnow()
        session['user_is_admin'] = current_user.is_admin
        db.session.commit()
        # except:
        #     return jsonify({'message': 'Token is invalid'}), 401

        return f(current_user, *args, **kwargs)

    return decorated


def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Since we have already ran the token_required function we can check the value...
        if session['user_is_admin'] == False:
            return jsonify({'error': 'Permission Denied'}), 401

        return f(*args, **kwargs)
    return decorated


@app.route('/')
def index():
    # todo: Render react index.html (maybe)
    # The render_template() function invokes the Jinja2 template engine that comes bundled with the Flask framework.
    return render_template('index.html')


# This function will need to be changed to work with React as I am not using Flask to render my templates


@app.route('/api/login', methods=['POST', 'GET'])
def login():
    auth = request.get_json()
    print(auth['username'])
    if not auth or not auth['username'] or not auth['password']:
        return make_response('Could not verify login details', 401, {
            'WWW-Authenticate': 'Basic realm="Login Required"'
        })

    user = User.query.filter_by(username=auth['username']).first()

    # Perform some server side validation of user details then log them in
    if user is None or not user.check_password(auth['password']):
        return jsonify({'message': 'Invalid username or password'})
    else:
        # todo: Return more details
        return jsonify({'token': user.generate_auth_token()})


@app.route('/api/logout')
def logout():
    # logout_user()
    return redirect(url_for('index'))


@app.route('/api/register', methods=['GET', 'POST'])
def register():
    form_data = request.get_json()

    # Perform some server side validation of user details then add then
    user = User(username=form_data['username'])
    user.set_password(form_data['password'])
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'New User created...'})

########### User Account Routes ####################


@app.route('/api/user', methods=['GET'])
@token_required
@admin_required
def get_all_users(current_user):
    return jsonify([e.to_dict() for e in User.query.all()])


@app.route('/api/user/<username>', methods=['GET'])
@token_required
def get_one_user(current_user, username):
    user = User.query.filter_by(username=username).first_or_404()
    return jsonify(user.to_dict())


@app.route('/api/user/<username>', methods=['PUT'])
@token_required
def update_user(current_user, username):
    form_data = request.get_json()
    user = User.query.filter_by(username=username).first_or_404()

    # Add checks for if the username has changed etc...
    user.username = form_data['username']
    user.set_password(form_data['password'])

    db.session.commit()

    return jsonify({'message': 'The user has been updated...'})


@app.route('/api/user/<username>/promote', methods=['PUT'])
@token_required
@admin_required
def promote_user(current_user, username):
    form_data = request.get_json()
    user = User.query.filter_by(username=username).first_or_404()
    user.promote_user()
    db.session.commit()

    return jsonify({'message': 'The user has been promoted to an admin...'})


@app.route('/api/user/<username>', methods=['DELETE'])
@token_required
@admin_required
def delete_user(current_user, username):
    user = User.query.filter_by(username=username).first_or_404()
    db.session.delete(user)
    db.session.commit()

    return jsonify({'message': 'User has been deleted'})


############# Entries Routes ###################
@app.route('/api/entry', methods=['POST'])
@token_required
def add_entry(current_user):
    form_data = request.get_json()

    entry = Entry(name=form_data['name'], team=form_data['team'],
                  paid=int(form_data['paid']), user_id='admin')
    db.session.add(entry)
    db.session.commit()

    return jsonify({'message': 'New Subs Entry has been created...'})


@app.route('/api/summed/entry', methods=['GET'])
def get_entries_summed():
    # todo: check if its lower case...
    entries = db.session.query(Entry.name,
                               label('team', Entry.team),
                               label('last_updated', func.group_concat(
                                   Entry.timestamp)),
                               label('paid', func.group_concat(
                                   Entry.paid)),
                               label('payment_references', func.group_concat(
                                   Entry.payment_reference)),
                               label('total_paid', func.sum(Entry.paid))).group_by(Entry.name).all(),

    formatted_entries = []
    for entry in entries:
        payment_references = []
        if entry.payment_references:
            payment_references = [
                ref for ref in entry.payment_references.split(',')]
        formatted_entries.append({
            'name': entry.name,
            'team': entry.team,
            'last_updated': [timestamp for timestamp in entry.last_updated.split(',')],
            'paid': [paid for paid in entry.paid.split(',')],
            'total_paid': entry.total_paid,
            'payment_references': payment_references
        })

    return jsonify(formatted_entries)


@app.route('/api/summed/entry/team/<team>')
def get_entries_summed_by_team(team):
    entries = db.session.query(Entry.id,
                               Entry.name,
                               label('team', Entry.team),
                               label('timestamp', Entry.timestamp),
                               label('payment_references', func.group_concat(
                                   Entry.payment_reference)),
                               label('installments', func.group_concat(
                                   Entry.paid)),
                               label('paid', func.sum(Entry.paid))).group_by(Entry.name).filter_by(team=team).all()

    formatted_entries = []
    print(entries)
    for entry in entries:
        payment_references = []
        if entry.payment_references:
            payment_references = [
                ref for ref in entry.payment_references.split(',')]
        formatted_entries.append({
            'id': entry.id,
            'name': entry.name,
            'team': entry.team,
            'timestamp': entry.timestamp,
            'installments_paid': [paid for paid in entry.installments.split(',')],
            'paid': entry.paid,
            'payment_references': payment_references
        })

    return jsonify(formatted_entries)


@app.route('/api/entry', methods=['GET'])
@token_required
def get_entries(current_user):
    return jsonify([e.to_dict() for e in Entry.query.order_by(desc(Entry.timestamp)).all()])


@app.route('/api/entry/team/<team>')
def get_entries_by_team(team):
    team_formatted = team.upper()
    return jsonify([e.to_dict() for e in Entry.query.filter_by(team=team_formatted)])


@app.route('/api/entry/<id>', methods=['GET'])
@token_required
def get_entry(current_user, id):
    # Get specific entry, need to add check to get Entries for a specific user
    entry = Entry.query.filter_by(id=id).first_or_404()
    return jsonify({'entry': entry})

# Update entry


@app.route('/api/entry/<id>', methods=['PUT'])
@token_required
def update_entry(current_user, id):
    form_data = request.get_json()
    entry = Entry.query.filter_by(id=id).first_or_404()

    # update entry here...
    entry.details = form_data['details']

    db.session.commit()

    return jsonify({'message': 'Entry Updated Successfully...'})

# Delete entry


@app.route('/api/entry/<id>', methods=['DELETE'])
@token_required
def delete_entry(current_user, id):
    entry = Entry.query.filter_by(id=id).first_or_404()
    db.session.delete(entry)
    db.session.commit()

    return jsonify({'message': 'Subs Entry has been deleted'})


@app.route('/api/payment', methods=['POST'])
def take_payment():
    form_data = request.get_json()
    print(form_data)

    playerName = form_data['playerName']
    team = form_data['team']
    paymentAmount = form_data['paymentAmount']
    stripePaymentToken = form_data['token']
    customerEmail = form_data['email']
    description = "Membership payment for {}".format(playerName)

    try:
        resp = stripe.Charge.create(
            amount=paymentAmount,
            currency="EUR",
            source=stripePaymentToken,
            receipt_email=customerEmail,
            description=description
        )

        # TODO: Store in cent (Remove / 100)
        entry = Entry(name=playerName, team=team, paid=int(
            paymentAmount / 100), user_id='Stripe', payment_reference=resp.receipt_url)

        print(entry.to_dict())
        db.session.add(entry)
        db.session.commit()
        print("Success: %r" % (resp))
        return jsonify({'message': 'Payment sent successful...', 'paymentRef': resp.id, 'receiptUrl': resp.receipt_url})
    except stripe.error.StripeError as e:
        return jsonify({'error': 'Stripe Payment Failed', 'message': str(e)}), 400


@app.route('/api/payment/<id>', methods=['GET'])
def get_payment(id):
    print(id)
    print(stripe.Charge.retrieve(id))
    return jsonify({'message': stripe.Charge.retrieve(id)})


@app.route('/static/<path:path>')
def all_resources_route(path):
    return send_from_directory('static2', 'static/' + path)


@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')
